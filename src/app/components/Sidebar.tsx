//External Libraries
import { StaticImageData} from "next/image";
import {useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import  Image  from "next/image";

// Images
import dashboard from '@/app/Images/dashboard.png';
import studentassistants from '@/app/Images/attendance.png';
import attendance from '@/app/Images/attendance.png'
import notifications from '@/app/Images/notification.png';
import profile from '@/app/Images/profile.png';
import logo from '@/app/Images/logo.png';

// Sidebar items for faculty-admin folder
const facultyAdminSidebarItems = [
  { path: 'dashboard', icon: dashboard, title: 'Dashboard' },
  { path: 'student-assistants', icon: studentassistants, title: 'Student Assistants' },
  { path: 'notifications', icon: notifications, title: 'Notifications' },
  { path: 'profile', icon: profile, title: 'Profile' },
];

// Sidebar items for student-assistants folder
const studentAssistantsSidebarItems = [
  { path: 'dashboard', icon: dashboard, title: 'Dashboard' },
  { path: 'attendance', icon: attendance, title: 'Attendance' },
  { path: 'notifications', icon: notifications, title: 'Notifications' },
  { path: 'profile', icon: profile, title: 'Profile' },
];

const Sidebar = () => {

    const pathname = usePathname();

//get the current path and folder by splitting it 
 const currentPath = pathname.split('/').filter(segment => segment).pop();
 const currentFolder = pathname.split('/')[1];
 const [sidebarItems, setSidebarItems] = useState<{ path: string; icon: StaticImageData; title: string; }[]>([]);
      
 // Set sidebar items based on the current folder
      useEffect(() => {
        if (currentFolder === 'faculty-admin') {
            setSidebarItems(facultyAdminSidebarItems);
        } else if (currentFolder === 'student-assistant') {
            setSidebarItems(studentAssistantsSidebarItems);
        }
    }, [currentFolder]);

 useEffect(() => {
        const drawerButton = document.querySelector('[data-drawer-toggle="default-sidebar"]');
        const drawer = document.getElementById('default-sidebar');
        const container = document.getElementById('container');
        const footer = document.getElementById('footer');

        const toggleDrawer = () => {
            if (drawer) {
                drawer.classList.toggle('-translate-x-full');
                drawer.classList.toggle('lg:hidden');
              
            }
            if (container) {
                container.classList.toggle('lg:ml-64');
            }
            if (footer) {
                footer.classList.toggle('lg:absolute');
                footer.classList.toggle('lg:left-[260px]');
                footer.classList.toggle('lg:right-0');
            }

            if (drawerButton) {
                const currentTitle = drawerButton.getAttribute('title');
                  if (currentTitle === 'Close Sidebar') {
                  
                    drawerButton.setAttribute('title', 'Open Sidebar');
                   
                 
                } else if (currentTitle === 'Open Sidebar') {
                    
                    drawerButton.setAttribute('title', 'Close Sidebar');
                  
                }
            }
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (drawer && !drawer.contains(event.target as Node) && drawerButton && !drawerButton.contains(event.target as Node)) {
                drawer.classList.add('-translate-x-full');
            }
        };

        if (drawerButton) {
            drawerButton.addEventListener('click', toggleDrawer);
        }
        document.addEventListener('click', handleClickOutside);

        return () => {
            if (drawerButton) {
                drawerButton.removeEventListener('click', toggleDrawer);
            }
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    

    return (
        <div>
            <aside
                id="default-sidebar"
                className="lg:animate-slideInLeft fixed top-0 lg:top-[4rem] left-[max(0px,calc(50%-64.0625rem))] z-40 w-64 h-screen transition-transform -translate-x-full lg:translate-x-0"
                aria-label="Sidebar"
            >
                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 shadow drop-shadow">
                    <div className="flex items-center ps-2.5 mb-5">
                        <Image src={logo} className="w-20 h-auto me-3 object-contain" alt="logo" />
                        <span className="font-black self-center text-xl tracking-wide">ADAS-STI</span>
                    </div>

                    <ul className="space-y-2 font-medium">
                        {sidebarItems.map((item, index) => (
                            <li key={index}>
                                <Link
                                    href={`/${currentFolder}/${item.path}`}
                                    className={`flex items-center p-2 rounded-lg group ${currentPath === item.path ? 'bg-[#D9D9D9]' : 'hover:bg-gray-100'}`}
                                >
                                    <Image src={item.icon} className="w-10 h-auto" alt={item.title} />
                                    <span className="ms-3">{item.title}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
        </div>
    );
};

export default Sidebar;
