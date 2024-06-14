'use client'
//External Libraries
import Image from "next/image"
import moment from "moment"
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


//Components
import Footer from "@/app/components/MainFooter"
import Header from "@/app/components/Header"
import Sidebar from "@/app/components/Sidebar"
import PageLoader from "@/app/components/PageLoader"
import AccessDenied from "@/app/components/AccessDenied"
import { useEffect, useMemo, useState } from "react"
import {  User } from "@prisma/client"
import DatePicker from "react-datepicker";
import CustomDateInput from "@/app/components/CustomDateInput";
import 'react-datepicker/dist/react-datepicker.css';
import SidePageLoader from "@/app/components/SidePageLoader";
import UpdateAttendanceStatus from "./UpdateAttendanceStatus"

//Images
import attendance from '@/app/Images/attendance.png'
import maleProf from '@/app/Images/male-prof.png'
import femaleProf from '@/app/Images/female-prof.png'
import present from '@/app/Images/present.png'
import late from '@/app/Images/late.png'
import absent from '@/app/Images/absent.png'
import pending from '@/app/Images/pending.png'
import calendar from '@/app/Images/calendar.png'
import profile from '@/app/Images/profile.png'
import unavailable from '@/app/Images/not-allowed.png'
import nothinghere from '@/app/Images/noneplaceholder.png'

interface Schedule {
  id: string;
  studentId: string | null;
  teacherName: string | null;
  scheduledDate: Date;
  scheduledInTime: string;
  scheduledOutTime: string;
  roomNum: string | null;
  subject: string | null;
  attendanceStatus: string | null;
  gender: string | null;
  createdAt: Date;
  canMark?: boolean; // New property to indicate if marking is allowed
}


const Attendance = () => {
    const [isStudent, setIsStudent] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [refetch, setRefetch] = useState<boolean>(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
    const [isFetchSuccessful, setIsFetchSuccessful] = useState(false);
    const [userData, setUserData] = useState<User | null>(null);
    const [userSchedules, setUserSchedules] = useState<Schedule[]>([]);
    const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | string | null>(null);
    const [editingRowId, setEditingRowId] = useState<string | null>(null);
    
    
    useEffect(() => {
        const validateStudent = async () => {
            try {
                const response = await fetch('/api/validate-student', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // Include cookies in the request
                });
    
                if (response.status === 200) {
                  setIsStudent(true);
                } else {
                  setIsStudent(false);
                  
                }
            } catch (error) {
              setIsStudent(false);
              
            }  finally {
              setIsLoading(false)
            }
            
        };
    
        validateStudent();
    }, []);

     // Fetch user profile data
     useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch('/api/current-user-profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // Include cookies in the request
                });
    
                if (!response.ok) {
                  setIsFetchSuccessful(false);
                    throw new Error(`HTTP error! Status: ${response.status}`);
                    
                }
    
                const data : User = await response.json();
            
                setUserData(data);
                setIsFetchSuccessful(true);
            } catch (error) {
                console.error("Error fetching user profile:", error);
                setIsFetchSuccessful(false);
            }
        };
    
        fetchUserProfile();
    }, []);


    useEffect(() => {
       
        const fetchUserSchedule = async () => {
            try {
                const response = await fetch('/api/schedule-info', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // Include cookies in the request
                    body: JSON.stringify({ studentId: userData?.id }),
                });
    
                if (!response.ok) {
                  setIsFetchSuccessful(false);
                  console.log(userData?.id)
                    throw new Error(`HTTP error! Status: ${response.status}`);
                    
                }
                
                const data : Schedule[] = await response.json();
              
                setUserSchedules(data);
                setRefetch(false)
                setIsFetchSuccessful(true);
                let currentDate: Date = moment().startOf('day').toDate();
                let nearestDate: Date | null = null;
                
                data.map(schedule => {
                    // Parse scheduleDate and scheduleDateTime
                    const scheduleDate = moment(schedule.scheduledDate).startOf('day');
                    const scheduleDateTime = moment(`${scheduleDate.format('YYYY-MM-DD')} ${schedule.scheduledInTime}`, 'YYYY-MM-DD HH:mm');
                    const currentDateTime = moment();
                
                    // Check if current day matches schedule day
                    if (scheduleDate.isSame(moment(), 'day')) {
                        nearestDate = scheduleDate.toDate();
                        if (currentDateTime.isSameOrAfter(scheduleDateTime)) {
                            schedule.canMark = true;
                        } else {
                            schedule.canMark = false;
                        }
                    } else if (!nearestDate && scheduleDate.isAfter(moment(), 'day')) {
                        nearestDate = scheduleDate.toDate();
                    } else if (nearestDate && scheduleDate.isAfter(moment(), 'day') && scheduleDate.isBefore(nearestDate, 'day')) {
                        nearestDate = scheduleDate.toDate();
                    }
                
                  
                
                  
                });
                
                // Default to today's date if no future date is found
                if (!nearestDate) {
                    nearestDate = currentDate;
                }
                
                setSelectedDate(nearestDate);

                // Create a moment object for the scheduled time today
   
    

const initialFilteredSchedules = data.filter((schedule) => {
  const scheduleDate = moment(schedule.scheduledDate).startOf('day');
  return scheduleDate.isSame(moment(nearestDate).startOf('day'), 'day');
});
setFilteredSchedules(initialFilteredSchedules);

                
                
                
                 
            } catch (error) {
                console.error("Error fetching user schedules:", error);
                setIsFetchSuccessful(false);
            }
        };
    
        fetchUserSchedule();
      
    }, [userData?.id, refetch]);


   

    const formatTime = (timeString: string) => {
        return moment(timeString, 'HH:mm').format('hh:mm A');
      };
      const scheduledDates = userSchedules.map(schedule => 
        moment(schedule.scheduledDate).startOf('day').toDate()
      );

    
    
      // Function to check if a date has a schedule
