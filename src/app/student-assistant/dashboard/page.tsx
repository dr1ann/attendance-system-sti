'use client'
//External Libraries
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BeatLoader } from 'react-spinners'

//Components
import Footer from '@/app/components/Footer'
import PageLoader from '@/app/components/PageLoader'

//Images
import maleProf from '@/app/Images/male-prof.png'
import femaleProf from '@/app/Images/female-prof.png'
import dashboard from '@/app/Images/dashboard.png'
import attendance from '@/app/Images/attendance.png'
import notifications from '@/app/Images/notification.png'
import profile from '@/app/Images/profile.png'
import AccessDenied from '@/app/components/AccessDenied'
import { Schedule, User } from '@prisma/client'


const MAX_SCHEDULES = 6; // Maximum number of schedules to fetch

const Dashboard = () => {
    const [isStudentAssistant, setIsStudentAssistant] = useState(false);
const [isLoading, setIsLoading] = useState(true);
const [isFetchSuccessful, setIsFetchSuccessful] = useState(false);
const [userData, setUserData] = useState<User | null>(null);
const [upcomingSchedules, setUpcomingSchedules] = useState<Schedule[]>([]);

const router = useRouter();

useEffect(() => {
const fetchData = async () => {
  try {
    const response = await fetch('/api/validate-student', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies in the request
    });

    // Check if the response is successful (status 200)
    if (response?.status === 200) {
        setIsStudentAssistant(true)
    } else {
        setIsStudentAssistant(false)
      console.error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    setIsStudentAssistant(false)
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};

fetchData();
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
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data : Schedule[] = await response.json();
      
      // Filter and limit the number of schedules
      const upcoming = data.filter(schedule => new Date(schedule.scheduledDate) > new Date())
      .slice(0, MAX_SCHEDULES);
console.log(data)
      
      setUpcomingSchedules(upcoming);
      setIsFetchSuccessful(true);
    } catch (error) {
      console.error("Error fetching user schedules:", error);
      setIsFetchSuccessful(false);
    }
  };

  fetchUserSchedule();
}, []); // Dependency array to trigger fetch when userData changes

console.log(upcomingSchedules)



if (isLoading) {
return (
  <PageLoader/>
);
}
    return (
        <>
        {isStudentAssistant ?
        <div className="max-w-[2050px] mx-auto text-white animate-fadeUp">
        <div className="flex flex-col min-h-screen">
        <header >
            <div className="flex flex-row justify-start gap-1 items-center shadow drop-shadow bg-[#01579B]">
            {userData?.gender ? (
  userData.gender === 'Male' ? (
    <>
      <Image src={maleProf} className="w-24 p-4" alt="" />
    </>
  ) : (
    <>
        <Image src={femaleProf} className="w-24 p-4" alt="" />
    </>
  )
) : (
  <>
   <Image src={profile} className="w-24 p-4" alt="" />
</>
)}
               
               

                {userData ?
                <div className="flex flex-col items-start">
                    <Link className=" text-base lg:text-lg font-bold" href={'/student-assistant/profile'}>{userData?.name || 'N/A'}</Link>
                    <span className="text-xs  text-gray-100">STUD - A</span>
                </div>
                :
                <span className='text-base lg:text-lg'>No User Data Available</span>
                }
            </div>
          
        </header>
        <div className="m-2 md:mb-6 md:mx-6">
        <div className="bg-white p-2 rounded-lg   shadow drop-shadow  max-w-[1000px]  mt-[-16px]  mx-auto">
            <div className="flex flex-col  p-2 gap-4">
                <div className="flex flex-row justify-center  items-center">
                    <Image src={dashboard} className="w-14 lg:w-20 " alt="" />
                    <p className="text-xl lg:text-2xl text-black font-bold pr-5">Dashboard</p>
                </div>
              
                    <h2 className="text-xl lg:text-2xl p-2 font-bold text-black">Upcoming Schedules</h2>
                  
               
                
                
            </div>
        </div>
    
         
        <div className="text-black  flex flex-row overflow-x-auto   shadow drop-shadow smallscreens:w-fit  bg-gray-100 mx-auto  mt-6 rounded-lg">
               
            <Link href="/student-assistant/attendance" className="flex min-w-32 w-32 lg:w-40 justify-center flex-col m-4 lg:m-6 items-center cursor-pointer rounded-md shadow  bg-white  border-[1px] border-[#D9D9D9]  hover:bg-[#D9D9D9]  hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 pb-2">
                <Image src={attendance} className="w-20 lg:w-28 h-auto " alt="" />
                <p className="text-sm lg:text-base  font-bold text-center px-4">ATTENDANCE</p>
            </Link>
            <Link href="/student-assistant/notifications" className="flex min-w-32 w-32 lg:w-40 justify-center flex-col m-4 lg:m-6 items-center cursor-pointer rounded-md shadow  bg-white  border-[1px] border-[#D9D9D9]  hover:bg-[#D9D9D9]  hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 pb-2">
                <Image src={notifications} className="w-20 lg:w-28 h-auto" alt="" />
                <p className="text-sm lg:text-base  font-bold text-center px-4 text-wrap">NOTIFICATIONS</p>
            </Link>
           
            <Link href="/student-assistant/profile" className="flex min-w-32 w-32 lg:w-40 justify-center flex-col m-4 lg:m-6 items-center cursor-pointer rounded-md shadow  bg-white  border-[1px] border-[#D9D9D9]  hover:bg-[#D9D9D9]  hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 pb-2">
                <Image src={profile} className="w-20 lg:w-28 h-auto" alt="" />
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