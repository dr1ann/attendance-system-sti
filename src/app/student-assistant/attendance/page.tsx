'use client'
//External Libraries
import Image from "next/image"

//Components
import Footer from "@/app/components/MainFooter"
import Header from "@/app/components/Header"
import Sidebar from "@/app/components/Sidebar"

//Images
import attendance from '@/app/Images/attendance.png'
import maleProf from '@/app/Images/male-prof.png'
import femaleProf from '@/app/Images/female-prof.png'
import present from '@/app/Images/present.png'
import late from '@/app/Images/late.png'
import absent from '@/app/Images/absent.png'
import pending from '@/app/Images/pending.png'
import calendar from '@/app/Images/calendar.png'

const Attendance = () => {
    return (
        <div className="max-w-[2050px] mx-auto">
             <div className="max-w-[2050px] mx-auto">
            <Header headingImg={attendance} headingName="ATTENDANCE" /> 
    <Sidebar /> 
<div id="container" className="p-4 lg:ml-64 min-h-screen animate-fadeUp">
<div className="p-0 lg:p-4 overflow-y-auto  mt-[3em] lg:mt-[4em] rounded-lg ">
        <div style={{border: "1px solid #D9D9D9"}} className="flex flex-col gap-6 justify-center mx-auto items-center mb-10 lg:mb-6 w-fit p-4 rounded-lg shadow drop-shadow ">
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
                <Image src={pending} className="w-8 h-auto" alt="absent" />
            </li>
        </ul>
        </div>
       
        </div>
        <div className="lg:hidden">
                <div className="flex flex-row items-center rounded-lg gap-2 shadow drop-shadow p-2 bg-[#01579B] w-fit mb-4">
                    <Image src={calendar} className="w-6 object-contain h-auto" alt="" />
                    <span className="text-sm font-bold text-white">MAY 1, 2024</span>
                </div> 
                <ul className="grid grid-cols-1 relative gap-6">
                    <li style={{ border: "1px solid #D9D9D9" }} className="flex flex-wrap flex-col items-start gap-3 p-3 rounded-lg shadow drop-shadow">
                    <Image src={pending} className="w-8 h-auto mb-20 absolute right-0 top-0 me-4 py-2" alt="present" />
                    <Image src={femaleProf} className="flex w-16 px-2 h-auto" alt="" />
                        <div className="flex flex-col">
                            <h3 className="font-bold text-lg">Windy Cagulada</h3>
                            <h4 className="text-xs mt-2 text-[#333333]">Scheduled Time: <br /></h4> 
                            <div className="space-x-6">
                                <span className="text-xs font-semibold">In: 7:30 AM</span>
                                <span className="text-xs font-semibold">Out: 9:00 AM</span>
                            </div>
                            <span className="text-sm mt-4 font-semibold">ROOM 315 (National Service Training Program)</span>
                            <button id="editBtn" className="shadow bg-transparent border-[1px] border-[#D9D9D9] hover:bg-[#D9D9D9] hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 flex flex-row gap-1 items-center justify-start mt-4 w-fit px-2 py-1 rounded-lg ">
                                <i className="fa-solid fa-pen-to-square text-xs text-[#2C384A]"></i>
                                <span className="text-sm font-semibold">Mark Attendance</span>
                            </button>
                            <div id="editContainer" className="hidden items-start flex-col gap-2 mt-4">
                                <h3 className="attendance-indicator hide-indicator text-sm text-center font-semibold">Choose Attendance Color:</h3>
                                <div className="flex flex-row gap-4 justify-center items-center">
                                    <Image id="present" src={present} className="attendance-indicator hide-indicator cursor-pointer w-8 h-auto" alt="present" />
                                    <Image id="late" src={late} className="attendance-indicator hide-indicator cursor-pointer w-8 h-auto" alt="late" />
                                    <Image id="absent" src={absent} className="attendance-indicator hide-indicator cursor-pointer w-8 h-auto" alt="absent" />
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
{/* for large screens */}
<div className=" hidden lg:block w-fit mx-auto">
    <button className="shadow  bg-transparent  border-[1px] border-[#D9D9D9]  hover:bg-[#D9D9D9]  hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 w-fit ml-auto  my-4  rounded-lg px-3 py-1 mr-2 cursor-pointer flex  justify-center flex-row items-center gap-1" > 
        <i className="fa-solid fa-print text-base text-[#2C384A]"></i>
        <span id="showAdd" className="font-semibold text-base text-center">Print</span>
</button>
    <table className="table-auto rounded-lg w-fit mx-auto text-black text-left rtl:text-right hidden lg:block">
        <thead className="bg-[#2C384A] shadow drop-shadow rounded-lg">
            <tr className=" shadow drop-shadow ">
                <th scope="col" className="shadow drop-shadow" >
                    <div className="flex flex-row items-center ">
                    <Image src={calendar} className="w-12 pl-4 object-contain h-auto" alt="" />
                    <span className=" text-base  px-4 py-3 text-white ">MAY 1, 2024</span>
                </div>
                </th>
                <th scope="col" className="px-4 py-2 text-center text-base text-white shadow drop-shadow">ROOM NO. & SUBJECT</th>
                <th scope="col" className="text-center px-4 py-2 text-base text-white shadow drop-shadow">ATTENDANCE STATUS</th>
                <th scope="col" className="px-4 py-2 text-center text-white text-base shadow drop-shadow">
                    MARK ATTENDANCE
                </th>
                
           
            </tr>
        </thead>
        <tbody>
    <tr>
        <th scope="row" className="px-4 py-2 font-normal text-base bg-gray-100 h-full shadow drop-shadow">
            <div className="flex flex-row gap-3 flex-wrap">
                <Image src={femaleProf} className="self-center w-14 h-14" alt="" />
                <div className="flex flex-col">
                    <h3 className="font-bold text-lg">Windy Cagulada</h3>
                    <h4 className="text-xs mt-2 text-[#333333]">Scheduled Time: <br /></h4>
                    <div className="space-x-6">
                        <span className="text-sm font-semibold">In: 7:30 AM</span>
                        <span className="text-sm font-semibold">Out: 9:30 AM</span>
                    </div>
                </div>
            </div>
        </th>
        <td className="bg-gray-100 text-center h-full shadow drop-shadow px-4 py-2 text-base">
            <b>ROOM 315</b><br /> (National Service Training Program)
        </td>
        <td className="bg-gray-100 h-full shadow drop-shadow px-4 py-2">
            <div className="flex justify-center items-center">
                <Image id="attendanceStatus" src={present} className="w-8 h-auto" alt='' />
            </div>
        </td>
        <td className="bg-gray-100 h-full shadow drop-shadow px-4 py-2">
            <button className="shadow bg-transparent border-[1px] border-[#D9D9D9] hover:bg-[#D9D9D9] hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 w-fit mx-auto rounded-lg px-2 py-1 cursor-pointer flex justify-center flex-row items-center gap-1">
                <i className="fa-solid fa-pen-to-square text-center text-[#2C384A]"></i>
                <span className="font-semibold text-center">Mark</span>
            </button>
            <div id="editContainer" className="hidden flex-wrap items-center flex-row justify-center gap-4">
                <h3 className="attendance-indicator hide-indicator text-sm text-center font-semibold">Choose Attendance Color:</h3>
                <Image id="present" src={present} className="attendance-indicator hide-indicator cursor-pointer w-8 h-auto" alt="present" />
                <Image id="late" src={late} className="attendance-indicator hide-indicator cursor-pointer w-8 h-auto" alt="late" />
                <Image id="absent" src={absent} className="attendance-indicator hide-indicator cursor-pointer w-8 h-auto" alt="absent" />
            </div>
        </td>
    </tr>
</tbody>

    </table>
</div>
  
</div>
 </div>
 <Footer />
 </div>
    )
}

export default Attendance