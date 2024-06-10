import PageLoader from '@/app/components/PageLoader';
import { Schedule, User } from '@prisma/client';
import React, { ChangeEvent, useEffect, useState } from 'react'
import moment from 'moment';
import 'moment/locale/en-gb';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/shadcn/alert-dialog"
import RemoveSchedule from './RemoveSchedule';
import RemoveSchedulesByDate from './RemoveSchedulesByDate';


interface ModalProps {
    studentId: string;
    studentName: string;
    isVisible: boolean;
    onClose: () => void;
    setRefetch: () => void;
  }

  interface ApiResponseType {
    message?: string | undefined
    status?: number | undefined
  }


const ScheduleInfo: React.FC<ModalProps> = ({setRefetch, studentId, studentName, isVisible, onClose })  => {

    
const [originalStudentSchedule, setOriginalStudentSchedule] =useState<Schedule[]>([]);

const [studentSchedule, setStudentSchedule] = useState<Schedule[]>([]);
const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
const [isEditMode, setIsEditMode] = useState(false);

    const [error, setError] = useState('')
    const [isFetchSuccessful, setIsFetchSuccessful] = useState(false);
    const [isSavePressed, setIsSavePressed] = useState(false)
    const [isUpdateSuccessful, setIsUpdateSuccessful] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [editingRowId, setEditingRowId] = useState<string | null>(null);
    
      // Validation states
      const [isTeacherNameEmpty, setIsTeacherNameEmpty] = useState(false);
      const [isScheduledInTimeEmpty, setIsScheduledInTimeEmpty] = useState(false);
      const [isScheduledOutTimeEmpty, setIsScheduledOutTimeEmpty] = useState(false);
      const [isRoomNumEmpty, setIsRoomNumEmpty] = useState(false);
      const [isSubjectEmpty, setIsSubjectEmpty] = useState(false);
      // const [refetch, setIsisRefetch] = useState(false);
     
      const [editValues, setEditValues] = useState({
        teacherName: '',
        gender: '',
        subject: '',
        scheduledInTime: '',
        scheduledOutTime: '',
        roomNum: '',
       
      });
      
    
      
      const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>, rowId: string, schedule : Schedule) => {
        e.preventDefault()
        setEditingRowId(rowId);
        setEditValues({
          teacherName: schedule.teacherName || '',
          gender: schedule.gender || '',
          subject: schedule.subject || '',
          scheduledInTime: schedule.scheduledInTime || '',
          scheduledOutTime: schedule.scheduledOutTime || '',
          roomNum: schedule.roomNum || '',
      
        });
      };
    
      // Function to handle input change
      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditValues({ ...editValues, [name]: value });
    
        // Reset state variables when the corresponding input field is not empty
        switch (name) {
            case 'teacherName':
                setIsTeacherNameEmpty(!value.trim());
                break;
           
            case 'subject':
                setIsSubjectEmpty(!value.trim());
                break;
            case 'scheduledInTime':
                setIsScheduledInTimeEmpty(!value.trim());
                break;
            case 'scheduledOutTime':
                setIsScheduledOutTimeEmpty(!value.trim());
                break;
            case 'roomNum':
                setIsRoomNumEmpty(!value.trim());
                break;
           
            default:
                break;
        }
    };
    
    
    const updateStudentSchedule = async () => {
      try {
        setIsSavePressed(true);
    
        // Check if there are changes
    const originalSchedule = originalStudentSchedule.find(schedule => schedule.id === editingRowId);
    if (!originalSchedule) {
      console.error('Original schedule not found.');
      return;
    }

    const hasChanges = (editValues: Partial<Schedule>, originalSchedule: Schedule): boolean => {
      return Object.keys(editValues).some((key) => {
        const scheduleKey = key as keyof Schedule;
        return editValues[scheduleKey] !== originalSchedule[scheduleKey];
      });
    };

    if (!hasChanges(editValues, originalSchedule)) {
      setError('No changes were made');
      return;
    }

    
        const response = await fetch('/api/schedule-info', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: editingRowId, updatedSchedule: editValues })
        });
    
        if (response.ok) {
          const updatedSchedule = await response.json();
          const updatedSchedules = studentSchedule.map(schedule =>
            schedule.id === editingRowId ? updatedSchedule : schedule
          );
          setStudentSchedule(updatedSchedules);
           resetErrorStates();
          setEditingRowId(null);
          setRefetch(); // Triggers the useEffect to refetch data
          setIsUpdateSuccessful(true);
    
          // Hide the prompt after 2.5 seconds
          setTimeout(() => {
            setIsUpdateSuccessful(false);
          }, 1000);
    
         
        } else {
          setError('Failed to update schedule');
          console.error('Failed to update schedule');
        }
      } catch (error) {
        setError('Something went wrong');
        console.error('Error updating schedule:', error);
      } finally {
        setIsSavePressed(false);
      }
    };
    

      const handleSaveChanges = ((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        let isValid = true;
    
        if (!editValues.teacherName.trim()) {
            setIsTeacherNameEmpty(true);
            isValid = false;
        } 
    
       
    
        if (!editValues.subject.trim()) {
            setIsSubjectEmpty(true);
            isValid = false;
        } 
    
        if (!editValues.scheduledInTime.trim()) {
            setIsScheduledInTimeEmpty(true);
            isValid = false;
        } 
    
        if (!editValues.scheduledOutTime.trim()) {
            setIsScheduledOutTimeEmpty(true);
            isValid = false;
        } 
    
        if (!editValues.roomNum.trim()) {
            setIsRoomNumEmpty(true);
            isValid = false;
        } 
    
       
    
        if (isValid) {
  updateStudentSchedule();
 }
      })

      // Function to handle discard button click
      const handleDiscardChanges = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        resetErrorStates()
        setEditingRowId(null);
      };



  const resetErrorStates = () => {
    setIsTeacherNameEmpty(false);
   
    setIsScheduledInTimeEmpty(false);
    setIsScheduledOutTimeEmpty(false);
    setIsRoomNumEmpty(false);
    setIsSubjectEmpty(false);
   
    setError('')
  };


  

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch('/api/schedule-info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ studentId }),
        });

        if (!response.ok) {
          setIsFetchSuccessful(false);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: Schedule[] = await response.json();
        setOriginalStudentSchedule(data);
        setStudentSchedule(data);
        setIsFetchSuccessful(true);
        let currentDate: Date = moment().startOf('day').toDate(); // Current date
        let nearestDate: Date | null = null; // Nearest upcoming date
        
        data.forEach(schedule => {
          const scheduleDate: Date = moment(schedule.scheduledDate).startOf('day').toDate();
          
          if (!nearestDate && moment(scheduleDate).isAfter(currentDate, 'day')) {
            nearestDate = scheduleDate; // Set nearestDate if found first upcoming date
          } else if (nearestDate && moment(scheduleDate).isAfter(currentDate, 'day') && moment(scheduleDate).isBefore(nearestDate, 'day')) {
            nearestDate = scheduleDate; // Update nearestDate if we find a closer upcoming date
          }
        });
        
        // If no future date is found, default to today's date
        if (!nearestDate) {
          nearestDate = currentDate;
        }
        
        setSelectedDate(nearestDate);

        
        const initialFilteredSchedules = data.filter((schedule) => {
            const scheduleDate = moment(schedule.scheduledDate).startOf('day');
            return scheduleDate.isSame(moment(nearestDate).startOf('day'), 'day');
          });
          setFilteredSchedules(initialFilteredSchedules);
  
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setIsFetchSuccessful(false);
      }
    };

    fetchSchedules();
  }, [studentId, setRefetch]);
  
  
        


  const formatDate = (dateString: string | Date | null) => {
    return moment(dateString).format('MM/DD/YYYY');
};
  

  const formatTime = (timeString: string) => {
    return moment(timeString, 'HH:mm').format('hh:mm A');
  };

  const isDateWithSchedule = (date: string | Date) => {
    return studentSchedule.some((schedule: Schedule) =>
      moment(schedule.scheduledDate).isSame(moment(date), 'day')
    );
  };
  
  
  // Handle date selection
  const onSelectDate = (date: Date) => {
    // Update selected date
    setSelectedDate(date);
    
    // Filter schedules based on the selected date
    const filteredSchedules = studentSchedule.filter((schedule) => {
      const scheduleDate = moment(schedule.scheduledDate).startOf('day');
      return scheduleDate.isSame(moment(date).startOf('day'), 'day');
    });
    
    // Set filtered schedules
    setFilteredSchedules(filteredSchedules);
  };
    if(!isVisible) {
        return null
    }

  return (
    <div data-modal-backdrop="add" aria-hidden="true" className="flex animate-fadeUp z-50 min-h-screen backdrop-blur-sm m-auto overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 justify-center items-center w-full md:inset-0 max-h-full">

{!isUpdateSuccessful

?
 
  
  <div className={`relative p-4 w-full ${isFetchSuccessful ? 'max-w-fit' : 'max-w-[50rem]' } m-auto`}>



 
    <div className="relative bg-white rounded-lg shadow">
      {/* <!-- Modal header --> */}
      <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t gap-2">
        <h3 className="text-lg lg:text-xl font-bold text-gray-900">
          <i className="fa-solid fa-calendar-days text-base lg:text-lg text-center text-[#2C384A]"></i> {`${studentName|| ''}'s Schedule`}
        </h3>
        <button onClick={(e) => { e.preventDefault(); onClose(); }} type="button" className="text-gray-400 bg-transparent hover:bg-gray-300 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="add-modal">
          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
          <span className="sr-only">Close modal</span>
        </button>
      </div>
      {!isFetchSuccessful
  ?
  <div className='flex space-x-2 justify-center items-center bg-white h-[70vh] '>
      <span className='sr-only'>Loading...</span>
       <div className='h-3 w-3 lg:h-4 lg:w-4 bg-[#01579B] rounded-full animate-bounce [animation-delay:-0.3s]'></div>
     <div className='h-3 w-3 lg:h-4 lg:w-4 bg-[#01579B] rounded-full animate-bounce [animation-delay:-0.15s]'></div>
     <div className='h-3 w-3 lg:h-4 lg:w-4 bg-[#01579B] rounded-full animate-bounce'></div>
   </div>

  :
      
        <div className='flex flex-col gap-4 p-6'>
           {studentSchedule?.length > 0 && filteredSchedules?.length > 0 ? (
            <>
        <RemoveSchedulesByDate 
    selectedDate={selectedDate}
    setRefetch={setRefetch}
    onSelectDate={onSelectDate}
    formatDate={formatDate}
    isDateWithSchedule={isDateWithSchedule}
/>
    <div className="overflow-auto">
 
    <table className="table-auto rounded-lg w-fit mx-auto text-black text-left rtl:text-right">
      <thead className="bg-[#2C384A] shadow drop-shadow rounded-lg">
        <tr className="shadow drop-shadow">
          <th scope="col" className="px-4 py-2 text-center text-sm lg:text-base text-white shadow drop-shadow">TEACHER NAME</th>
          <th scope="col" className="px-4 py-2 text-center text-sm lg:text-base text-white shadow drop-shadow">GENDER</th>
          <th scope="col" className="px-4 py-2 text-center text-sm lg:text-base text-white shadow drop-shadow">SUBJECT</th>
          <th scope="col" className="px-4 py-2 text-center text-sm lg:text-base text-white shadow drop-shadow">TIME</th>
          <th scope="col" className="px-4 py-2 text-center text-sm lg:text-base text-white shadow drop-shadow">ROOM NO.</th>
          <th scope="col" className="px-4 py-2 text-center text-sm lg:text-base text-white shadow drop-shadow">ATTENDANCE STATUS</th>
          <th scope="col" className="px-4 py-2 text-center text-sm lg:text-base text-white shadow drop-shadow">ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        {filteredSchedules.map((schedule) => (
          <tr key={schedule.id}>
            <td className={`bg-${editingRowId === schedule.id ? 'white' : 'gray-100'} w-[50%] px-4 py-2 shadow drop-shadow text-center `}>
              {editingRowId === schedule.id ? (
               <>
               <input
               autoComplete='off'
                  type="text"
                  name="teacherName"
                  value={editValues.teacherName}
                  onChange={handleInputChange}
                className={`min-w-[14rem] w-full px-2 py-1 border-[1px] rounded-lg 
              ${isTeacherNameEmpty ? 'border-[#ff0000] focus:border-[#ff0000]' : 'focus:border-[#01579B]'} appearance-none focus:outline-none focus:ring-0 peer`}
                />

                {isTeacherNameEmpty && (
                  <div className="items-center gap-1 flex flex-row text-nowrap">
                    <i className="text-[#ff0000] fa-solid text-xs mt-[2px] fa-circle-exclamation"></i>
                    <p className="text-[#ff0000] text-xs">Teacher's full name cannot be empty</p>
                  </div>
                )}
                </>
              ) : (
                schedule.teacherName || 'N/A'
              )}
            </td>
            <td className={`bg-${editingRowId === schedule.id ? 'white' : 'gray-100'} px-4 py-2 shadow drop-shadow text-center`}>
              {editingRowId === schedule.id ? (
                <div className="relative">
                <select
                value={editValues.gender}
                onChange={handleInputChange}
                name="gender"
                id="gender"
                autoComplete="off"
               className="min-w-[10rem] w-full px-2 py-1 border-[1px] rounded-lg 
              focus:border-[#01579B] appearance-none focus:outline-none focus:ring-0 peer"
              >
                <option value="" disabled>
                  Select Sex
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
                
                
                <div className="absolute inset-y-0 right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              </div>
              ) : (
                schedule.gender || 'N/A'
              )}
            </td>
            <td className={`bg-${editingRowId === schedule.id ? 'white' : 'gray-100'} w-[25%] px-4 py-2 shadow drop-shadow text-center`}>
              {editingRowId === schedule.id ? (
                 <>
                 <input
                 autoComplete='off'
                    type="text"
                    name="subject"
                    value={editValues.subject}
                    onChange={handleInputChange}
                  className={`min-w-[13rem] w-full px-2 py-1 border-[1px] rounded-lg 
                ${isSubjectEmpty ? 'border-[#ff0000] focus:border-[#ff0000]' : 'focus:border-[#01579B]'} appearance-none focus:outline-none focus:ring-0 peer`}
                  />
  
                  {isSubjectEmpty && (
                    <div className="items-center gap-1 flex flex-row text-nowrap">
                      <i className="text-[#ff0000] fa-solid text-xs mt-[2px] fa-circle-exclamation"></i>
                      <p className="text-[#ff0000] text-xs">Subject cannot be empty</p>
                    </div>
                  )}
                  </>
              ) : (
                schedule.subject || 'N/A'
              )}
            </td>
            <td className={`bg-${editingRowId === schedule.id ? 'white' : 'gray-100'} px-4 py-2 shadow drop-shadow text-center text-nowrap`}>
              {editingRowId === schedule.id ? (
                <div className='flex flex-col w-full justify-center items-center'>
                
                <>
                 <input
                 autoComplete='off'
                    type="time"
                    name="scheduledInTime"
                    value={editValues.scheduledInTime}
                    onChange={handleInputChange}
                  className={`w-full px-2 py-1 border-[1px] rounded-lg 
                ${isScheduledInTimeEmpty ? 'border-[#ff0000] focus:border-[#ff0000]' : 'focus:border-[#01579B]'} appearance-none focus:outline-none focus:ring-0 peer`}
                  />
  
                  {isScheduledInTimeEmpty && (
                    <div className="items-center gap-1 flex flex-row text-nowrap">
                      <i className="text-[#ff0000] fa-solid text-xs mt-[2px] fa-circle-exclamation"></i>
                      <p className="text-[#ff0000] text-xs">Time-in cannot be empty</p>
                    </div>
                  )}
                  </>
                  <span>to </span>
                  <>
                 <input
                 autoComplete='off'
                    type="time"
                    name="scheduledOutTime"
                    value={editValues.scheduledOutTime}
                    onChange={handleInputChange}
                  className={`w-full px-2 py-1 border-[1px] rounded-lg 
                ${isScheduledOutTimeEmpty ? 'border-[#ff0000] focus:border-[#ff0000]' : 'focus:border-[#01579B]'} appearance-none focus:outline-none focus:ring-0 peer`}
                  />
  
                  {isScheduledOutTimeEmpty && (
                    <div className="items-center gap-1 flex flex-row text-nowrap">
                      <i className="text-[#ff0000] fa-solid text-xs mt-[2px] fa-circle-exclamation"></i>
                      <p className="text-[#ff0000] text-xs">Time-out cannot be empty</p>
                    </div>
                  )}
                  </>
                </div>
              ) : (
                `${formatTime(schedule.scheduledInTime)} - ${formatTime(schedule.scheduledOutTime)}` || 'N/A'
              )}
            </td>
            <td className={`bg-${editingRowId === schedule.id ? 'white' : 'gray-100'} w-[25%] px-4 py-2 shadow drop-shadow text-center`}>
              {editingRowId === schedule.id ? (
                 <>
                 <input
                 autoComplete='off'
                    type="text"
                    name="roomNum"
                    value={editValues.roomNum}
                    onChange={handleInputChange}
                  className={`min-w-[11rem] w-full px-2 py-1 border-[1px] rounded-lg 
                ${isRoomNumEmpty ? 'border-[#ff0000] focus:border-[#ff0000]' : 'focus:border-[#01579B]'} appearance-none focus:outline-none focus:ring-0 peer`}
                  />
  
                  {isRoomNumEmpty && (
                    <div className="items-center gap-1 flex flex-row text-nowrap">
                      <i className="text-[#ff0000] fa-solid text-xs mt-[2px] fa-circle-exclamation"></i>
                      <p className="text-[#ff0000] text-xs">Room no. cannot be empty</p>
                    </div>
                  )}
                  </>
              ) : (
                schedule.roomNum || 'N/A'
              )}
            </td>
            <td className={`bg-gray-100 px-4 py-2 shadow drop-shadow text-center`}>
              {schedule.attendanceStatus || 'N/A'}
              </td>
            <td className={`bg-${editingRowId === schedule.id ? 'white' : 'gray-100'} px-4 py-2 shadow drop-shadow text-center`}>
              {editingRowId === schedule.id ? (
                <>
                <div className="flex flex-row gap-4 items-center justify-center ">
                  {isSavePressed ?
                   <button
                   disabled={isSavePressed}
                   className={`bg-transparent border-[1px] border-[#D9D9D9]  hover:bg-[#D9D9D9]  hover:border-transparent hover:text-white transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 shadow w-fit ml-auto rounded-lg px-2 py-1 cursor-pointer flex justify-center flex-row items-center gap-1`}
                 >
                  <span className='sr-only'>Loading...</span>

                    <div className='h-2 w-2 bg-[#D9D9D9] rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                    <div className='h-2 w-2 bg-[#D9D9D9] rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                    <div className='h-2 w-2 bg-[#D9D9D9] rounded-full animate-bounce'></div>
                 </button>
                :
                <button onClick={handleSaveChanges} type='button'  className="flex flex-row px-5 cursor-pointer shadow  bg-transparent  border-[1px] border-[#D9D9D9]  hover:bg-[#D9D9D9]  hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 items-center mx-auto w-fit  gap-1 py-1 rounded-lg" disabled={isSavePressed} >
                <i className="fa-solid fa-floppy-disk text-xs lg:text-sm text-center text-[#2C384A]"></i>
                <span className=" font-semibold text-sm  ">Save</span>
                
                
                </button>
                }
                  
                  <AlertDialog>
<AlertDialogTrigger className="bg-transparent border-[1px] border-[#ff0000] border-dashed hover:bg-[#ff0000] hover:text-white hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 shadow w-fit mx-auto rounded-lg px-2 py-1 cursor-pointer flex justify-center flex-row items-center gap-1">

<i className="fa-solid text-xs font-semibold fa-trash "></i>
<span className=" font-semibold text-xs lg:text-sm  text-center">Discard </span>


</AlertDialogTrigger>
<AlertDialogContent>
<AlertDialogHeader>
<AlertDialogTitle>Discard Changes</AlertDialogTitle>
<AlertDialogDescription>
Are you sure you want to discard your changes? Any unsaved information will be lost.
</AlertDialogDescription>
</AlertDialogHeader>
<AlertDialogFooter>

<AlertDialogCancel>No</AlertDialogCancel>
<AlertDialogAction className="bg-[#2C384A]" onClick={handleDiscardChanges} >
Yes
</AlertDialogAction>
</AlertDialogFooter>

</AlertDialogContent>
</AlertDialog>

                </div>
                {error && 
<div className="pt-2 flex flex-row items-center justify-center gap-1 text-[#ff0000]   ">
<i className="fa-solid fa-circle-exclamation text-[13px]"></i>
<p className="  text-[13px]">{error}</p>

</div>
}
                </>
              ) : (
                <div className="flex flex-row items-center justify-center gap-4">
                <button
                  onClick={(e) => handleEditClick(e, schedule.id, schedule)}
                  className={`bg-transparent border-[1px] border-[#D9D9D9] hover:bg-[#D9D9D9] hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 shadow w-fit mx-auto rounded-lg px-2 py-1 cursor-pointer flex justify-center flex-row items-center gap-1`}
                >
                  <i className={`fa-solid text-xs font-semibold fa-pen-to-square text-[#2C384A]'}`}></i>
                  <span className="text-xs lg:text-sm font-semibold">Edit</span>
                </button>

                <RemoveSchedule
          editingRowId={schedule?.id}
          setRefetch={setRefetch}
        />

                  </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
 
</div>
</>
) : (
  <p className=" px-4 py-2 text-center font-semibold">No schedule(s) found for this student.</p>
)}
      </div>
      }
    </div>
    
  </div>
  :
  <div id="alert-3" className="animate-fadeUp absolute bottom-0 flex items-center p-4 mb-4 text-[#28a745] rounded-lg bg-green-50  " role="alert">
  <i className="text-[#28a745] fa-solid fa-check "></i>
<span className="sr-only">Success</span>
<div className="ms-3 text-sm font-medium">
Student Schedule has been successfully updated
</div>
</div>

  }   
</div>

  )
}

export default ScheduleInfo