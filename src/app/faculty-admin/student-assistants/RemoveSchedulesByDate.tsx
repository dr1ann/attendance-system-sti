import React, { useEffect, useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/app/components/shadcn/alert-dialog"

  interface ApiResponseType {
    message?: string | undefined
    status?: number | undefined
  }

interface ModalProps {
    selectedDate: string | Date | null;
    setRefetch: () => void;
    handleDateChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    formatDate: (dateString: string | Date | null) => string;
    uniqueDates: string[];
}

const RemoveSchedulesByDate: React.FC<ModalProps> = ({  selectedDate, setRefetch, handleDateChange, formatDate, uniqueDates }) => {
  const [isRemoveBtnPressed, setIsRemoveBtnPressed] = useState(false);
  const [isScheduleRemoved, setIsScheduleRemoved] = useState(false);
  const [removeError, setRemoveError] = useState('');
  const [isConfirmationShown, setIsConfirmationShown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [key, setKey] = useState(Math.random()); 

  const handleDeleteSchedules  = async () => {
    try {
      setIsRemoveBtnPressed(true);
      const response = await fetch('/api/delete-schedules-by-date', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scheduledDate: formatDate (selectedDate) }),
      });

      const data: ApiResponseType = await response.json();

      if (response.ok) {
        setRemoveError('');
        setIsScheduleRemoved(true);
      } else {
        setIsScheduleRemoved(false);
        setRemoveError('Error removing schedule. Please try again');
        console.error(data.message);
      }
    } catch (error) {
      setIsScheduleRemoved(false);
      setRemoveError('Something went wrong. Please try again');
    } finally {
        setTimeout(() => {
            setIsRemoveBtnPressed(false);
          }, 1500)
   
      setIsConfirmationShown(true);
    }
  };
  useEffect(() => {
    if (isConfirmationShown) {
      const timer = setTimeout(() => {
        setIsConfirmationShown(false);
        setIsScheduleRemoved(false);
        setKey(Math.random()); // Add this line to force a re-render of the modal
        setRefetch();
        setTimeout(() => {
            setIsModalOpen(false); // PUT DELAY ON CLOSING THE MODAL
          }, 1000)
        
      }, 1500); // Show confirmation for 1.5 seconds before refetching and closing the modal
      return () => clearTimeout(timer);
    }
  }, [isConfirmationShown, setRefetch]);

  const handleRemoveSchedule =  (e: React.MouseEvent<HTMLButtonElement>) => {
   e.preventDefault()
   handleDeleteSchedules ()
  };

  return (
    <>
       <div className="block lg:flex flex-row items-center justify-center gap-6">
            <div className={`rounded-lg relative w-full lg:w-[80%] mb-4 lg:mb-0`}>
      <div className="relative ">
<select onChange={(e) => handleDateChange(e)}
    name="date"
      id="date"
      value={selectedDate ? formatDate(selectedDate) : ''}
  className={`text-sm lg:text-base block py-2 px-3 w-full text-black bg-transparent rounded-lg border-[1px]  focus:border-[#01579B] appearance-none focus:outline-none focus:ring-0 peer`}
    
    >
  {uniqueDates.map((dateString, index) => (
    <option key={index} value={dateString}>
      {dateString}
    </option>
  ))}
</select>
<div className="absolute inset-y-0 right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
      <svg
        className="w-5 h-5 text-gray-500"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </div>
    </div>
    <label
      htmlFor="date"
      className={`
       text-[#888] peer-focus:text-[#01579B]
      bg-white rounded-full tracking-wide text-nowrap absolute text-xs lg:text-sm duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-[0.625rem] peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}
    >
      Select Date (dd/mm/year)
    </label>
    </div>
    <AlertDialog key={key}>
          <AlertDialogTrigger onClick={() => setIsModalOpen(true)} className="shadow  bg-transparent  border-[1px] border-[#ff0000] border-dashed hover:text-white hover:bg-[#ff0000]  hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 w-fit ml-auto  rounded-lg px-2 py-1 cursor-pointer flex  justify-center flex-row items-center gap-1">
            <i className="fa-solid fa-calendar-minus text-xs text-center "></i>
            <span className="font-semibold text-sm text-center">Remove Date</span>
          </AlertDialogTrigger>
          {isModalOpen &&
          <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete all schedules for {formatDate(selectedDate)}?</AlertDialogTitle>
              <AlertDialogDescription>
              Deleting all schedules for this date will permanently remove them from the system. This action cannot be undone. Please confirm if you wish to proceed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>No</AlertDialogCancel>
             
              <AlertDialogAction className="bg-[#2C384A]" onClick={handleRemoveSchedule} disabled={isRemoveBtnPressed}>
                {isRemoveBtnPressed ? (
                  <>
                    <span className='sr-only'>Loading...</span>
                    <div className='h-1 w-1 bg-[#D9D9D9] rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                    <div className='h-1 w-1 bg-[#D9D9D9] rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                    <div className='h-1 w-1 bg-[#D9D9D9] rounded-full animate-bounce'></div>
                  </>
                ) : (
                  <span>Yes</span>
                )}
              </AlertDialogAction>
              {isConfirmationShown && (
                <div className="flex animate-fadeUp z-[99999] min-h-screen  m-auto overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 justify-center items-center w-full md:inset-0 max-h-full">
                  <div id="alert-3" className={`animate-fadeUp absolute bottom-0 flex items-center p-4 mb-4 ${isScheduleRemoved ? 'text-[#28a745]' : 'text-[#ff0000]'} rounded-lg ${isScheduleRemoved ? 'bg-green-50' : 'bg-red-50'}`} role="alert">
                    <i className={`${isScheduleRemoved ? 'text-[#28a745]' : 'text-[#ff0000]'} fa-solid ${isScheduleRemoved ? 'fa-check' : 'fa-times'}`}></i>
                    <span className="sr-only">{isScheduleRemoved ? 'Success' : 'Error'}</span>
                    <div className="ms-3 text-sm font-medium">
                      {isScheduleRemoved ? 'All schedules were removed successfully' : removeError}
                    </div>
                  </div>
                </div>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
}
        </AlertDialog>
      
    </div>
      
    </>
  );
};

export default RemoveSchedulesByDate;
