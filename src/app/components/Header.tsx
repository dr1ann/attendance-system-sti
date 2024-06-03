
//External Libraries
import Image, { StaticImageData } from "next/image";

//type
interface HeaderProps {
    headingImg: StaticImageData;
    headingName: string;
  }
  const Header = ({ headingImg, headingName }: HeaderProps) => {
    return (
        <header className="fixed w-full max-w-[2050px] top-0 left-[max(0px,calc(50%-64.0625rem))] z-20 bg-[#01579B] text-white shadow drop-shadow">
        <div className="flex items-center px-0 justify-center lg:px-4 py-2 lg:py-0">
            
            <Image src={headingImg} className="w-8 lg:w-16" alt="" />
                
                <h1 className="text-sm lg:text-base pr-4 lg:pr-0 font-bold">{headingName}</h1>
                
        </div>
        <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="bottom-0 lg:bottom-2 ms-1 lg:ms-3 absolute z-20 p-2 my-2  text-sm lg:text-xl text-white  hover:bg-opacity-40 rounded-lg hover:bg-white hover:shadow hover:drop-shadow" title="Close Sidebar">
            <span className="sr-only">Open sidebar</span>
            <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
            </svg>
        </button>
        
       
        
    </header>
    )
   
}

export default Header