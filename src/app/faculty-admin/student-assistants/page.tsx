'use client'
//External Libraries
import Image from "next/image"
import { useState, useEffect, useCallback, useMemo } from "react"

//Components
import Footer from "@/app/components/MainFooter"
import Header from "@/app/components/Header"
import Sidebar from "@/app/components/Sidebar"
import PageLoader from "@/app/components/PageLoader"
import SomethingWentWrong from "@/app/components/SomethingWentWrong"
import SidePageLoader from "@/app/components/SidePageLoader"
import AddNewStudent from "./AddNewStudent"
import AccessDenied from "@/app/components/AccessDenied"
import { User } from "@prisma/client"
import MoreInfo from "./MoreInfo"
import PaginationControls from "./PaginationControls"
import RemoveStudent from "./RemoveStudent"
import ScheduleInfo from "./ScheduleInfo"
import ScheduleList from "./ExportAllSchedules"
import StudentsList from "./ExportAllStudentInfo"

//Images
import studentassistants from '@/app/Images/studentassistant.png'
import maleProf from '@/app/Images/male-prof.png'
import femaleProf from '@/app/Images/female-prof.png'
import profile from '@/app/Images/profile.png'
import nothinghere from '@/app/Images/noneplaceholder.png'
import AddNewSchedule from "./AddNewSchedule"
import ActivityLog from "./ActivityLog"
import ActivityLogList from "./ExportAllActivity"








