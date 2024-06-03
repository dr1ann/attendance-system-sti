import React from 'react'
import Image from 'next/image'
import somethingwentwrongimg from '@/app/Images/somethingwentwrong.png'
import Footer from './Footer'


const SomethingWentWrong = () => {
  

  return (
    <div className="max-w-[2050px] mx-auto">
      <div className='flex flex-col  items-center  justify-center min-h-screen'>
        <Image priority src={somethingwentwrongimg} className='w-[20rem] lg:w-[28rem] h-auto' alt='access denied' />
        <div className='flex flex-wrap flex-col items-center gap-1 p-4'>
          <h1 className='font-extrabold text-[1.5rem] lg:text-[2rem] text-center'> Oops! Something went wrong</h1>
          <span className='text-sm lg:text-base text-center'>Sorry we're having some technical issues. Try refreshing the page.</span>
          
        
       
          
          
        </div>
      </div>
      
    </div>
  )
}

export default SomethingWentWrong