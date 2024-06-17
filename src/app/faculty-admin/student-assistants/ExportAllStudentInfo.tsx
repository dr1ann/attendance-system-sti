import { ExportAllStudents } from '@/app/components/ExportToExcel';

import { useEffect, useState } from 'react';

interface User {
    studentId: string | null;
    name: string;
    academicLevel: string | null;
    section: string | null;
    program: string | null;
    yearLevel: string | null;
    gender: string | null;
    createdAt: Date;
  }


const StudentsList= () => {
  
  const [isExportBtnPressed, setIsExportBtnPressed] = useState(false);
  const [error, setError] = useState('');
  const [refetch, setRefetch] = useState(false);
  useEffect(() => {
    if(refetch) {
      setIsExportBtnPressed(true)
    const fetchStudents = async () => {
      try {
      
        const response = await fetch('/api/students', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          setError('Failed to Export Students Info')
          throw new Error('Failed to fetch students Info');
        }

       
        const data: User[] = await response.json();
        ExportAllStudents(data, 'Student Assistants Information Report');
      } catch (error) {
        setError("Failed to Export Students Info");
     
      } finally {
        setRefetch(false)
        setIsExportBtnPressed(false)
      } 
    };

    fetchStudents();

}
  }, [refetch]);

  const handleExport = () => {
    setRefetch(true)
};

  return (
    <div className='flex flex-col'>
{isExportBtnPressed ?
  <button disabled={isExportBtnPressed} className="shadow bg-transparent border-[1px] border-[#D9D9D9] hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 cursor-not-allowed gap-1 flex items-center justify-center p-2 rounded-lg ">
  <span className='sr-only'>Loading...</span>
  <div className='h-2 w-2 bg-[#D9D9D9] rounded-full animate-bounce [animation-delay:-0.3s]'></div>
  <div className='h-2 w-2 bg-[#D9D9D9] rounded-full animate-bounce [animation-delay:-0.15s]'></div>
  <div className='h-2 w-2 bg-[#D9D9D9] rounded-full animate-bounce'></div>
  </button>
:
<button onClick={handleExport} disabled={isExportBtnPressed} className="shadow bg-transparent border-[1px] border-[#D9D9D9] hover:bg-[#D9D9D9] hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 cursor-pointer gap-1 flex items-center justify-center p-2 rounded-lg ">
      <i className="fa-solid fa-circle-info text-lg text-[#2C384A]"></i>
      <span className="font-semibold text-sm text-center">Info</span>
    </button>
}
    
    
    {error && 
    <div className=" flex flex-row items-center justify-center gap-1 text-[#ff0000]   ">
<i className="fa-solid fa-circle-exclamation text-[13px]"></i>
<p className="  text-[13px]">{error} </p>


</div>
}
    </div>
  );
};

export default StudentsList;