import { ExportAllSchedules } from '@/app/components/ExportToExcel';
import { Schedule as PrismaSchedule } from '@prisma/client';
import { useEffect, useState } from 'react';

interface Schedule extends PrismaSchedule {
  studentName: string | null;
}

const ScheduleList = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch('/api/read-all-schedules', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch schedules');
        }

        const data: Schedule[] = await response.json();
        setSchedules(data.map(schedule => ({
          ...schedule,
          studentName: schedule.studentName ?? null, // Ensure studentName is not undefined
        })));
        setLoading(false);
      } catch (error) {
        setError("Something went wrong");
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const handleExport = () => {
    ExportAllSchedules(schedules, 'All Schedule Reports');
  };

  return (
    <li onClick={handleExport} className="shadow bg-transparent border-[1px] border-[#D9D9D9] hover:bg-[#D9D9D9] hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 cursor-pointer gap-1 flex items-center justify-center p-2 rounded-lg ">
      <i className="fa-solid fa-calendar-days text-lg text-[#2C384A]"></i>
      <span className="font-semibold text-sm text-center">Schedules</span>
    </li>
  );
};

export default ScheduleList;