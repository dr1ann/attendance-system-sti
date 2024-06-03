'use client'
//External Libraries
import Image from "next/image"

//Components
import Footer from "@/app/components/MainFooter"
import Header from "@/app/components/Header"
import Sidebar from "@/app/components/Sidebar"

//Images
import notification from '@/app/Images/notification.png'
import maleProf from '@/app/Images/male-prof.png'
import femaleProf from '@/app/Images/female-prof.png'

const Notifications = () => {
    return (
        <div className="max-w-[2050px] mx-auto">
            <Header headingImg={notification} headingName="NOTIFICATIONS" /> 
    <Sidebar />
<div id="container" className="p-4 lg:ml-64 min-h-screen">
    <div className="p-0 lg:p-4 overflow-y-auto mt-[3em] lg:mt-[4em] rounded-lg ">
<div className="lg:hidden animate-fadeUp">
        <ul className="grid grid-cols-1 relative gap-6">
            
          

            <li style={{border: "1px solid #D9D9D9"}} className="bg-[#D9D9D9] flex flex-wrap flex-col items-start gap-3 p-3 rounded-lg shadow drop-shadow">
                
                <i  className="fa-solid fa-xmark text-2xl mb-20 absolute right-0 top-0 me-4 py-2 text-[#ff0000]"></i>
             
              
                <div className="flex flex-col gap-1">
                        <span className="text-xs text-[#333333]">From:</span>
                        <Image src={femaleProf} className="flex w-16 px-2 h-auto"  alt="" />
                        <h3 className="font-bold text-base">Sheena Joy Muyuela (Faculty Admin)</h3>
                        
                  
          
                        <span className="text-xs mt-2 text-[#333333]">Subject:</span>
                    <h4 className="text-sm  font-bold">Reminder: Attendance Checking Schedule Today</h4> 
                  
                 <span className="text-xs mt-1 text-[#333333]">Sent on May 5, 2024 at 12:00 AM</span>
                
                
                </div>
              
              
               
            </li>

            <li style={{border: "1px solid #D9D9D9"}} className="bg-[#D9D9D9] flex flex-wrap flex-col items-start gap-3 p-3 rounded-lg shadow drop-shadow">
                
                <i  className="fa-solid fa-xmark text-2xl mb-20 absolute right-0 top-0 me-4 py-2 text-[#ff0000]"></i>
             
              
                <div className="flex flex-col gap-1">
                        <span className="text-xs text-[#333333]">From:</span>
                        <Image src={femaleProf} className="flex w-16 px-2 h-auto"  alt="" />
                        <h3 className="font-bold text-base">Sheena Joy Muyuela (Faculty Admin)</h3>
                        
                  
          
                        <span className="text-xs mt-2 text-[#333333]">Subject:</span>
                    <h4 className="text-sm  font-bold">Reminder: Attendance Checking Schedule Today</h4> 
                  
                 <span className="text-xs mt-1 text-[#333333]">Sent on May 5, 2024 at 12:00 AM</span>
                
                
                </div>
              
              
               
            </li>
        </ul>
    </div>
         {/* For large screens */}
        <table className="animate-fadeUp table-auto mx-auto w-fit text-black text-left rtl:text-right hidden lg:block">
            <thead className="bg-[#2C384A] shadow drop-shadow rounded-lg">
                <tr className=" shadow drop-shadow ">
                    <th scope="col" className="shadow drop-shadow text-base text-center px-4 py-3 text-white">FROM</th>
                    <th scope="col" className="px-4 py-2 text-center text-base text-white shadow drop-shadow">SUBJECT</th>
                    <th scope="col" className="px-4 py-2 text-center text-base text-white shadow drop-shadow">SENT</th>
                    <th scope="col" className="px-4 py-2 text-center text-base text-white shadow drop-shadow">READ?</th>
               
                </tr>
            </thead>
            <tbody >
              
                <tr>
                    <th id="notifContainer1" scope="row" className=" px-4 py-2 text-base bg-[#D9D9D9] h-full  shadow drop-shadow  ">
                     <div className="flex flex-row items-center justify-center gap-3 flex-wrap">
                        <Image src={femaleProf} className="self-center w-10 h-10" alt="" />
                        
                        <div className=" flex items-center flex-col">
                            <h3 className="font-bold text-lg">
                                Sheena Joy Muyuela
                            </h3>
                            <span className="text-xs text-[#333333] font-normal">(Faculty Admin)</span>
                        </div>
                          
                            
                              
                     </div>
                    </th>
                    <td id="notifContainer2" className="bg-[#D9D9D9] text-center  shadow drop-shadow px-4 py-2 text-base">
                        <h3 id="showNotif" data-modal-target="notification-modal" data-modal-toggle="notification-modal" className="cursor-pointer ">
                            Reminder: Attendance Checking Schedule Today
                        </h3>
                    </td>
                    <td id="notifContainer3" className="bg-[#D9D9D9] text-center  shadow drop-shadow px-4 py-2 ">
                        <div>
                            <h4 className="text-base font-bold">May 5, 2024</h4>
                            <span className="text-sm text-[#333333]">12:00 AM</span>
                        </div>
                        
                    </td>
                
                    <td id="notifContainer4" className="bg-[#D9D9D9] text-center  shadow drop-shadow px-4 py-2 ">
                        <i id="statusIcon" className="fa-solid fa-xmark text-2xl text-[#ff0000]"></i>
                    </td>
                   
                 </tr>

                 <tr>
                    <th scope="row" className=" px-4 py-2 text-base bg-[#D9D9D9] h-full  shadow drop-shadow  ">
                     <div className="flex flex-row items-center justify-center gap-3 flex-wrap">
                        <Image src={femaleProf} className="self-center w-10 h-10" alt="" />
                        
                        <div className=" flex items-center flex-col">
                            <h3 className="font-bold text-lg">
                                Sheena Joy Muyuela
                            </h3>
                            <span className="text-xs text-[#333333] font-normal">(Faculty Admin)</span>
                        </div>
                          
                            
                              
                     </div>
                    </th>
                    <td  className="bg-[#D9D9D9] text-center  shadow drop-shadow px-4 py-2 text-base">
                        <h3 id="showNotif" data-modal-target="notification-modal" data-modal-toggle="notification-modal" className="cursor-pointer ">
                            Reminder: Attendance Checking Schedule Today
                        </h3>
                    </td>
                    <td className="bg-[#D9D9D9] text-center  shadow drop-shadow px-4 py-2 ">
                        <div>
                            <h4 className="text-base font-bold">May 12, 2024</h4>
                            <span className="text-sm text-[#333333]">12:00 AM</span>
                        </div>
                        
                    </td>
                
                    <td className="bg-[#D9D9D9] text-center  shadow drop-shadow px-4 py-2 ">
                        <i  className="fa-solid fa-xmark text-2xl text-[#ff0000]"></i>
                    </td>
                   
                 </tr>

            </tbody>
            

        </table>
       
</div>
</div>
 <Footer />
 </div>
    )
}

export default Notifications