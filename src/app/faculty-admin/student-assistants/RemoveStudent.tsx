import React, { useState } from 'react';
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

interface ModalProps {
  id: string;
  setRefetch: () => void;
  
}

interface ApiResponseType {
  error?: string | undefined
  message?: string | undefined
  status?: number | undefined
}

const RemoveStudent: React.FC<ModalProps> = ({ id, setRefetch }) => {
  const [isStudentRemoved, setIsStudentRemoved] = useState(false);
  const [isRemoveBtnPressed, setIsRemoveBtnPressed] = useState(false);
  const [isConfirmationShown, setIsConfirmationShown] = useState(false);
  const [removeError, setIsremoveError] = useState('');
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [key, setKey] = useState(Math.random()); // Add this line

  const removeStudent = async () => {

    try {
    
      setIsRemoveBtnPressed(true);
      const response = await fetch('/api/remove-student', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
  
      const data: ApiResponseType = await response.json();
  
      if (response.ok) {
        setIsremoveError('');
        setIsStudentRemoved(true);
        setRefetch()
      } else {
        setIsStudentRemoved(false);
        setIsremoveError('Error removing the student. Please try again');
        console.error(data.message);
      }
    } catch (error) {
      setIsStudentRemoved(false);
      setIsremoveError('Something went wrong. Please try again');
    } finally {
     
      setIsConfirmationShown(true);
      setTimeout(() => {
        setIsRemoveBtnPressed(false);
        setIsConfirmationShown(false);
        setIsStudentRemoved(false);
        setKey(Math.random()); // Add this line to force a re-render of the modal
        setTimeout(() => {
          setIsModalOpen(false); // PUT DELAY ON CLOSING THE MODAL
        }, 1000)
      }, 2500);
      
    }
  };
  const handleRemoveStudent = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    removeStudent()
  };
  
  
  return (
    <div>
     
        <AlertDialog key={key}>
          <AlertDialogTrigger  onClick={() => setIsModalOpen(true)} className="shadow  bg-transparent  border-[1px] border-[#ff0000] border-dashed hover:text-white hover:bg-[#ff0000]  hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 w-fit mx-auto  rounded-lg px-2 py-1 cursor-pointer flex  justify-center flex-row items-center gap-1">
            <i className="fa-solid fa-user-minus text-xs text-center "></i>
            <span className="font-semibold text-sm text-center">Remove Account</span>
          </AlertDialogTrigger>
          {isModalOpen && 
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to remove this student?</AlertDialogTitle>
              <AlertDialogDescription>
                Removing this student will permanently delete their data from the system. This action cannot be undone. Please confirm if you wish to proceed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>No</AlertDialogCancel>
              <AlertDialogAction className="bg-[#2C384A]" onClick={handleRemoveStudent} disabled={isRemoveBtnPressed}>
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
                  <div id="alert-3" className={`animate-fadeUp absolute bottom-0 flex items-center p-4 mb-4 ${isStudentRemoved ? 'text-[#28a745]' : 'text-[#ff0000]'} rounded-lg ${isStudentRemoved ? 'bg-green-50' : 'bg-red-50'}`} role="alert">
                    <i className={`${isStudentRemoved ? 'text-[#28a745]' : 'text-[#ff0000]'} fa-solid ${isStudentRemoved ? 'fa-check' : 'fa-times'}`}></i>
                    <span className="sr-only">{isStudentRemoved ? 'Success' : 'Error'}</span>
                    <div className="ms-3 text-sm font-medium">
                      {isStudentRemoved ? 'Student was removed successfully' : removeError}
                    </div>
                  </div>
                </div>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
}
        </AlertDialog>
      
    </div>
  );
};

export default RemoveStudent;