export default function StudentAssistants({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
    const [isAddNewScheduleOpen, setIsAddNewScheduleOpen] = useState(false);
    const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);
    const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);
    const [isMoreInfoModalOpen, setIsMoreInfoModalOpen] = useState(false);

    const [isScheduleInfoOpen, setIsScheduleInfoOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isFetchSuccessful, setIsFetchSuccessful] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentStudentId, setCurrentStudentId] = useState('');
    const [currentStudentName, setCurrentStudentName] = useState('');
    const [refetch, setRefetch] = useState<boolean>(false);
    const [sortOption, setSortOption] = useState<'name' | 'newest' | 'oldest'>('name');
    const [sortedStudents, setSortedStudents] = useState<User[]>([]);
    const [studentData, setStudentData] = useState<User[]>([]);

    

    const validateFaculty = useCallback(async () => {
      try {
        const response = await fetch('/api/validate-faculty', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies in the request
        });
  
        // Check if the response is successful (status 200)
        if (response?.status === 200) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          console.error(`HTTP error! Status: ${response.status}`);
        }
      } catch (error) {
        setIsAdmin(false);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }, []);
  
    useEffect(() => {
      validateFaculty();
  
      const intervalId = setInterval(() => {
        validateFaculty();
      }, 3600000); // Revalidate every hour (3600000 ms)
  
      return () => clearInterval(intervalId); // Clean up the interval on unmount
    }, [validateFaculty]);
  
    


      useEffect(() => {
        
        const fetchStudentsData = async () => {
          try {
            const response = await fetch('/api/students', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include', // Include cookies in the request
            });
    
            // Check if the response is successful (status 200)
            if (response?.status === 200) {
                const data : User[] = await response.json();
                setIsFetchSuccessful(true)
                setStudentData(data)
               
            } else {
                setIsFetchSuccessful(false)
              console.error(`HTTP error! Status: ${response.status}`);
            }
          } catch (error) {
            setIsFetchSuccessful(false)
            console.error(error);
          } 
        };
    
       
        fetchStudentsData();
      
      }, []);


      useEffect(() => {
        if(refetch) {
        const fetchStudentsData = async () => {
          try {
            const response = await fetch('/api/students', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include', // Include cookies in the request
            });
    
            // Check if the response is successful (status 200)
            if (response?.status === 200) {
                const data : User[] = await response.json();
                setIsFetchSuccessful(true)
                setStudentData(data)
                setRefetch(false)
            } else {
                setIsFetchSuccessful(false)
              console.error(`HTTP error! Status: ${response.status}`);
            }
          } catch (error) {
            setIsFetchSuccessful(false)
            console.error(error);
          } 
        };
    
       
        fetchStudentsData();
       
      }
      }, [refetch]);


      
      const sortNewestToOldest = useMemo(() => {
        return [...studentData].sort((a, b) => {
          const createdAtA = a?.createdAt ? new Date(a?.createdAt).getTime() : 0;
          const createdAtB = b?.createdAt ? new Date(b?.createdAt).getTime() : 0;
          return createdAtB - createdAtA;
        });
      }, [studentData]);
    
      const sortOldestToNewest = useMemo(() => {
        return [...studentData].sort((a, b) => {
          const createdAtA = a?.createdAt ? new Date(a?.createdAt).getTime() : 0;
          const createdAtB = b?.createdAt ? new Date(b?.createdAt).getTime() : 0;
          return createdAtA - createdAtB;
        });
      }, [studentData]);
    
      const sortByName = useMemo(() => {
        return [...studentData].sort((a, b) => {
          const nameA = a?.name ? a?.name : '';
          const nameB = b?.name ? b?.name : '';
          return nameA.localeCompare(nameB);
        });
      }, [studentData]);
      useEffect(() => {
        switch (sortOption) {
          case 'newest':
            setSortedStudents(sortNewestToOldest);
            break;
          case 'oldest':
            setSortedStudents(sortOldestToNewest);
            break;
          case 'name':
          default:
            setSortedStudents(sortByName);
            break;
        }
      }, [sortOption, sortNewestToOldest, sortOldestToNewest, sortByName]);

      
      const page = searchParams['page'] ?? '1'
      const per_page = searchParams['per_page'] ?? '5'
    
      // mocked, skipped and limited in the real app
      const start = (Number(page) - 1) * Number(per_page) // 0, 5, 10 ...
      const end = start + Number(per_page) // 5, 10, 15 ...
    
      const paginatedEntries  = sortedStudents.slice(start, end)
    
      


      if (isLoading) {
        return (
         <PageLoader/>
        );
      }
      function formatDate(timestamp: Date): string {
        const date = new Date(timestamp);
        const options: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
      }


    

  const handleMoreInfoClick = (e:React.MouseEvent<HTMLButtonElement>, studentId: string) => {
    e.preventDefault();
    setCurrentStudentId(studentId);
    setIsMoreInfoModalOpen(true);
  };

  const handleActivityLogClick = (e:React.MouseEvent<HTMLButtonElement>, studentId: string, studentName: string) => {
    e.preventDefault();
    setCurrentStudentId(studentId);

    setCurrentStudentName(studentName);
    
    setIsActivityLogOpen(true);

  };

  const handleAddNewScheduleClick = (e:React.MouseEvent<HTMLButtonElement>, studentId: string, studentName: string) => {
    e.preventDefault();
    setCurrentStudentId(studentId);

    setCurrentStudentName(studentName);

    setIsAddNewScheduleOpen(true);
  };

  const handleScheduleInfoClick = (e:React.MouseEvent<HTMLButtonElement>, studentId: string, studentName: string) => {
    e.preventDefault();
    setCurrentStudentId(studentId);
    
    setCurrentStudentName(studentName);

    setIsScheduleInfoOpen(true);
  };
  return (
    <>
      {isAdmin ? (
        <div className="max-w-[2050px] mx-auto">
          <Header headingImg={studentassistants} headingName="STUDENT ASSISTANTS" />
          <Sidebar />
          <div id="container" className="p-4 lg:ml-64 min-h-screen">
            {isFetchSuccessful ? (
              <>
                {studentData?.length > 0 ? (
                  <div className="p-0 lg:p-4 overflow-y-auto mt-[3em] lg:mt-[4em] rounded-lg">
                         <div className="lg:hidden animate-fadeUp">
             
                         <div className="flex flex-row justify-between items-center">
                         <form className="flex flex-row items-center w-fit space-x-2">
          <label htmlFor="sort" className="text-sm font-medium whitespace-nowrap">Sort by:</label>
          <select
            id="sort"
            className="bg-gray-100 border border-[#D9D9D9] text-sm rounded-lg focus:ring-[#01579B] focus:border-[#01579B] block w-full p-1"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as 'name' | 'newest' | 'oldest')}
          >
            <option value="name">Name</option>
            <option value="dJoined">Date joined:</option>
            <option value="newest">Newest - Oldest</option>
            <option value="oldest">Oldest - Newest</option>
          </select>
        </form>

                         </div>

           
                  <button onClick={(e:React.MouseEvent<HTMLButtonElement>) => { e.preventDefault(); setIsAddNewModalOpen(true) } }  className="shadow  bg-transparent  border-[1px] border-[#D9D9D9]  hover:bg-[#D9D9D9]  hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 w-fit ml-auto  my-6  rounded-lg px-3 py-1 mr-2 cursor-pointer flex  justify-center flex-row items-center gap-1" > 
                      <i className="fa-solid fa-user-plus text-xs lg:text-sm text-center text-[#2C384A]"></i>
                      <span  className="font-semibold text-sm text-center">Add New Student Assistant</span>
             </button>
            
             <>
          
            
             <>
              <ul className="grid grid-cols-1 relative gap-6">
                   {paginatedEntries?.map((student:User, index:number) => (
                
      
                  <li key={index} style={{border: "1px solid #D9D9D9"}} className="flex flex-wrap flex-col  gap-3 p-3 rounded-lg shadow drop-shadow">
              
                    <div className="flex flex-row justify-between items-center gap-8">
                     
                      <Image src={student?.gender === 'Male' ? maleProf : student?.gender === 'Female' ? femaleProf : profile} className="flex w-16 px-2 h-auto"  alt="" />
      
                      <RemoveStudent   setRefetch={() =>  setRefetch(true)} id={student?.id}/>
                    
                      </div>
                    <div className="flex flex-row space-x-2">
                      
                      <div className="flex flex-col ">
                          <h3 className="font-bold text-lg">{student?.name || 'N/A'}</h3>
                          <div className="flex flex-row items-center mt-2 space-x-1">
                          <h4 className="text-xs  text-[#333333]">Student ID: </h4> 
                          <span className="text-sm  font-semibold"> {student?.studentId || 'NA'}</span>
                          </div>
                          <div className="flex flex-row items-center space-x-3">
                            <div className="flex flex-row items-center space-x-1">
                          <h4 className="text-xs  text-[#333333]">Joined on: </h4> 
                          <span className="text-sm  font-semibold"> {formatDate(student?.createdAt) || 'N/A'}</span>
                          </div>
                          <button   onClick={(e) => handleMoreInfoClick(e, student?.id)} className=" bg-transparent  border-[1px] border-[#D9D9D9]  hover:bg-[#D9D9D9]  hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 shadow  w-fit ml-3   rounded-lg px-2 py-1 cursor-pointer flex  justify-center flex-row items-center gap-1" > 
                          <i className="fa-solid fa-circle-info text-xs text-center text-[#2C384A]"></i>
                          <span className="font-semibold text-sm text-center ">More Info</span>
                        
                   
                    
                 </button>
                          </div>
                          
                          
                 </div>
                 
                      </div>
                      <div className="flex gap-2 flex-row flex-wrap mt-5 items-center">
                        
                      <button  onClick={(e) => handleAddNewScheduleClick(e, student?.id, student?.name)} className=" bg-transparent  border-[1px] border-[#D9D9D9]  hover:bg-[#D9D9D9]  hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 shadow  w-fit   rounded-lg px-2 py-1 cursor-pointer flex  justify-center flex-row items-center gap-1" > 
                          <i className="fa-solid fa-calendar-plus text-center text-xs text-[#2C384A]"></i>
                          
                      
                 </button>
                      <button onClick={(e) => handleScheduleInfoClick(e, student?.id, student?.name)} className=" bg-transparent  border-[1px] border-[#D9D9D9] mr-4  hover:bg-[#D9D9D9]  hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 shadow  w-fit   rounded-lg px-2 py-1 cursor-pointer flex  justify-center flex-row items-center gap-1" > 
                          <i className="fa-solid fa-calendar-days text-center text-xs text-[#2C384A]"></i>
                          <span className="font-semibold text-sm text-center ">View Schedules</span>
                      
                 </button>
                 <button onClick={(e) => handleActivityLogClick(e, student?.id, student?.name)}  className=" bg-transparent  border-[1px] border-[#D9D9D9] ml-auto  hover:bg-[#D9D9D9]  hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 shadow  w-fit   rounded-lg px-2 py-1 cursor-pointer flex  justify-center flex-row items-center gap-1" > 
                  <i className="fa-solid fa-chart-line text-xs text-center text-[#2C384A]"></i>
                  <span className="font-semibold text-sm text-center">Activity Log</span>
              
         </button>
              </div>
                    
                    
                  </li>
        ))}
              </ul>
              {studentData?.length > 5
              &&
              <PaginationControls
            hasNextPage={end < studentData.length}
            hasPrevPage={start > 0}
          />
              }
          </>
    
    </>
     
    
     
          </div>
          <div className=" hidden lg:block w-fit mx-auto animate-fadeUp">
          <div style={{border: "1px solid #D9D9D9"}} className="flex flex-col gap-6 justify-center mx-auto items-center mb-10 lg:mb-6 w-fit p-4 rounded-lg shadow drop-shadow ">
              <div className="flex  items-center justify-center gap-1">
              <i className="fa-solid fa-print text-base text-[#2C384A]"></i>
              <h1 className="font-bold text-base text-center">EXPORT ALL</h1>
          </div>
             
              <ul className="grid grid-cols-3 gap-6 justify-center items-center">
             
              <StudentsList  />
              <ScheduleList  />
              <ActivityLogList />
        
              
          </ul>
          
          </div>
           <div className="flex flex-row justify-between gap-4 items-center">
         
           <form className="flex flex-row items-center space-x-2">
        <label htmlFor="sort" className="text-sm font-medium whitespace-nowrap">Sort by:</label>
        <select
          id="sort"
          className="bg-gray-100 border border-[#D9D9D9] text-sm rounded-lg focus:ring-[#01579B] focus:border-[#01579B] block w-full p-1.5"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as 'name' | 'newest' | 'oldest')}
        >
       <option value="name">Name</option>
        <option value="dJoined" disabled>Date joined:</option>
        <option value="newest">Newest - Oldest</option>
        <option value="oldest">Oldest - Newest</option>
        </select>
      </form>


<button onClick={(e:React.MouseEvent<HTMLButtonElement>) => { e.preventDefault(); setIsAddNewModalOpen(true) } } 
          className="shadow  bg-transparent  border-[1px] border-[#D9D9D9]  hover:bg-[#D9D9D9]  hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 w-fit   my-4   rounded-lg px-3 py-1 mr-2 cursor-pointer flex  justify-center flex-row items-center gap-1" > 
              <i className="fa-solid fa-user-plus text-xs text-center text-[#2C384A]"></i>
              <span className="font-semibold text-sm text-center">Add New Student Assistant</span>
     </button>


     </div>
     <>
    
      <table className="table-auto rounded-lg w-fit mx-auto text-black text-left rtl:text-right">
          <thead className="bg-[#2C384A] shadow drop-shadow rounded-lg">
              <tr className=" shadow drop-shadow ">
                  <th scope="col" className="px-4 py-2 text-center text-base text-white shadow drop-shadow">NAME & ID</th>
                  <th scope="col" className="px-4 py-2 text-center text-base text-white shadow drop-shadow">INFO</th>
                  
                
                 
                  <th scope="col" className="text-center px-4 py-2 text-base text-white shadow drop-shadow">SCHEDULES</th>
                  <th scope="col" className="px-4 py-2 text-center text-white text-base shadow drop-shadow">ACTIVITY</th>
                  <th scope="col" className="px-4 py-2 text-center text-white text-base shadow drop-shadow">ACTION</th>
             
              </tr>
          </thead>
          <tbody >
          {paginatedEntries?.map((student:User, index:number) => (
              <tr key={index}>
                 
                  <th scope="row" className=" px-4 py-2 font-normal text-base bg-gray-100 h-full  shadow drop-shadow  ">
                   <div className="flex flex-row  gap-3 items-center">
                      <Image src={student?.gender === 'Male' ? maleProf : student?.gender === 'Female' ? femaleProf : profile} className="self-center w-14 h-14" alt="" />
                      <div className="flex flex-col">
                          <h3 className="font-bold text-lg">
                              {student?.name || 'N/A'}
                          </h3>
                   <div className="flex flex-col">
                         <span className="text-[.70rem] leading-3  text-[#333333] ">Student ID: <br/></span> 
                          <h4 className="font-semibold text-[.85rem] leading-4 ">{student?.studentId || 'N/A'}</h4>
                          </div>
                          </div>
               
                          
                          
                     
                   </div>
                  </th>
                 
                  <th scope="row" className=" px-4 py-2 font-normal text-base bg-gray-100 h-full  shadow drop-shadow  ">
                      
                         <div className="flex flex-row space-x-4 items-center justify-between">

                       
                          <div className="flex flex-col ">
                              <span className="text-xs  text-[#333333] ">Joined on: <br/></span> 
                              <h4 className="font-semibold text-sm ">{formatDate(student?.createdAt) || 'N/A'}</h4>
                              </div>
                      </div>
                      <button onClick={(e) => handleMoreInfoClick(e, student?.id)} 
                       className="shadow  bg-transparent  border-[1px] border-[#D9D9D9]  hover:bg-[#D9D9D9]  hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 w-fit mx-auto mt-2  rounded-lg px-2 py-1 cursor-pointer flex  justify-center flex-row items-center gap-1" > 
                                  <i className="fa-solid fa-circle-info text-xs text-center text-[#2C384A]"></i>
                                  <span className="font-semibold text-sm text-center">More Info</span>
                                
                           
                            
                         </button>
                     </th>
  
              <td className="bg-gray-100 text-center  h-full shadow drop-shadow px-4 py-2 text-base">
              <div className="flex flex-row items-center justify-center gap-3">
            
               
                  <button  onClick={(e) => handleScheduleInfoClick(e, student?.id, student?.name)} className="shadow  bg-transparent  border-[1px] border-[#D9D9D9]  hover:bg-[#D9D9D9]  hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 w-fit mx-auto  rounded-lg px-2 py-1 cursor-pointer flex  justify-center flex-row items-center gap-1" > 
                      <i className="fa-solid fa-calendar-days text-center text-xs text-[#2C384A]"></i>
                      <span className="font-semibold text-sm text-center">View Schedules</span>
             </button>

             <button  onClick={(e) => handleAddNewScheduleClick(e, student?.id, student?.name)} className="shadow  bg-transparent  border-[1px] border-[#D9D9D9]  hover:bg-[#D9D9D9]  hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 w-fit mx-auto   rounded-lg px-2 py-1 cursor-pointer flex  justify-center flex-row items-center gap-1" > 
                      <i className="fa-solid  fa-calendar-plus text-center text-xs text-[#2C384A]"></i>
                     
             </button>
             </div>
           
             
              </td>
              <td className="bg-gray-100  h-full shadow drop-shadow px-4 py-2">
                  <button  onClick={(e) => handleActivityLogClick(e, student?.id, student?.name)}  className="shadow  bg-transparent  border-[1px] border-[#D9D9D9]  hover:bg-[#D9D9D9]  hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 w-fit mx-auto  rounded-lg px-2 py-1 cursor-pointer flex  justify-center flex-row items-center gap-1" > 
                      <i className="fa-solid fa-chart-line text-xs text-center text-[#2C384A]"></i>
                      <span className="font-semibold text-sm text-center">View Activity Log</span>
                    
               
                
             </button>
  
                
              </td>
  
              <td className="bg-gray-100  h-full shadow drop-shadow px-4 py-2">
                 <RemoveStudent  setRefetch={() =>  setRefetch(true)} id={student?.id}/>
  
                
              </td>
               </tr>
     ))}
               
               
  
          </tbody>
      </table>
      {studentData?.length > 5
          &&
          <PaginationControls
        hasNextPage={end < studentData.length}
        hasPrevPage={start > 0}
      />
          }
      </>
      

         

        
  </div>
                  </div>
                ) : (
                  <div className="max-w-[2050px] mx-auto">
                    <div className='flex flex-col items-center justify-center min-h-screen'>
                      {/* Image component with priority prop */}
                      <Image priority src={nothinghere} className='w-[20rem] lg:w-[28rem] h-auto' alt='access denied' />
                      <span className="mb-4 text-sm lg:text-base font-semibold">No student assistants registered at the moment.</span>
                      <button onClick={(e:React.MouseEvent<HTMLButtonElement>) => { e.preventDefault(); setIsAddNewModalOpen(true) } } className="shadow bg-transparent border-[1px] border-[#D9D9D9] hover:bg-[#D9D9D9] hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 w-fit my-4 rounded-lg px-3 py-1 mr-2 cursor-pointer flex justify-center flex-row items-center gap-1">
                        <i className="fa-solid fa-user-plus text-sm lg:text-base text-center text-[#2C384A]"></i>
                        <span className="font-semibold text-sm lg:text-base  text-center">Add New Student Assistant</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <SidePageLoader />
            )}
          </div>
          <AddNewStudent setRefetch={() => setRefetch(true)} isVisible={isAddNewModalOpen} onClose={() => setIsAddNewModalOpen(false)} />
          <MoreInfo setRefetch={() => setRefetch(true)} currentId={currentStudentId} isVisible={isMoreInfoModalOpen} onClose={() => setIsMoreInfoModalOpen(false)} />
          <ScheduleInfo setRefetch={() => setRefetch(true)} studentId={currentStudentId} studentName={currentStudentName} isVisible={isScheduleInfoOpen} onClose={() => setIsScheduleInfoOpen(false)} />
          <AddNewSchedule studentId={currentStudentId} studentName={currentStudentName}  setRefetch={() => setRefetch(true)} isVisible={isAddNewScheduleOpen} onClose={() => setIsAddNewScheduleOpen(false)} />
          <ActivityLog  studentId={currentStudentId} studentName={currentStudentName} isVisible={isActivityLogOpen} onClose={() => setIsActivityLogOpen(false)} />
          <Footer />
        </div>
      ) : (
        <AccessDenied />
      )}
    </>
  );
  
      }
      
      
    
    