import PageLoader from '@/app/components/PageLoader';
import { User } from '@prisma/client';
import React, { useEffect, useState } from 'react'
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
    currentId: string;
    isVisible: boolean;
    onClose: () => void;
    setRefetch: () => void;
  }

  interface ApiResponseType {
    message?: string | undefined
    status?: number | undefined
  }

const MoreInfo: React.FC<ModalProps> = ({setRefetch, currentId, isVisible, onClose })  => {

    
const [originalStudentInfo, setOriginalStudentInfo] = useState<User | null>(null);

const [studentInfo, setStudentInfo] = useState<User | null>(null);
const [isEditMode, setIsEditMode] = useState(false);

    const [error, setError] = useState('')
    const [isFetchSuccessful, setIsFetchSuccessful] = useState(false);
    const [isSavePressed, setIsSavePressed] = useState(false)
    const [isSuccessful, setIsSuccessful] = useState(false);

      // Validation states
  const [isStudentIdEmpty, setIsStudentIdEmpty] = useState(false);
  const [isNameEmpty, setIsNameEmpty] = useState(false);
  const [isAcademicLevelEmpty, setIsAcademicLevelEmpty] = useState(false);
  const [isSectionEmpty, setIsSectionEmpty] = useState(false);
  const [isProgramEmpty, setIsProgramEmpty] = useState(false);
  const [isYearLevelEmpty, setIsYearLevelEmpty] = useState(false);
  const [isGenderEmpty, setIsGenderEmpty] = useState(false);
  const [studentIdError, setStudentIdError] = useState('');

  const resetErrorStates = () => {
    setIsNameEmpty(false);
    setIsStudentIdEmpty(false);
    setIsAcademicLevelEmpty(false);
    setIsSectionEmpty(false);
    setIsProgramEmpty(false);
    setIsYearLevelEmpty(false);
    setIsGenderEmpty(false);
  };


    useEffect(() => {
        const fetchUserProfile = async () => {
          if (!currentId) return; // Skip fetching if currentId is null
    
          try {
            const response = await fetch('/api/student-info', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ currentId }),
            });
    
            if (!response.ok) {
              setIsFetchSuccessful(false);
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            setOriginalStudentInfo(data); 

          
            setStudentInfo(data);

          
            setIsFetchSuccessful(true);
          } catch (error) {
            console.error("Error fetching user profile:", error);
            setIsFetchSuccessful(false);
          }
        };
    
        fetchUserProfile();
      }, [currentId]); 

      
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;

  // No trimming applied to the value
  setStudentInfo((prevInfo: User | null) => {
      if (!prevInfo) {
          return prevInfo; // Return null if prevInfo is null
      }
      return { ...prevInfo, [name]: value };
  });

  // Reset state variables when the corresponding input field is not empty
  switch (name) {
      case 'studentId':
          setIsStudentIdEmpty(!value?.trim());
          break;
      case 'name':
          setIsNameEmpty(!value?.trim());
          break;
      case 'academicLevel':
          setIsAcademicLevelEmpty(!value?.trim());
          break;
      case 'section':
          setIsSectionEmpty(!value?.trim());
          break;
      case 'program':
          setIsProgramEmpty(!value?.trim());
          break;
      case 'yearLevel':
          setIsYearLevelEmpty(!value?.trim());
          break;
      case 'gender':
          setIsGenderEmpty(!value?.trim());
          break;
      default:
          break;
  }
};

    
    const updateStudentInfo = async () => {
        try {
          setIsSavePressed(true)
          if (!studentInfo || !originalStudentInfo) {
            console.error('No student information available.');
            return;
          }
    
          const hasChanges = Object.keys(studentInfo || {}).some((key: string) => {
            const studentKey = key as keyof User
            return (studentInfo as User)[studentKey] !== (originalStudentInfo as User)[studentKey];
        });

    
          if (!hasChanges) {
            setError('No changes were made')
            setStudentIdError('')
            return;
          }
    
          const response = await fetch('/api/student-info', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ currentId, data: studentInfo }),
          });
          const updatedProfile : User & ApiResponseType = await response.json();
           if(updatedProfile?.message === 'STUDENT ID ALREADY TAKEN') {
            
            setStudentIdError('A user with this Student ID already exists')
            setError('')
          } else if (!response.ok) {
            setStudentIdError('')
            setError('Something went wrong. Please try again')
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          else {
            
            setStudentInfo(updatedProfile);
            setOriginalStudentInfo(updatedProfile);
            setStudentIdError('')
            setIsSuccessful(true);  // Show success prompt
            setRefetch()
            resetErrorStates();
            setIsEditMode(false);
            setError('')
            // Hide the prompt after 2.5 seconds
            setTimeout(() => {
             setIsSuccessful(false);
             onClose()
            }, 1500);
          }
        
        } catch (error) {
          setStudentIdError('')
          setError('Something went wrong. Please try again')
        } finally {
          setIsSavePressed(false)
        }
      };
    
      const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        // Validate fields
        let isValid = true;
        
        if (!studentInfo?.name?.trim()) {
            setIsNameEmpty(true);
            isValid = false;
        }
        if (!studentInfo?.studentId?.trim()) {
            setIsStudentIdEmpty(true);
            setStudentIdError('');
            isValid = false;
        }
        if (!studentInfo?.academicLevel?.trim()) {
            setIsAcademicLevelEmpty(true);
            isValid = false;
        }
        if (!studentInfo?.section?.trim()) {
            setIsSectionEmpty(true);
            isValid = false;
        }
        if (!studentInfo?.program?.trim()) {
            setIsProgramEmpty(true);
            isValid = false;
        }
        if (!studentInfo?.yearLevel?.trim()) {
            setIsYearLevelEmpty(true);
            isValid = false;
        }
        if (!studentInfo?.gender?.trim()) {
            setIsGenderEmpty(true);
            isValid = false;
        }
    
        if (isValid) {
            updateStudentInfo();
        }
    };
    
    
      const handleEditClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        setIsEditMode(!isEditMode);
      };
      const handleDiscardCLick = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        resetErrorStates()
        setStudentInfo(originalStudentInfo); // Reset to the original state
        setIsEditMode(false);
      };

      function formatDate(timestamp: Date): string {
        const date = new Date(timestamp);
        const options: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
      }
      
      const userDataCreatedAt: Date | undefined = studentInfo?.createdAt;
    const joinedOn: string | undefined = userDataCreatedAt ? formatDate(userDataCreatedAt) : "N/A";

    if(!isVisible) {
        return null
    }

  return (
    <div data-modal-backdrop="add" aria-hidden="true" className="flex animate-fadeUp z-50 min-h-screen backdrop-blur-sm m-auto overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 justify-center items-center w-full md:inset-0 max-h-full">

{!isSuccessful

?
 
  
  <div className="relative p-4 w-full max-w-[46rem] m-auto">

 
    <div className="relative bg-white rounded-lg shadow">
      {/* <!-- Modal header --> */}
      <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t gap-2">
        <h3 className="text-lg lg:text-xl font-bold text-gray-900">
          <i className="fa-solid fa-circle-info text-base lg:text-lg text-center text-[#2C384A]"></i> {`${originalStudentInfo?.name || ''}'s Info`}
        </h3>
        <button onClick={(e) => { e.preventDefault(); onClose(); }} type="button" className="text-gray-400 bg-transparent hover:bg-gray-300 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="add-modal">
          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
          <span className="sr-only">Close modal</span>
        </button>
      </div>
      {!isFetchSuccessful
  ?
  <div className='flex space-x-2 justify-center items-center bg-white h-[70vh] '>
      <span className='sr-only'>Loading...</span>
       <div className='h-3 w-3 lg:h-4 lg:w-4 bg-[#01579B] rounded-full animate-bounce [animation-delay:-0.3s]'></div>
     <div className='h-3 w-3 lg:h-4 lg:w-4 bg-[#01579B] rounded-full animate-bounce [animation-delay:-0.15s]'></div>
     <div className='h-3 w-3 lg:h-4 lg:w-4 bg-[#01579B] rounded-full animate-bounce'></div>
   </div>

  :
      
        <div className='flex flex-col gap-4 p-6'>
      {isEditMode ?
    

<AlertDialog>
<AlertDialogTrigger className="bg-transparent border-[1px] border-[#ff0000] border-dashed hover:bg-[#ff0000] hover:text-white hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 shadow w-fit ml-auto rounded-lg px-2 py-1 cursor-pointer flex justify-center flex-row items-center gap-1">

<i className="fa-solid text-xs font-semibold fa-trash "></i>
<span className=" font-semibold text-xs lg:text-sm  text-center">Discard Changes</span>


</AlertDialogTrigger>
<AlertDialogContent>
<AlertDialogHeader>
<AlertDialogTitle>Discard Changes</AlertDialogTitle>
<AlertDialogDescription>
Are you sure you want to discard your changes? Any unsaved information will be lost.
</AlertDialogDescription>
</AlertDialogHeader>
<AlertDialogFooter>

<AlertDialogCancel>No</AlertDialogCancel>
<AlertDialogAction className="bg-[#2C384A]" onClick={handleDiscardCLick} >
Yes
</AlertDialogAction>
</AlertDialogFooter>

</AlertDialogContent>
</AlertDialog>
    :
    <button 
        onClick={handleEditClick}
        className={`bg-transparent border-[1px] border-[#D9D9D9] hover:bg-[#D9D9D9] hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 shadow w-fit ml-auto rounded-lg px-2 py-1 cursor-pointer flex justify-center flex-row items-center gap-1`}
      >
        <i className={`fa-solid text-xs font-semibold fa-pen-to-square text-[#2C384A]'}`}></i>
        <span className='text-xs lg:text-sm font-semibold'>Edit Info</span>
      </button>
    
    }
      
      
      
      <form className="pb-4 px-4 md:pb-5 md:px-5 gap-4"  onSubmit={handleSave}>
        <div className={`grid grid-cols-2 gap-4 ${isNameEmpty || isStudentIdEmpty || studentIdError ? 'mb-[45px] smallscreens:mb-[35px] lg:mb-[30px]' : ''}`}>
        <div className={`rounded-lg relative ${!isEditMode ? 'bg-gray-100' : ''}`}>
            <input
            readOnly={!isEditMode}
              value={studentInfo?.name || ''}
              onChange={handleInputChange}
              name="name"
              id="name"
              autoComplete="off"
              type="text"
              className={`text-sm lg:text-base block py-2 px-3 w-full text-black bg-transparent rounded-lg border-[1px] ${
                isNameEmpty ? 'border-[#ff0000] focus:border-[#ff0000]' : 'focus:border-[#01579B]'
            } appearance-none focus:outline-none focus:ring-0 peer`}
              placeholder=" "
            />
              <label htmlFor="name" className={`${isNameEmpty ? 'text-[#ff0000] peer-focus:text-[#ff0000]' : 'text-[#888] peer-focus:text-[#01579B] ' } ${!isEditMode ? 'bg-gray-100' : 'bg-white'} rounded-full text-[#888] peer-focus:text-[#01579B] tracking-wide absolute text-xs lg:text-sm duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-[0.625rem] peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}>
              Full name
            </label>
            {isNameEmpty &&
              <div className="items-center gap-1 flex flex-row ml-1 absolute top-11 left-0">
      <i className="text-[#ff0000] fa-solid text-xs mt-[2px] fa-circle-exclamation"></i> 
      <p className="text-[#ff0000] text-xs">Full name cannot be empty</p>
    </div>
    }
          </div>

          <div className={`rounded-lg relative ${!isEditMode ? 'bg-gray-100' : ''}`}>
            <input
            readOnly={!isEditMode}
              value={studentInfo?.studentId || ''}
              onChange={handleInputChange}
              name="studentId"
              id="studentId"
              autoComplete="off"
              type="text"
              className={`text-sm lg:text-base block py-2 px-3 w-full text-black bg-transparent rounded-lg border-[1px] ${
                isStudentIdEmpty || studentIdError  ? 'border-[#ff0000] focus:border-[#ff0000]' : 'focus:border-[#01579B]'
            } appearance-none focus:outline-none focus:ring-0 peer`}
              placeholder=" "
            />
              <label htmlFor="studentId" className={`${isStudentIdEmpty || studentIdError  ? 'text-[#ff0000] peer-focus:text-[#ff0000]' : 'text-[#888] peer-focus:text-[#01579B] ' } ${!isEditMode ? 'bg-gray-100' : 'bg-white'} rounded-full text-[#888] peer-focus:text-[#01579B] tracking-wide absolute text-xs lg:text-sm duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-[0.625rem] peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}>
              Student ID
            </label>
            {(isStudentIdEmpty || studentIdError) && (
    <div className="items-center gap-1 flex flex-row ml-1 absolute top-11 left-0">
      <i className="text-[#ff0000] fa-solid text-xs mt-[2px] fa-circle-exclamation"></i>
      <p className="text-[#ff0000] text-xs">
        {studentIdError || 'Student ID cannot be empty'}
      </p>
    </div>
  )}
          </div>
        </div>
        
       
        <div className={`grid grid-cols-2 gap-4 mt-6 ${isAcademicLevelEmpty || isSectionEmpty ? 'mb-[45px] smallscreens:mb-[35px] lg:mb-[30px]' : ''}`}>
        <div className={`rounded-lg relative ${!isEditMode ? 'bg-gray-100' : ''}`}>
            <input
            readOnly={!isEditMode}
              value={studentInfo?.academicLevel || ''}
              onChange={handleInputChange}
              name="academicLevel"
              id="academicLevel"
              autoComplete="off"
              type="text"
              className={`text-sm lg:text-base block py-2 px-3 w-full text-black bg-transparent rounded-lg border-[1px] ${
                isAcademicLevelEmpty ? 'border-[#ff0000] focus:border-[#ff0000]' : 'focus:border-[#01579B]'
            } appearance-none focus:outline-none focus:ring-0 peer`}
              placeholder=" "
            />
              <label htmlFor="academicLevel" className={`${isAcademicLevelEmpty ? 'text-[#ff0000] peer-focus:text-[#ff0000]' : 'text-[#888] peer-focus:text-[#01579B] ' } ${!isEditMode ? 'bg-gray-100' : 'bg-white'} rounded-full text-[#888] peer-focus:text-[#01579B] tracking-wide absolute text-xs lg:text-sm duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-[0.625rem] peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}>
              Academic Level
            </label>
            {isAcademicLevelEmpty &&
              <div className="items-center gap-1 flex flex-row ml-1 absolute top-11 left-0">
      <i className="text-[#ff0000] fa-solid text-xs mt-[2px] fa-circle-exclamation"></i> 
      <p className="text-[#ff0000] text-xs">Academic Level cannot be empty</p>
    </div>
    }
          </div>
          <div className={`rounded-lg relative ${!isEditMode ? 'bg-gray-100' : ''}`}>
            <input
            readOnly={!isEditMode}
              value={studentInfo?.section || ''}
              onChange={handleInputChange}
              name="section"
              id="section"
              autoComplete="off"
              type="text"
              className={`text-sm lg:text-base block py-2 px-3 w-full text-black bg-transparent rounded-lg border-[1px] ${
                isSectionEmpty ? 'border-[#ff0000] focus:border-[#ff0000]' : 'focus:border-[#01579B]'
            } appearance-none focus:outline-none focus:ring-0 peer`}
              placeholder=" "
            />
              <label htmlFor="section" className={`${isSectionEmpty ? 'text-[#ff0000] peer-focus:text-[#ff0000]' : 'text-[#888] peer-focus:text-[#01579B] ' } ${!isEditMode ? 'bg-gray-100' : 'bg-white'} rounded-full text-[#888] peer-focus:text-[#01579B] tracking-wide absolute text-xs lg:text-sm duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-[0.625rem] peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}>
              Section
            </label>
            {isSectionEmpty &&
              <div className="items-center gap-1 flex flex-row ml-1 absolute top-11 left-0">
      <i className="text-[#ff0000] fa-solid text-xs mt-[2px] fa-circle-exclamation"></i> 
      <p className="text-[#ff0000] text-xs">Section cannot be empty</p>
    </div>
    }
          </div>
          </div>

<div className={`grid grid-cols-2 gap-4 mt-6 ${isProgramEmpty || isYearLevelEmpty ? 'mb-[45px] smallscreens:mb-[35px] lg:mb-[30px]' : ''}`}>
<div className={`rounded-lg relative ${!isEditMode ? 'bg-gray-100' : ''}`}>
            <input
            readOnly={!isEditMode}
              value={studentInfo?.program || ''}
              onChange={handleInputChange}
              name="program"
              id="program"
              autoComplete="off"
              type="text"
              className={`text-sm lg:text-base block py-2 px-3 w-full text-black bg-transparent rounded-lg border-[1px] ${
                isProgramEmpty ? 'border-[#ff0000] focus:border-[#ff0000]' : 'focus:border-[#01579B]'
            } appearance-none focus:outline-none focus:ring-0 peer`}
              placeholder=" "
            />
              <label htmlFor="program" className={`${isProgramEmpty ? 'text-[#ff0000] peer-focus:text-[#ff0000]' : 'text-[#888] peer-focus:text-[#01579B] ' } ${!isEditMode ? 'bg-gray-100' : 'bg-white'} rounded-full text-[#888] peer-focus:text-[#01579B] tracking-wide absolute text-xs lg:text-sm duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-[0.625rem] peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}>
              Program
            </label>
            {isProgramEmpty &&
              <div className="items-center gap-1 flex flex-row ml-1 absolute top-11 left-0">
      <i className="text-[#ff0000] fa-solid text-xs mt-[2px] fa-circle-exclamation"></i> 
      <p className="text-[#ff0000] text-xs">Program cannot be empty</p>
    </div>
    }
          </div>

          <div className={`rounded-lg relative ${!isEditMode ? 'bg-gray-100' : ''}`}>
            <input
            readOnly={!isEditMode}
              value={studentInfo?.yearLevel || ''}
              onChange={handleInputChange}
              name="yearLevel"
              id="yearLevel"
              autoComplete="off"
              type="text"
              className={`text-sm lg:text-base block py-2 px-3 w-full text-black bg-transparent rounded-lg border-[1px] ${
                isYearLevelEmpty ? 'border-[#ff0000] focus:border-[#ff0000]' : 'focus:border-[#01579B]'
            } appearance-none focus:outline-none focus:ring-0 peer`}
              placeholder=" "
            />
              <label htmlFor="yearLevel" className={`${isYearLevelEmpty ? 'text-[#ff0000] peer-focus:text-[#ff0000]' : 'text-[#888] peer-focus:text-[#01579B] ' } ${!isEditMode ? 'bg-gray-100' : 'bg-white'} rounded-full text-[#888] peer-focus:text-[#01579B] tracking-wide absolute text-xs lg:text-sm duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-[0.625rem] peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}>
              Year Level
            </label>
            {isYearLevelEmpty &&
              <div className="items-center gap-1 flex flex-row ml-1 absolute top-11 left-0">
      <i className="text-[#ff0000] fa-solid text-xs mt-[2px] fa-circle-exclamation"></i> 
      <p className="text-[#ff0000] text-xs">Year Level cannot be empty</p>
    </div>
    }
          </div>
</div>
<div className={`grid grid-cols-2 gap-4 mt-6 ${isGenderEmpty ? 'mb-[45px] smallscreens:mb-[35px] lg:mb-[30px]' : ''}`}>
{isEditMode ?


<div className={`rounded-lg relative`}>
  <div className="relative">
    <select
      value={studentInfo?.gender || ''}
      onChange={handleInputChange}
      name="gender"
      id="gender"
      autoComplete="off"
      className={`peer text-sm lg:text-base block py-2 px-3 w-full text-black bg-transparent rounded-lg border-[1px] ${
        isGenderEmpty ? 'border-[#ff0000] focus:border-[#ff0000]' : 'focus:border-[#01579B]'
      } appearance-none focus:outline-none focus:ring-0`}
    >
      <option value="" disabled>
        Select Sex
      </option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
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
  
  <label
    htmlFor="gender"
    className={`${
      isGenderEmpty ? 'text-[#ff0000] peer-focus:text-[#ff0000]' : 'text-[#888] peer-focus:text-[#01579B]'
    } bg-white rounded-full tracking-wide absolute text-xs lg:text-sm duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-[0.625rem] peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}
  >
    Sex
  </label>
  </div>
  {isGenderEmpty && (
    <div className="items-center gap-1 flex flex-row ml-1 absolute top-11 left-0">
      <i className="text-[#ff0000] fa-solid text-xs mt-[2px] fa-circle-exclamation"></i>
      <p className="text-[#ff0000] text-xs">Sex cannot be empty</p>
    </div>
  )}
</div>

:
<div className={`rounded-lg relative bg-gray-100`}>
            <input
            readOnly
              value={studentInfo?.gender || ''}
              onChange={handleInputChange}
              name="gender"
              id="gender"
              autoComplete="off"
              type="text"
              className={`text-sm lg:text-base block py-2 px-3 w-full text-black bg-transparent rounded-lg border-[1px] 
              focus:border-[#01579B] appearance-none focus:outline-none focus:ring-0 peer`}
              placeholder=" "
            />
              <label htmlFor="gender" className= 'text-[#888] peer-focus:text-[#01579B] bg-gray-100 rounded-full tracking-wide absolute text-xs lg:text-sm duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-[0.625rem] peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1'>
              Sex
            </label>
    </div>

}
          <div className="rounded-lg relative bg-gray-100">
            <input
            readOnly
              value={joinedOn || ''}
              onChange={handleInputChange}
           
              name="joinedOn"
              id="joinedOn"
              autoComplete="off"
              type="text"
              className="text-sm lg:text-base block py-2 px-3 w-full text-black bg-transparent rounded-lg border-[1px] focus:border-[#01579B] appearance-none focus:outline-none focus:ring-0 peer"
              placeholder=" "
            />
            <label htmlFor="joinedOn" className="bg-gray-100 rounded-full text-[#888] peer-focus:text-[#01579B] tracking-wide absolute text-xs lg:text-sm duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-[0.625rem] peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">
            Joined on
            </label>
          </div>	
        
</div>
{isEditMode &&

<>
{isSavePressed 
?
<button type='submit' className="flex flex-row px-5 cursor-pointer shadow  bg-transparent  border-[1px] border-[#D9D9D9]    hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 items-center mx-auto w-fit mt-6 gap-1 py-3 rounded-lg" disabled={isSavePressed} >
<span className='sr-only'>Loading...</span>

<div className='h-2 w-2 bg-[#D9D9D9] rounded-full animate-bounce [animation-delay:-0.3s]'></div>
<div className='h-2 w-2 bg-[#D9D9D9] rounded-full animate-bounce [animation-delay:-0.15s]'></div>
<div className='h-2 w-2 bg-[#D9D9D9] rounded-full animate-bounce'></div>

</button>

:
<>
{isEditMode &&
<button type='submit' className="flex flex-row px-5 cursor-pointer shadow  bg-transparent  border-[1px] border-[#D9D9D9]  hover:bg-[#D9D9D9]  hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 items-center mx-auto w-fit mt-6 gap-1 py-3 rounded-lg" disabled={isSavePressed} >
<i className="fa-solid fa-floppy-disk text-xs lg:text-sm text-center text-[#2C384A]"></i>
<span className=" font-semibold text-sm  ">Save Changes</span>


</button>
}
</>
}
</>

}
{error && 
<div className="pt-2 flex flex-row items-center justify-center gap-1 text-[#ff0000]   ">
<i className="fa-solid fa-circle-exclamation text-[13px]"></i>
<p className="  text-[13px]">{error} </p>

</div>
}

      </form>
      </div>
      }
    </div>
    
  </div>
  :
  <div id="alert-3" className="animate-fadeUp absolute bottom-0 flex items-center p-4 mb-4 text-[#28a745] rounded-lg bg-green-50  " role="alert">
  <i className="text-[#28a745] fa-solid fa-check "></i>
<span className="sr-only">Success</span>
<div className="ms-3 text-sm font-medium">
Student information has been successfully updated
</div>
</div>

  }   
</div>

  )
}

export default MoreInfo