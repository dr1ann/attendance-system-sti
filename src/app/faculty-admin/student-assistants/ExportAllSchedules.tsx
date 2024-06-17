import { ExportAllSchedules } from '@/app/components/ExportToExcel';
import { Schedule as PrismaSchedule } from '@prisma/client';
import { useEffect, useState } from 'react';

interface Schedule extends PrismaSchedule {
  studentName: string | null;
}


const ScheduleList = () => {
  
  const [refetch, setRefetch] = useState<boolean>(false);
  const [isExportBtnPressed, setIsExportBtnPressed] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (refetch) {
      setIsExportBtnPressed(true);
      const fetchSchedules = async () => {
        try {
          const response = await fetch('/api/read-all-schedules', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          if (!response.ok) {
            setError('Failed to Export Schedules');
            throw new Error('Failed to fetch schedules');
          }
  
          const data: Schedule[] = await response.json();
  
          // Check if data is not null or empty
          if (!data || data.length === 0) {
            setError('No schedules found to export');
            return;
          }
          
          const modifiedData = data.map(schedule => ({
            ...schedule,
            studentName: schedule.studentName ?? null, // Ensure studentName is not undefined
          }));
  
          setError('');
  
          ExportAllSchedules(modifiedData, 'All Schedule Reports');
        } catch (error) {
          setError('Failed to Export Schedules');
        } finally {
          setRefetch(false);
          setIsExportBtnPressed(false);
        }
      };
  
      fetchSchedules();
    }
  }, [refetch]);
  
  const handleExport = () => {
    setRefetch(true);
    
    
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
      <i className="fa-solid fa-calendar-days text-lg text-[#2C384A]"></i>
      <span className="font-semibold text-sm text-center">Schedules</span>
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

export default ScheduleList;