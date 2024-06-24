import React, { useState, useEffect, FormEvent, useRef } from 'react';


interface ModalProps {
    isVisible: boolean;
    onClose: () => void;
    setRefetch: () => void;
    studentId: string
    studentName : string;
  }

  interface ApiResponseType {
    message?: string | undefined
    status?: number | undefined
  }
  

  const AddNewSchedule: React.FC<ModalProps> = ({ setRefetch, isVisible, onClose, studentId, studentName }) => {
    const [isAddBtnPressed, setIsAddBtnPressed] = useState(false);
    const [error, setError] = useState('');
    const [isSuccessful, setIsSuccessful] = useState(false);
  
    const [isTeacherNameEmpty, setIsTeacherNameEmpty] = useState(false);
    const [isScheduledDateEmpty, setIsScheduledDateEmpty] = useState(false);
    const [isScheduledInTimeEmpty, setIsScheduledInTimeEmpty] = useState(false);
    const [isScheduledOutTimeEmpty, setIsScheduledOutTimeEmpty] = useState(false);
    const [isRoomNumEmpty, setIsRoomNumEmpty] = useState(false);
    const [isSubjectEmpty, setIsSubjectEmpty] = useState(false);
   
    const [isGenderEmpty, setIsGenderEmpty] = useState(false);
  
    const [newSchedule, setNewSchedule] = useState({
      studentId: '',
      teacherName: '',
      scheduledDate: '',
      scheduledInTime: '',
      scheduledOutTime: '',
      roomNum: '',
      subject: '',
    
      gender: ''
    });
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
  
      setNewSchedule((prevSchedule) => ({
        ...prevSchedule,
        [name]: value,
      }));
  
      switch (name) {
        case 'teacherName':
          setIsTeacherNameEmpty(!value.trim());
          break;
        case 'scheduledDate':
          setIsScheduledDateEmpty(!value.trim());
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
        case 'subject':
          setIsSubjectEmpty(!value.trim());
          break;
       
        case 'gender':
          setIsGenderEmpty(!value.trim());
          break;
        default:
          break;
      }
    };

    const handleAddSchedule = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      // Trim the input values
      const trimmedScheduleData = {
        ...newSchedule,
        teacherName: newSchedule?.teacherName?.trim(),
        scheduledDate: newSchedule?.scheduledDate?.trim(),
        scheduledInTime: newSchedule?.scheduledInTime?.trim(),
        scheduledOutTime: newSchedule?.scheduledOutTime?.trim(),
        roomNum: newSchedule?.roomNum?.trim(),
        subject: newSchedule?.subject?.trim(),
        gender: newSchedule?.gender?.trim(),
        studentId: studentId,
        studentName: studentName
      };
  
     
  
      // Validate fields
      let isValid = true;
  
      if (!trimmedScheduleData.teacherName) {
        setIsTeacherNameEmpty(true);
        isValid = false;
      } else {
        setIsTeacherNameEmpty(false);
      }
      if (!trimmedScheduleData.scheduledDate) {
        setIsScheduledDateEmpty(true);
        isValid = false;
        console.log('first')
      } else {
        setIsScheduledDateEmpty(false);
      }
      if (!trimmedScheduleData.scheduledInTime) {
        setIsScheduledInTimeEmpty(true);
        isValid = false;
      } else {
        setIsScheduledInTimeEmpty(false);
      }
      if (!trimmedScheduleData.scheduledOutTime) {
        setIsScheduledOutTimeEmpty(true);
        isValid = false;
      } else {
        setIsScheduledOutTimeEmpty(false);
      }
      if (!trimmedScheduleData.roomNum) {
        setIsRoomNumEmpty(true);
        isValid = false;
      } else {
        setIsRoomNumEmpty(false);
      }
      if (!trimmedScheduleData.subject) {
        setIsSubjectEmpty(true);
        isValid = false;
      } else {
        setIsSubjectEmpty(false);
      }
      if (!trimmedScheduleData.gender) {
        setIsGenderEmpty(true);
        isValid = false;
      } else {
        setIsGenderEmpty(false);
      }
  
      if (isValid) {
         // Combine date and time into DateTime string
      const combinedDateTime = combineDateTime(trimmedScheduleData.scheduledDate, trimmedScheduleData.scheduledInTime);
  
      // Replace the scheduledDate with the combinedDateTime
      const scheduleDataWithDateTime = {
        ...trimmedScheduleData,
        scheduledDate: combinedDateTime,
        
      };
        addSchedule(scheduleDataWithDateTime);
      }
    };
  
    // Function to add the schedule
    const addSchedule = async (scheduleData: typeof newSchedule) => {
      try {
        setIsAddBtnPressed(true);
        const response = await fetch('/api/add-schedule', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...scheduleData }), // Pass studentId along with other schedule data
        });
  
       
  
        if (response.status === 201) {
          setNewSchedule({
            studentId:'',
            teacherName: '',
            scheduledDate: '',
            scheduledInTime: '',
            scheduledOutTime: '',
            roomNum: '',
            subject: '',
           
            gender: '',
          });
  
          setIsSuccessful(true);  // Show success prompt
          setRefetch();
  
          setError('');
          setTimeout(() => {
            setIsSuccessful(false);
            onClose();
          }, 1500);
        } else {
          setError('Something went wrong. Please try again');
          throw new Error('Failed to add schedule');
        }
      } catch (error) {
        setError('Something went wrong. Please try again');
        console.error('Error:', error);
      } finally {
        setIsAddBtnPressed(false);
      }
    };
    const combineDateTime = (date: string, time: string): string => {
      return new Date(`${date}T${time}:00.000Z`).toISOString();
    };
    
   
  if (!isVisible) return null;


    return (
      <>
      <div data-modal-backdrop="add" aria-hidden="true" className="flex animate-fadeUp z-[99999] min-h-screen backdrop-blur-sm m-auto overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 justify-center items-center w-full md:inset-0 max-h-full">
          {!isSuccessful ? (
              <div className="relative p-4 w-full max-w-[46rem] m-auto">
                  {/* Modal content */}
                  <div className="relative bg-white rounded-lg shadow">
                      {/* Modal header */}
                      <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t gap-2">
                          <h3 className="text-lg lg:text-xl font-bold text-gray-900">
                              <i className="fa-solid fa-calendar-plus text-base lg:text-lg text-center text-[#2C384A]"></i> {'Add New Schedule for ' + studentName}
                          </h3>
                          <button onClick={(e) => { e.preventDefault(); onClose(); }} type="button" className="text-gray-400 bg-transparent hover:bg-gray-300 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="add-modal">
                              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
                                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                              </svg>
                              <span className="sr-only">Close modal</span>
                          </button>
                      </div>
                      <div className='flex justify-start gap-1 items-center px-8 pt-8 '>
         <i className="fa-solid fa-pen-to-square text-xs font-semibold text-[#2C384A]"></i>
         <span className='text-sm font-semibold'>TEACHER & SCHEDULE INFO</span>
         </div>
                         
                          {/* Modal body */}
                          <form className="pb-4 px-4 md:pb-5 md:px-5 gap-4" onSubmit={handleAddSchedule}>
                                                <div className={`grid grid-cols-2 gap-4 mt-3 ${isTeacherNameEmpty || isScheduledDateEmpty ? 'mb-[45px] smallerscreens:mb-[35px] lg:mb-[30px]' : ''}`}> 

                      <div className="rounded-lg relative">
                      <input
                      value={newSchedule?.teacherName}
                      onChange={handleInputChange}  
                      name='teacherName'
                      id='teacherName'
                      autoComplete="off"
                      type="text"
                      className={`text-sm lg:text-base block py-2 px-3 w-full text-black bg-transparent rounded-lg border-[1px] ${
                      isTeacherNameEmpty ? 'border-[#ff0000] focus:border-[#ff0000]' : 'focus:border-[#01579B]'
                      } appearance-none focus:outline-none focus:ring-0 peer`}
                      placeholder=" "
                      />
                      <label htmlFor='teacherName' className={`${isTeacherNameEmpty ? 'text-[#ff0000] peer-focus:text-[#ff0000]' : 'text-[#888] peer-focus:text-[#01579B] ' } tracking-wide absolute text-xs lg:text-sm duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-[0.625rem] peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}>
                      Full Name
                      </label>
                      {isTeacherNameEmpty && (
                      <div className="items-center gap-1 flex flex-row ml-1 absolute top-11 left-0">
                      <i className="text-[#ff0000] fa-solid text-xs mt-[2px] fa-circle-exclamation"></i> 
                      <p className="text-[#ff0000]  text-xs">

                      Teacher's full name cannot be empty
                      </p>
                      </div>
                      )}
                      </div>

                      <div className="rounded-lg relative">
            <label htmlFor="scheduledDate" className={`${isScheduledDateEmpty ? 'text-[#ff0000] peer-focus:text-[#ff0000]' : 'text-[#888] peer-focus:text-[#01579B]'} tracking-wide absolute text-xs lg:text-sm duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-[0.625rem] peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}>
                Select Date
            </label>
            <input
                id="scheduledDate"
                type="date"
                name='scheduledDate'
                value={newSchedule?.scheduledDate}
                onChange={handleInputChange}
                className={`text-sm lg:text-base block py-2 px-3 w-full text-black bg-transparent rounded-lg border-[1px] ${isScheduledDateEmpty ? 'border-[#ff0000] focus:border-[#ff0000]' : 'focus:border-[#01579B]'} appearance-none focus:outline-none focus:ring-0 peer`}
            />
            {isScheduledDateEmpty && (
                <div className="items-center gap-1 flex flex-row ml-1 absolute top-11 left-0">
                    <i className="text-[#ff0000] fa-solid text-xs mt-[2px] fa-circle-exclamation"></i> 
                    <p className="text-[#ff0000] text-xs">
                        Date cannot be empty
                    </p>
                </div>
            )}
        </div>



                      </div>

                      <div className={`grid grid-cols-2 gap-4 mt-3 ${isScheduledInTimeEmpty || isScheduledOutTimeEmpty ? 'mb-[45px] smallerscreens:mb-[35px] lg:mb-[30px]' : ''}`}> 
                      <div className="rounded-lg relative">
  <label htmlFor="scheduledInTime" className={`${isScheduledInTimeEmpty ? 'text-[#ff0000] peer-focus:text-[#ff0000]' : 'text-[#888] peer-focus:text-[#01579B]'} tracking-wide absolute text-xs lg:text-sm duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-[0.625rem] peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}>
    Time-in
  </label>
  <input
    id="scheduledInTime"
    type="time"
    name='scheduledInTime'
    value={newSchedule?.scheduledInTime}
    onChange={handleInputChange}
    className={`text-sm lg:text-base block py-2 px-3 w-full text-black bg-transparent rounded-lg border-[1px] ${isScheduledInTimeEmpty ? 'border-[#ff0000] focus:border-[#ff0000]' : 'focus:border-[#01579B]'} appearance-none focus:outline-none focus:ring-0 peer`}
  />
  {isScheduledInTimeEmpty && (
    <div className="items-center gap-1 flex flex-row ml-1 absolute top-11 left-0">
      <i className="text-[#ff0000] fa-solid text-xs mt-[2px] fa-circle-exclamation"></i> 
      <p className="text-[#ff0000] text-xs">
        Time-in cannot be empty
      </p>
    </div>
  )}
</div>

<div className="rounded-lg relative">
  <label htmlFor="scheduledOutTime" className={`${isScheduledOutTimeEmpty ? 'text-[#ff0000] peer-focus:text-[#ff0000]' : 'text-[#888] peer-focus:text-[#01579B]'} tracking-wide absolute text-xs lg:text-sm duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-[0.625rem] peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}>
    Time-out
  </label>
  <input
    id="scheduledOutTime"
    type="time"
    name='scheduledOutTime'
    value={newSchedule?.scheduledOutTime}
    onChange={handleInputChange}
    className={`text-sm lg:text-base block py-2 px-3 w-full text-black bg-transparent rounded-lg border-[1px] ${isScheduledOutTimeEmpty ? 'border-[#ff0000] focus:border-[#ff0000]' : 'focus:border-[#01579B]'} appearance-none focus:outline-none focus:ring-0 peer`}
  />
  {isScheduledOutTimeEmpty && (
    <div className="items-center gap-1 flex flex-row ml-1 absolute top-11 left-0">
      <i className="text-[#ff0000] fa-solid text-xs mt-[2px] fa-circle-exclamation"></i> 
      <p className="text-[#ff0000] text-xs">
        Time-out cannot be empty
      </p>
    </div>
  )}
</div>

                      </div>

                      <div className={`grid grid-cols-2 gap-4 mt-3 ${isRoomNumEmpty || isSubjectEmpty ? 'mb-[45px] smallerscreens:mb-[35px] lg:mb-[30px]' : ''}`}> 

<div className="rounded-lg relative">
<input
value={newSchedule?.roomNum}
onChange={handleInputChange}  
name='roomNum'
id='roomNum'
autoComplete="off"
type="text"
className={`text-sm lg:text-base block py-2 px-3 w-full text-black bg-transparent rounded-lg border-[1px] ${
  isRoomNumEmpty ? 'border-[#ff0000] focus:border-[#ff0000]' : 'focus:border-[#01579B]'
} appearance-none focus:outline-none focus:ring-0 peer`}
placeholder=" "
/>
<label htmlFor='roomNum' className={`${isRoomNumEmpty ? 'text-[#ff0000] peer-focus:text-[#ff0000]' : 'text-[#888] peer-focus:text-[#01579B] ' } tracking-wide absolute text-xs lg:text-sm duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-[0.625rem] peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}>
Room #
</label>
{isRoomNumEmpty && (
<div className="items-center gap-1 flex flex-row ml-1 absolute top-11 left-0">
<i className="text-[#ff0000] fa-solid text-xs mt-[2px] fa-circle-exclamation"></i> 
<p className="text-[#ff0000]  text-xs">

Room # cannot be empty
</p>
</div>
)}
</div>

<div className="rounded-lg relative">
<input
value={newSchedule?.subject}
onChange={handleInputChange}  
name='subject'
id='subject'
autoComplete="off"
type="text"
className={`text-sm lg:text-base block py-2 px-3 w-full text-black bg-transparent rounded-lg border-[1px] ${
  isSubjectEmpty ? 'border-[#ff0000] focus:border-[#ff0000]' : 'focus:border-[#01579B]'
} appearance-none focus:outline-none focus:ring-0 peer`}
placeholder=" "
/>
<label htmlFor='subject' className={`${isSubjectEmpty ? 'text-[#ff0000] peer-focus:text-[#ff0000]' : 'text-[#888] peer-focus:text-[#01579B] ' } tracking-wide absolute text-xs lg:text-sm duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-[0.625rem] peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}>
Subject
</label>
{isSubjectEmpty && (
<div className="items-center gap-1 flex flex-row ml-1 absolute top-11 left-0">
<i className="text-[#ff0000] fa-solid text-xs mt-[2px] fa-circle-exclamation"></i> 
<p className="text-[#ff0000]  text-xs">

Subject cannot be empty
</p>
</div>
)}
</div>



</div>


                      <div className="flex justify-center items-center   gap-4 mt-6"> 
                        
                        

                          
                      <div tabIndex={0} className={`${isGenderEmpty ? 'border-[#ff0000]' : 'focus:border-[#01579B]'} border-[1px] rounded-lg relative flex flex-row px-3 justify-start items-center`}>
                      {/* <!-- Gender label --> */}
                      <span className={`${isGenderEmpty ? 'text-[#ff0000]' : 'text-[#888] peer-focus:text-[#01579B]'} tracking-wide absolute text-sm duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#01579B] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}>Sex</span>

                      {/* <!-- Gender options --> */}
                      <div className="flex items-center flex-row justify-center p-4 flex-wrap space-x-4">
                      {/* <!-- Male option --> */}
                      <div className="flex items-center gap-1">
                      <input onChange={handleInputChange} type="radio" className="form-radio text-[#01579B]" name="gender" id='male' value="Male" />
                      <label htmlFor='male' className="text-sm lg:text-base text-[#2C384A] text-center">Male</label>
                      </div>

                      {/* <!-- Female option --> */}
                      <div className="flex items-center gap-1">
                      <input onChange={handleInputChange} type="radio" className="form-radio text-[#01579B]" name="gender" id='female' value="Female" />
                      <label htmlFor='female' className="text-sm lg:text-base text-[#2C384A] text-center">Female</label>
                      </div>

                      </div>

                      </div>

                          
                          
                        
                          </div>
                              {isGenderEmpty && (
                                  <div className="items-center justify-center gap-1 flex flex-row ml-1">
                                      <i className="text-[#ff0000] fa-solid text-xs mt-[2px] fa-circle-exclamation"></i> 
                                      <p className="text-[#ff0000]  text-xs">Sex cannot be empty</p>
                                  </div>
                              )}
                              {isAddBtnPressed ? (
                                  <button type='submit' className="flex flex-row px-5 cursor-not-allowed shadow bg-transparent border-[1px] border-[#D9D9D9] hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 items-center mx-auto w-fit my-5 gap-1 py-2 rounded-lg" disabled={isAddBtnPressed}>
                                      <span className='sr-only'>Loading...</span>
                                      <div className='h-2 w-2 bg-[#D9D9D9] rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                                      <div className='h-2 w-2 bg-[#D9D9D9] rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                                      <div className='h-2 w-2 bg-[#D9D9D9] rounded-full animate-bounce'></div>
                                  </button>
                              ) : (
                                  <button type='submit' className="flex flex-row px-5 cursor-pointer shadow bg-transparent border-[1px] border-[#D9D9D9] hover:bg-[#D9D9D9] hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 items-center mx-auto w-fit my-5 gap-1 py-3 rounded-lg" disabled={isAddBtnPressed}>
                                      <i className="fa-solid fa-calendar-plus text-xs lg:text-sm text-center text-[#2C384A]"></i>
                                      <span className=" font-semibold text-sm  ">Add Schedule</span>
                                  </button>
                              )}
                              {error && 
                                  <div className="flex flex-row items-center justify-center gap-1 text-[#ff0000]">
                                      <i className="fa-solid fa-circle-exclamation text-[13px]"></i>
                                      <p className="text-[13px]">{error}</p>
                                  </div>
                              }
                          </form>
                     
                  </div>
              </div>
          ) : (
              // If successful
              <div id="alert-3" className="animate-fadeUp absolute bottom-0 flex items-center p-4 mb-4 text-[#28a745] rounded-lg bg-green-50" role="alert">
                  <i className="text-[#28a745] fa-solid fa-check "></i>
                  <span className="sr-only">Success</span>
                  <div className="ms-3 text-sm font-medium">
                      Schedule was successfully added to the student
                  </div>
              </div>
          )}
      </div>
  </>
    )
}

export default AddNewSchedule;