const isDateWithSchedule = (date: string | Date) => {
  
    
    return scheduledDates.some((scheduledDate) =>
      moment(scheduledDate).isSame(moment(date), 'day')
    );
  };
  

  
 
  
  // Handle date selection
  const onSelectDate = (date: Date) => {
    // Update selected date
    setSelectedDate(date);
    
    // Filter schedules based on the selected date
    const filteredSchedules = userSchedules.filter((schedule) => {
      const scheduleDate = moment(schedule.scheduledDate).startOf('day');
      return scheduleDate.isSame(moment(date).startOf('day'), 'day');
    });
    
    // Set filtered schedules
    setFilteredSchedules(filteredSchedules);
  };
      
 // Memoized sorting function to sort by the latest scheduledInTime and scheduledOutTime
  const sortLatestInOutTimes = useMemo(() => {
    return [...filteredSchedules].sort((a, b) => {
      const scheduledInTimeA = new Date(`1970-01-01T${a.scheduledInTime}:00Z`).getTime();
      const scheduledInTimeB = new Date(`1970-01-01T${b.scheduledInTime}:00Z`).getTime();
      const scheduledOutTimeA = new Date(`1970-01-01T${a.scheduledOutTime}:00Z`).getTime();
      const scheduledOutTimeB = new Date(`1970-01-01T${b.scheduledOutTime}:00Z`).getTime();

      // First compare by scheduledInTime, then by scheduledOutTime
      if (scheduledInTimeB !== scheduledInTimeA) {
        return scheduledInTimeA - scheduledInTimeB;
      }
      return scheduledOutTimeA - scheduledOutTimeB;
    });
  }, [filteredSchedules]);


  
  const handleMarkClick = (e:React.MouseEvent<HTMLButtonElement>, scheduleId: string) => {
    e.preventDefault()
    setEditingRowId(scheduleId);
    setIsUpdatingStatus(true);
};

