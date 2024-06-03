'use client'
import React, {useEffect, useState} from "react";

const NavProgressBar = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if(progress <100) {
            setProgress(progress + 10)
        }
    },[progress])
  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-[#fff] z-50">
        <div className="h-full w-0 bg-[#2C384A] z-[99999] transition transition-width duration-500 ease-in-out"></div>
    </div>
  )
}
export default NavProgressBar

