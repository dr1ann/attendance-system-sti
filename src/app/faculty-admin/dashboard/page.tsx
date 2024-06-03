'use client'
//External Libraries
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react';

//Components
import Footer from '@/app/components/Footer'
import AccessDenied from '@/app/components/AccessDenied';
import PageLoader from '@/app/components/PageLoader';

//Images
import maleProf from '@/app/Images/male-prof.png'
import femaleProf from '@/app/Images/female-prof.png'
import dashboard from '@/app/Images/dashboard.png'
import studentassistants from '@/app/Images/studentassistant.png'
import notifications from '@/app/Images/notification.png'
import profile from '@/app/Images/profile.png'




const Dashboard = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const validateFaculty = async () => {
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
          setIsAdmin(true)
        } else {
         setIsAdmin(false)
          console.error(`HTTP error! Status: ${response.status}`);
        }
      } catch (error) {
        setIsAdmin(false)
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    validateFaculty();
  }, []);
  if (isLoading) {
    return (
     <PageLoader/>
    );
  }
    return (
        <>
        {isAdmin ?
            <div className="max-w-[2050px] mx-auto text-white animate-fadeUp">
            <div className=" flex flex-col  min-h-screen">
            <header >
                <div className="flex flex-row justify-start gap-1 items-center shadow drop-shadow bg-[#01579B]">
                    <Image src={femaleProf} className="w-24 p-4" alt="" />
                    <div className="flex flex-col items-start">
                        <h1 className="text-base lg:text-lg font-bold">Sheena Joy Muyuela</h1>
                        <span className="text-xs  text-gray-100">FAC - A</span>
                    </div>
                </div>
              
            </header>
            <div className="m-2 md:mb-6 md:mx-6">
            <div className="bg-white p-2 rounded-lg   shadow drop-shadow  max-w-[1000px]  mt-[-16px]  mx-auto">
                <div className="flex flex-col  p-2 gap-4">
                    <div className="flex flex-row justify-center  items-center">
                        <Image src={dashboard} className="w-14 lg:w-20 " alt="" />
                        <p className="text-xl lg:text-2xl text-black font-bold pr-2">Dashboard</p>
                    </div>
                    <div className="flex  justify-between">
                        <h2 className="text-xl lg:text-2xl p-2 font-bold text-black">As of today</h2>
                        <Link href="student-assistants.html" className="text-xs lg:text-sm font-bold text-[#01579B]">View more <i className="fa-solid fa-arrow-right text-xs"></i></Link>
                    </div>
                    <table className="w-full text-left rtl:text-right">
                        <thead>
                            <tr className="bg-[#2C384A]">
                               
                                <th scope="col" id="activityHeader" className=" text-base lg:text-lg px-6 py-3">Activity</th>
                                <th scope="col" id="dateTimeHeader" className=" text-base lg:text-lg px-6 py-3">Date & Time</th>
                            </tr>
                        </thead>
                        <tbody  >
                                <tr>
                               <th scope="row" className="px-6 py-3 text-sm font-normal lg:text-base bg-[#01579B] h-full  shadow drop-shadow  ">
                                James <b>LOGGED IN</b>
                               </th>
                               <td  className="px-6 py-3 text-sm lg:text-base bg-[#01579B]  h-full shadow drop-shadow  ">
                                04/27/2024 03:30 PM
                               </td>
                            </tr>
        
        
                            <tr>
                                <th scope="row" className="px-6 py-3 text-sm font-normal lg:text-base bg-[#ff0000] h-full  shadow drop-shadow  ">
                                    James marked Windy Cagulada as <b>ABSENT</b>
                                   </th>
                                   <td  className="px-6 py-3 text-sm lg:text-base bg-[#ff0000]  h-full shadow drop-shadow  ">
                                    04/27/2024 03:30 PM
                                   </td>
                            </tr>
        
                            <tr>
                                <th scope="row" className="px-6 py-3 text-sm font-normal lg:text-base bg-[#01579B] h-full  shadow drop-shadow  ">
                                    Bins <b>LOGGED IN</b>
                                   </th>
                                   <td  className="px-6 py-3 text-sm lg:text-base bg-[#01579B]  h-full shadow drop-shadow  ">
                                    04/27/2024 03:30 PM
                                   </td>
                            </tr>
        
                            <tr>
                                <th scope="row" className="px-6 py-3 text-sm font-normal lg:text-base bg-[#fd7e14] h-full  shadow drop-shadow  ">
                                    Bins marked Joshua Baban as <b>30 MINS LATE</b>
                                   </th>
                                   <td  className="px-6 py-3 text-sm lg:text-base bg-[#fd7e14]  h-full shadow drop-shadow  ">
                                    04/27/2024 03:30 PM
                                   </td>
                            </tr>
        
                            <tr>
                                <th scope="row" className="px-6 py-3 text-sm font-normal lg:text-base bg-[#28a745] h-full  shadow drop-shadow  ">
                                    Bins marked Humabona Gonzales as <b>PRESENT</b>
                                   </th>
                                   <td  className="px-6 py-3 text-sm lg:text-base bg-[#28a745]  h-full shadow drop-shadow  ">
                                    04/27/2024 03:30 PM
                                   </td>
                            </tr>
                        </tbody>
                    </table>
                    
                    
                </div>
            </div>
        
             
            <div className="text-black  flex flex-row overflow-x-auto   shadow drop-shadow smallscreens:w-fit bg-gray-100  mx-auto  mt-6 rounded-lg">
                   
                <Link href="/faculty-admin/student-assistants" className="flex min-w-32 w-32 lg:w-40 justify-center flex-col m-4 lg:m-6 items-center cursor-pointer rounded-md shadow  bg-white  border-[1px] border-[#D9D9D9]  hover:bg-[#D9D9D9]  hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 pb-2">
                    <Image src={studentassistants} className="w-20 lg:w-28 h-auto " alt="" />
                    <p className="text-sm lg:text-base  font-bold text-center px-4">STUDENT ASSISTANTS</p>
                </Link>
                 <Link href="/faculty-admin/notifications" className="flex min-w-32 w-32 lg:w-40 justify-center flex-col m-4 lg:m-6 items-center cursor-pointer rounded-md shadow  bg-white  border-[1px] border-[#D9D9D9]  hover:bg-[#D9D9D9]  hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 pb-2">
                    <Image  src={notifications} className="w-20 lg:w-28 h-auto" alt="" />
                    <p className="text-sm lg:text-base  font-bold text-center px-4 text-wrap">NOTIFICATIONS</p>
                </Link>
               
                <Link href="/faculty-admin/profile" className="flex min-w-32 w-32 lg:w-40 justify-center flex-col m-4 lg:m-6 items-center cursor-pointer rounded-md shadow  bg-white  border-[1px] border-[#D9D9D9]  hover:bg-[#D9D9D9]  hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 pb-2">
                    <Image  src={profile} className="w-20 lg:w-28 h-auto" alt="" />
                    <p className="text-sm lg:text-base  font-bold text-center px-4">PROFILE</p>
                </Link>
            </div>
        </div>
        </div>
          <Footer />
        </div>
        :
        <AccessDenied />
        }
        </>

    )
}

export default Dashboard