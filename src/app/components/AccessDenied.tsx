'use client'
import Image from 'next/image';
import Footer from './Footer';
import accesdenied from '@/app/Images/accessdenied.png';
import { useRouter } from 'next/navigation';

const AccessDenied = () => {
  const router = useRouter();

  const handleGoBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.back();
  };
  const handleGoHome = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push('/');
  };
  return (
    <div className="max-w-[2050px] mx-auto">
      <div className='flex flex-col  items-center  justify-center min-h-screen'>
        <Image priority src={accesdenied} className='w-[30rem] lg:w-[36rem] h-auto' alt='access denied' />
        <div className='flex flex-wrap flex-col items-center gap-1 p-4'>
          <h1 className='font-extrabold text-[2rem] lg:text-[4rem] text-center'>Access Denied</h1>
          <span className='text-base lg:text-lg text-center'>You do not have permission to view this page.</span>
          <div className="flex flex-row items-center gap-5">
          <button
            className="shadow bg-transparent border-[1px] border-[#D9D9D9] mt-4 hover:bg-[#D9D9D9] hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 w-fit rounded-lg px-4 py-2 cursor-pointer flex justify-center flex-row items-center gap-1"
            onClick={handleGoBack}
          >
            Go Back
          </button>
          <button
            className="shadow bg-transparent border-[1px] border-[#D9D9D9] mt-4 hover:bg-[#D9D9D9] hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 w-fit rounded-lg px-4 py-2 cursor-pointer flex justify-center flex-row items-center gap-1"
            onClick={handleGoHome}
          >
            Go Home
          </button>
          </div>
          
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AccessDenied;