const handleCancelOperation = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault()
  
  setEditingRowId(null);
};

    if (isLoading) {
        return (
          <PageLoader/>
        );
      }


      return (
        <>
          {isStudent ? (
            <div className="max-w-[2050px] mx-auto">
              <Header headingImg={attendance} headingName="ATTENDANCE" />
              <Sidebar />
              <div id="container" className="p-4 lg:ml-64 min-h-screen animate-fadeUp">
                {isFetchSuccessful ? (
                  <>
                    {userSchedules?.length > 0 && sortLatestInOutTimes?.length > 0 ? (
                      <> 
                      <div className="p-0 lg:p-4 overflow-y-auto mt-[3em] lg:mt-[4em] rounded-lg">
                        <div
                          style={{ border: '1px solid #D9D9D9' }}
                          className="flex flex-col gap-6 justify-center mx-auto items-center mb-10 lg:mb-6 w-fit p-4 rounded-lg shadow drop-shadow"
                        >
                          <h1 className="font-bold text-center">ATTENDANCE STATUS INDICATORS</h1>
                          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                            <li className="flex flex-col items-center shadow drop-shadow p-2 rounded-lg bg-[#D9D9D9]">
                              <span className="font-bold text-sm text-center">PRESENT</span>
                              <Image src={present} className="w-8 h-auto" alt="present" />
                            </li>
                            <li className="flex flex-col items-center shadow drop-shadow p-2 rounded-lg bg-[#D9D9D9]">
                              <span className="font-bold text-sm text-center">LATE</span>
                              <Image src={late} className="w-8 h-auto" alt="late" />
                            </li>
                            <li className="flex flex-col items-center shadow drop-shadow p-2 rounded-lg bg-[#D9D9D9]">
                              <span className="font-bold text-sm text-center">ABSENT</span>
                              <Image src={absent} className="w-8 h-auto" alt="absent" />
                            </li>
                            <li className="flex flex-col items-center shadow drop-shadow p-2 rounded-lg bg-[#D9D9D9]">
                              <span className="font-bold text-sm text-center">PENDING</span>
                              <Image src={pending} className="w-8 h-auto" alt="pending" />
                            </li>
                          </ul>
                        </div>
                      </div>
                    
      
                    <div className="lg:hidden">
                    <DatePicker
                selected={selectedDate}
                onChange={onSelectDate}
                filterDate={isDateWithSchedule}
                customInput={<CustomDateInput value={selectedDate} onClick={() => {}} />} // Pass value and onClick
                
                />
                      <ul className="mt-6 grid grid-cols-1 relative gap-6">
                      {sortLatestInOutTimes?.map((schedule:Schedule) => (
                        <li key={schedule?.id}
                          style={{ border: '1px solid #D9D9D9' }}
                          className="flex flex-wrap flex-col items-start gap-3 p-3 rounded-lg shadow drop-shadow"
                        >
                        {schedule?.attendanceStatus
                              ?
                              <Image 
                              id="attendanceStatus" 
                              src={
                                  schedule?.attendanceStatus === 'PENDING' ? pending :
                                  schedule?.attendanceStatus === 'LATE' ? late :
                                  schedule?.attendanceStatus === 'ABSENT' ? absent :
                                  schedule?.attendanceStatus === 'PRESENT' ? present :
                                  '' // Empty string for the else case
                              } 
                             className="w-8 h-auto mb-20 absolute right-0 top-0 me-4 py-2"
                              alt="" 
                              />
                              :
                              <span>N/A</span>
                              }
                            <Image className="flex w-16 px-2 h-auto" alt=""  
                            src={schedule?.gender === 'Male' ? maleProf : (schedule?.gender === 'Female' ? femaleProf : profile)} />
                          <div className="flex flex-col">
                            <h3 className="font-bold text-lg">{schedule?.teacherName || 'N/A'}</h3>
                            <h4 className="text-xs mt-2 text-[#333333]">Scheduled Time: <br /></h4>
                            <div className="space-x-6">
                              <span className="text-xs font-semibold">In: {formatTime(schedule?.scheduledInTime) || 'N/A'}</span>
                              <span className="text-xs font-semibold">Out: {formatTime(schedule?.scheduledOutTime) || 'N/A'}</span>
                            </div>
                            <span className="text-sm mt-4 font-semibold">{schedule?.roomNum || 'N/A'} ({schedule?.subject || 'N/A'})</span>
                            {editingRowId === schedule.id ? 
                              <div className="space-y-6">
                              <UpdateAttendanceStatus
                                currentAttendanceStatus={schedule?.attendanceStatus}
                                  setRefetch={() => setRefetch(true)}
                                  isVisible={editingRowId === schedule.id}
                                  onClose={() => setEditingRowId(null)}
                                  scheduleId={schedule.id}
                                  teacherName={schedule?.teacherName}
                              />

                              <AlertDialog>
                              <AlertDialogTrigger className="bg-transparent border-[1px] border-[#ff0000] border-dashed hover:bg-[#ff0000] hover:text-white hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 shadow w-fit mr-auto rounded-lg px-2 py-1 cursor-pointer flex justify-center flex-row items-center gap-1">
                              
                              <i className="fa-solid text-xs font-semibold fa-xmark mt-[1px]"></i>
                              <span className=" font-semibold text-xs lg:text-sm  text-center">Cancel </span>
                              
                              
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                              <AlertDialogHeader>
                              <AlertDialogTitle>Cancel Operation</AlertDialogTitle>
                              <AlertDialogDescription>
                              Are you sure you want to cancel marking attendance?
                              </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                              
                              <AlertDialogCancel>No</AlertDialogCancel>
                              <AlertDialogAction className="bg-[#2C384A]" onClick={handleCancelOperation} >
                              Yes
                              </AlertDialogAction>
                              </AlertDialogFooter>
                              
                              </AlertDialogContent>
                              </AlertDialog>
                              </div>

                              :
                              <>
                              {schedule?.canMark
                              ?
                              <button
                              onClick={(e) => handleMarkClick(e, schedule?.id)}
                                className="mt-3 shadow bg-transparent border-[1px] border-[#D9D9D9] hover:bg-[#D9D9D9] hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 w-fit mr-auto rounded-lg px-2 py-1 cursor-pointer flex justify-center flex-row items-center gap-1"
                              >
                                <i className="fa-solid fa-pen-to-square text-xs  text-[#2C384A]"></i>
                                <span className="font-semibold text-sm ">Mark Attendance</span>
                              </button>
                            :
                            <div className="flex flex-row items-center gap-1 mt-4 justify-center">
                           <Image src={unavailable} className="w-5 h-auto" alt="not-allowed" />


                              <span className='text-center text-sm'>Unavailable to mark attendance</span>
                              </div>
                            }

                              </>
                          }
                          </div>
                        </li>
                        ))}
                      </ul>
                    </div>
      
                    {/* for large screens */}
                    <div className="hidden lg:block w-fit mx-auto">
                        
                        <div className="flex flex-row justify-between gap-6">
                        <DatePicker
                selected={selectedDate}
                onChange={onSelectDate}
                filterDate={isDateWithSchedule}
                customInput={<CustomDateInput value={selectedDate} onClick={() => {}} />} // Pass value and onClick
                
                />
                            <button
                        className="shadow bg-transparent border-[1px] border-[#D9D9D9] hover:bg-[#D9D9D9] hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 w-fit ml-auto my-4 rounded-lg px-3 py-1 mr-2 cursor-pointer flex justify-center flex-row items-center gap-1"
                      >
                        <i className="fa-solid fa-print text-sm text-[#2C384A]"></i>
                        <span id="showAdd" className="font-semibold text-sm text-center">Print</span>
                      </button>
                        </div>
                  
                      
                      
                      <table className="table-auto rounded-lg w-fit mx-auto text-black text-left rtl:text-right hidden lg:block">
                        <thead className="bg-[#2C384A] shadow drop-shadow rounded-lg">
                          <tr className="shadow drop-shadow">
                          <th scope="col" className="px-4 py-2 text-center text-base text-white shadow drop-shadow">TEACHER</th>
                            <th scope="col" className="px-4 py-2 text-center text-base text-white shadow drop-shadow">ROOM NO. & (SUBJECT)</th>
                            <th scope="col" className="text-center px-4 py-2 text-base text-white shadow drop-shadow">ATTENDANCE STATUS</th>
                            <th scope="col" className="px-4 py-2 text-center text-white text-base shadow drop-shadow">MARK ATTENDANCE</th>
                          </tr>
                        </thead>
                        <tbody>
                        {sortLatestInOutTimes?.map((schedule:Schedule) => (
                          <tr key={schedule?.id}>
                            <th scope="row" className="px-4 py-2 font-normal text-base bg-gray-100 h-full shadow drop-shadow">
                              <div className="flex flex-row gap-3 flex-wrap">
                                <Image  src={schedule?.gender === 'Male' ? maleProf : (schedule?.gender === 'Female' ? femaleProf : profile)}
                                 className="self-center w-14 h-14" alt="" />
                                <div className="flex flex-col">
                                  <h3 className="font-bold text-lg">{schedule?.teacherName || 'N/A'}</h3>
                                  <h4 className="text-xs mt-2 text-[#333333]">Scheduled Time: <br /></h4>
                                  <div className="space-x-6">
                                    <span className="text-sm font-semibold">In: {formatTime(schedule?.scheduledInTime) || 'N/A'}</span>
                                    <span className="text-sm font-semibold">Out: {formatTime(schedule?.scheduledOutTime) || 'N/A'}</span>
                                  </div>
                                </div>
                              </div>
                            </th>
                            <td className="bg-gray-100 text-center h-full shadow drop-shadow px-4 py-2 text-base">
                              <b>{schedule?.roomNum || 'N/A'}</b>
                              <br /> ({schedule?.subject || 'N/A'})
                            </td>
                            <td className="bg-gray-100 h-full shadow drop-shadow px-4 py-2">
                              <div className="flex justify-center items-center">
                              {schedule?.attendanceStatus
                              ?
                              <Image 
                              id="attendanceStatus" 
                              src={
                                  schedule?.attendanceStatus === 'PENDING' ? pending :
                                  schedule?.attendanceStatus === 'LATE' ? late :
                                  schedule?.attendanceStatus === 'ABSENT' ? absent :
                                  schedule?.attendanceStatus === 'PRESENT' ? present :
                                  '' // Empty string for the else case
                              } 
                              className="w-8 h-auto" 
                              alt="" 
                              />
                              :
                              <span>N/A</span>
                              }
                            

                              </div>
                            </td>
                            <td className="bg-gray-100 h-full shadow drop-shadow px-4 py-2">
                              
                              
                            
                          
                            {editingRowId === schedule.id ? 
                              <div className="space-y-6">
                              <UpdateAttendanceStatus
                                  currentAttendanceStatus={schedule?.attendanceStatus}
                                  setRefetch={() => setRefetch(true)}
                                  isVisible={editingRowId === schedule.id}
                                  onClose={() => setEditingRowId(null)}
                                  scheduleId={schedule.id}
                                  teacherName={schedule?.teacherName}
                              />

                              <AlertDialog>
                              <AlertDialogTrigger className="bg-transparent border-[1px] border-[#ff0000] border-dashed hover:bg-[#ff0000] hover:text-white hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 shadow w-fit mx-auto rounded-lg px-2 py-1 cursor-pointer flex justify-center flex-row items-center gap-1">
                              
                              <i className="fa-solid text-xs lg:text-sm font-semibold fa-xmark "></i>
                              <span className=" font-semibold text-xs lg:text-sm  text-center">Cancel </span>
                              
                              
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                              <AlertDialogHeader>
                              <AlertDialogTitle>Cancel Operation</AlertDialogTitle>
                              <AlertDialogDescription>
                              Are you sure you want to cancel marking the attendance of teacher {schedule?.teacherName}?
                              </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                              
                              <AlertDialogCancel>No</AlertDialogCancel>
                              <AlertDialogAction className="bg-[#2C384A]" onClick={handleCancelOperation} >
                              Yes
                              </AlertDialogAction>
                              </AlertDialogFooter>
                              
                              </AlertDialogContent>
                              </AlertDialog>
                              </div>

                              :
                              <>
                              {schedule?.canMark
                              ?
                              
                              <button
                              onClick={(e) => handleMarkClick(e, schedule?.id)}
                                className="shadow bg-transparent border-[1px] border-[#D9D9D9] hover:bg-[#D9D9D9] hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 w-fit mx-auto rounded-lg px-2 py-1 cursor-pointer flex justify-center flex-row items-center gap-1"
                              >
                                <i className="fa-solid fa-pen-to-square text-sm text-center text-[#2C384A]"></i>
                                <span className="font-semibold text-sm text-center">Mark</span>
                              </button>
                              :
                              <div className="flex flex-row items-center gap-1 justify-center">
                           <Image src={unavailable} className="w-5 h-auto" alt="not-allowed" />


                              <span className='text-center text-sm'>Unavailable</span>
                              </div>
                            }
                              </>
                          }
                           
                            
                           
                             </td>
                          </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    </>
) : (
  <div className="max-w-[2050px] mx-auto">
    <div className='flex flex-col items-center justify-center min-h-screen'>
     
      <Image priority src={nothinghere} className='w-[20rem] lg:w-[28rem] h-auto' alt='nothing here' />
      {/* Button component for adding new student assistant */}
      <span className="text-lg lg:text-xl font-semibold">You currently don't have any schedule(s).</span>
    </div>
  </div>
)}
                  </>
                ) : (
                  <SidePageLoader />
                )}
              </div>
              <Footer />
            </div>
          ) : (
            <AccessDenied />
          )}
        </>
      );
    }      

export default Attendance