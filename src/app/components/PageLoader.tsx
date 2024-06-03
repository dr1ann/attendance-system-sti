

const PageLoader = () => {


  return (
    <>
      
      <div className='flex space-x-2 justify-center items-center bg-white min-h-screen '>
      <span className='sr-only'>Loading...</span>
       <div className='h-3 w-3 lg:h-4 lg:w-4 bg-[#01579B] rounded-full animate-bounce [animation-delay:-0.3s]'></div>
     <div className='h-3 w-3 lg:h-4 lg:w-4 bg-[#01579B] rounded-full animate-bounce [animation-delay:-0.15s]'></div>
     <div className='h-3 w-3 lg:h-4 lg:w-4 bg-[#01579B] rounded-full animate-bounce'></div>
   </div>
      
    </>
  );
};

export default PageLoader;
