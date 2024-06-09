import React, { useState, useEffect, FormEvent, useRef } from 'react';


interface ModalProps {
    isVisible: boolean;
    onClose: () => void;
    setRefetch: () => void;
  }

  interface ApiResponseType {
    message?: string | undefined
    status?: number | undefined
  }
  

  const AddNewStudent: React.FC<ModalProps> = ({setRefetch, isVisible, onClose }) => {
    
    const [isAddBtnPressed, setIsAddBtnPressed] = useState(false)
    const [note, setNote] = useState('')
    const [error, setError] = useState('')
    const inputUserRef = useRef<HTMLInputElement>(null);
    const [copyUsernameSuccess, setCopyUsernameSuccess] = useState(false);
    const [copyPasswordSuccess, setCopyPasswordSuccess] = useState(false);
    const [isSuccessful, setIsSuccessful] = useState(false);

    const [isStudentIdEmpty, setIsStudentIdEmpty] = useState(false);
    const [isNameEmpty, setIsNameEmpty] = useState(false);
    const [isUsernameEmpty, setIsUsernameEmpty] = useState(false);
    const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);
    const [isAcademicLevelEmpty, setIsAcademicLevelEmpty] = useState(false);
    const [isSectionEmpty, setIsSectionEmpty] = useState(false);
    const [isProgramEmpty, setIsProgramEmpty] = useState(false);
    const [isYearLevelEmpty, setIsYearLevelEmpty] = useState(false);
    const [isGenderEmpty, setIsGenderEmpty] = useState(false);
    const [studentIdError, setStudentIdError] = useState('');
   

    const inputPasswordRef = useRef<HTMLInputElement>(null);
    const [newStudent, setNewStudent] = useState({
        username: '',
        name:'',
        password: '',
        academicLevel: '',
        section: '',
        program: '',
        yearLevel: '',
        studentId: '',
        gender:''
    });
   
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
  
      // No trimming applied to the value
      setNewStudent((prevStudent) => ({
          ...prevStudent,
          [name]: value,
      }));
  
      // Reset state variables when the corresponding input field is not empty
      switch (name) {
          case 'studentId':
              setIsStudentIdEmpty(!value?.trim());
              break;
          case 'name':
              setIsNameEmpty(!value?.trim());
              break;
          case 'username':
              setIsUsernameEmpty(!value?.trim());
              break;
          case 'password':
              setIsPasswordEmpty(!value?.trim());
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
  
    

    const handleUsernameCopy = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (inputUserRef?.current) {
          inputUserRef?.current?.select();
          document.execCommand('copy');
          setCopyUsernameSuccess(true);
          setTimeout(() => {
            setCopyUsernameSuccess(false);
          }, 1500); // Show the checkmark for 1.5 seconds
        }
      };

      const handlePasswordCopy = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (inputPasswordRef?.current) {
            inputPasswordRef?.current?.select();
          document.execCommand('copy');
          setCopyPasswordSuccess(true);
          setTimeout(() => {
            setCopyPasswordSuccess(false);
          }, 1500); // Show the checkmark for 1.5 seconds
        }
      };

    const generateRandomUsername = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const username = Math.random().toString(36).substr(2, 8);
        setNewStudent((prevStudent) => ({
            ...prevStudent,
            username: username,
        }));
        setIsUsernameEmpty(false);
        setNote('Note: Please copy the generated username and password and give it to the student ASAP for them to change it.')
    };

    const generateRandomPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const password = Math.random().toString(36).substr(2, 8);
        setNewStudent((prevStudent) => ({
            ...prevStudent,
            password: password,
        }));
        setIsPasswordEmpty(false);
        setNote('Note: Please copy the generated username and password and give it to the student ASAP for them to change it.')
    };

    const addStudent = async (studentData: typeof newStudent) => {
        try {
          setIsAddBtnPressed(true)
            const response = await fetch('/api/add-student', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId: studentData?.studentId,
                    name: studentData?.name,
                    gender: studentData?.gender,
                    username: studentData?.username,
                    password: studentData?.password,
                    academicLevel: studentData?.academicLevel,
                    section: studentData?.section,
                    program: studentData?.program,
                    yearLevel: studentData?.yearLevel,
                }),
            });
            const data : ApiResponseType = await response.json();
            if (response?.status === 201) {
            
                setNewStudent({
                  username: '',
                  name:'',
                  password: '',
                  academicLevel: '',
                  section: '',
                  program: '',
                  yearLevel: '',
                  studentId: '',
                  gender:''
              }); 
             
             setIsSuccessful(true);  // Show success prompt
             setRefetch()
            
             setError('')
             setStudentIdError('')
             // Hide the prompt after 2.5 seconds
             setTimeout(() => {
              setIsSuccessful(false);
              onClose()
             }, 1500);
            }
         else if (data?.message === 'STUDENT ID ALREADY TAKEN' ) {
            setError('')
          setStudentIdError('A user with this Student ID already exists')
         
        
         }  else {
            setStudentIdError('')
            setError('Something went wrong. Please try again')
              
              throw new Error('Failed to add student');
           
          }
        } catch (error) {
            setStudentIdError('')
          setError('Something went wrong. Please try again')
            console.error('Error:', error);
        } finally {
          setIsAddBtnPressed(false)
        }
    };

    const handleAddStudent = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      // Trim the input values
      const trimmedStudentData = {
          ...newStudent,
          studentId: newStudent?.studentId?.trim(),
          name: newStudent?.name?.trim(),
          username: newStudent?.username?.trim(),
          password: newStudent?.password?.trim(),
          academicLevel: newStudent?.academicLevel?.trim(),
          section: newStudent?.section?.trim(),
          program: newStudent?.program?.trim(),
          yearLevel: newStudent?.yearLevel?.trim(),
          gender: newStudent?.gender?.trim(),
      };
  
      // Validate fields
      let isValid = true;
  
      if (!trimmedStudentData.studentId) {
          setIsStudentIdEmpty(true);
          setStudentIdError('')
          isValid = false;
      }
  
      if (!trimmedStudentData.name) {
          setIsNameEmpty(true);
          isValid = false;
      }
  
      if (!trimmedStudentData.username) {
          setIsUsernameEmpty(true);
          isValid = false;
      }
  
      if (!trimmedStudentData.password) {
          setIsPasswordEmpty(true);
          isValid = false;
      }
  
      if (!trimmedStudentData.academicLevel) {
          setIsAcademicLevelEmpty(true);
          isValid = false;
      }
  
      if (!trimmedStudentData.section) {
          setIsSectionEmpty(true);
          isValid = false;
      }
  
      if (!trimmedStudentData.program) {
          setIsProgramEmpty(true);
          isValid = false;
      }
  
      if (!trimmedStudentData.yearLevel) {
          setIsYearLevelEmpty(true);
          isValid = false;
      }
  
      if (!trimmedStudentData.gender) {
          setIsGenderEmpty(true);
          isValid = false;
      }
  
      if (isValid) {
          addStudent(trimmedStudentData);
          setNote('');
      }
  };
  
   

    if(!isVisible) {
        return null
    }


    return (
        <>
        <div  data-modal-backdrop="add"  aria-hidden="true" className=" flex animate-fadeUp z-[99999] min-h-screen backdrop-blur-sm m-auto overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0  justify-center items-center w-full md:inset-0  max-h-full">
     {!isSuccessful
     ?
     <div className="relative p-4 w-full max-w-[46rem]  m-auto ">
     {/* <!-- Modal content --> */}
     <div className="relative bg-white rounded-lg shadow ">
         {/* <!-- Modal header --> */}
         <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t gap-2">
             <h3 className="text-lg lg:text-xl font-bold text-gray-900 ">
                 <i className="fa-solid fa-user-plus text-base lg:text-lg text-center text-[#2C384A]"></i> Add New Student Assistant
             </h3>
                         <button onClick={(e) => { e.preventDefault(); onClose(); }} type="button" className="text-gray-400 bg-transparent hover:bg-gray-300 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="add-modal">
             <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
                 <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
             </svg>
             <span className="sr-only">Close modal</span>
         </button>

         </div>
         {note !== '' ?
         <div className='flex justify-start gap-1 items-start px-8 pt-4 w-[90%]'>
         <i className="fa-solid fa-sticky-note mt-1 text-[#2C384A]"></i> 
         <span className='font-bold text-[#2C384A]'>{note}</span>
         </div>
         : ''}
         <div className='flex justify-start gap-1 items-center px-8 pt-8 '>
         <i className="fa-solid fa-pen-to-square text-xs font-semibold text-[#2C384A]"></i>
         <span className='text-sm font-semibold'>STUDENT INFO</span>
         </div>
         {/* <!-- Modal body --> */}
         <form className="pb-4 px-4 md:pb-5 md:px-5 gap-4" onSubmit={handleAddStudent}>
            
             <div className={`grid grid-cols-2 gap-4 mt-3 ${isNameEmpty || isYearLevelEmpty ? 'mb-[45px] smallerscreens:mb-[35px] lg:mb-[30px]' : ''}`}> 

             <div className="rounded-lg relative">
 <input
     value={newStudent?.name}
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
 <label htmlFor="name" className={`${isNameEmpty ? 'text-[#ff0000] peer-focus:text-[#ff0000]' : 'text-[#888] peer-focus:text-[#01579B] ' } tracking-wide absolute text-xs lg:text-sm duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-[0.625rem] peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}>
     Full name
 </label>
 {isNameEmpty && (
   <div className="items-center gap-1 flex flex-row ml-1 absolute top-11 left-0">
   <i className="text-[#ff0000] fa-solid text-xs mt-[2px] fa-circle-exclamation"></i> 
  <p className="text-[#ff0000]  text-xs">
 
  Full name cannot be empty
</p>
</div>
)}
</div>


<div className="rounded-lg relative">
 <input
     value={newStudent?.yearLevel}
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
 <label htmlFor="yearLevel" className={`${isYearLevelEmpty ? 'text-[#ff0000] peer-focus:text-[#ff0000]' : 'text-[#888] peer-focus:text-[#01579B] ' } tracking-wide absolute text-xs lg:text-sm duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-[0.625rem] peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}>
     Year level
 </label>
 {isYearLevelEmpty && (
   <div className="items-center gap-1 flex flex-row ml-1 absolute top-11 left-0">
   <i className="text-[#ff0000] fa-solid text-xs mt-[2px] fa-circle-exclamation"></i> 
  <p className="text-[#ff0000]  text-xs">
 
  Year level cannot be empty
</p>
</div>
)}
</div>
         
             
         </div>
         <div className={`grid grid-cols-2 gap-4 mt-6 ${isUsernameEmpty || isPasswordEmpty ? 'mb-[45px] sm:mb-[35px] lg:mb-[30px]' : ''}`}>
 <div className="bg-gray-100 rounded-lg relative">
     <input
         ref={inputUserRef}
         readOnly
         value={newStudent?.username}
         onChange={handleInputChange}
         name="username"
         id="username"
         autoComplete="off"
         type="text"
         className={` text-sm lg:text-base block py-2 px-3 w-full text-black bg-transparent rounded-lg border-[1px] ${
             isUsernameEmpty ? 'border-[#ff0000] focus:border-[#ff0000]' : 'focus:border-[#01579B]'
         } appearance-none focus:outline-none focus:ring-0 peer`}
         placeholder=" "
     />
     <label htmlFor="username" className={`${isUsernameEmpty ? 'text-[#ff0000] peer-focus:text-[#ff0000]' : 'text-[#888] peer-focus:text-[#01579B] ' } rounded-full tracking-wide absolute text-xs lg:text-sm duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-100 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-[0.625rem] peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}>
         Username
     </label>
     {isUsernameEmpty && (
     <div className="items-center gap-1 flex flex-row ml-1 absolute top-11 left-0">
         <i className="text-[#ff0000] fa-solid text-xs mt-[2px] fa-circle-exclamation"></i>
         <p className="text-[#ff0000] text-xs">
             Username cannot be empty
         </p>
     </div>
     )}

     <div className="flex flex-row flex-wrap items-center absolute top-1/2 right-0 transform -translate-y-1/2">
         {newStudent?.username && (
         <button onClick={handleUsernameCopy} className="text-[#2C384A] animate-fadeIn shadow bg-transparent border-[1px] hover:bg-[#D9D9D9] hover:border-transparent transition ease-in duration-200 active:translate-y-0 text-[10px] lg:text-xs rounded-lg px-2 py-1 mr-2 font-semibold">
             {copyUsernameSuccess ? (
             <i className="text-[#28a745] transition-opacity duration-500 ease-in-out fa-solid fa-check animate-fadeIn"></i>
             ) : (
             <i className="fa-solid transition-opacity duration-500 ease-in-out fa-copy"></i>
             )}
         </button>
         )}
         <button onClick={generateRandomUsername} className="shadow bg-transparent border-[1px] hover:bg-[#D9D9D9] hover:border-transparent transition ease-in duration-200 active:translate-y-0 text-[10px] lg:text-xs rounded-lg px-2 py-1 mr-2 font-semibold">Generate</button>
     </div>
 </div>

 <div className="rounded-lg relative bg-gray-100">
     <input
         ref={inputPasswordRef}
         value={newStudent?.password}
         onChange={handleInputChange}
         name="password"
         id="password"
         autoComplete="off"
         type="text"
         readOnly
         className={`text-sm lg:text-base block py-2 px-3 w-full text-black bg-transparent rounded-lg border-[1px] ${
             isPasswordEmpty ? 'border-[#ff0000] focus:border-[#ff0000]' : 'focus:border-[#01579B]'
         } appearance-none focus:outline-none focus:ring-0 peer`}
         placeholder=" "
     />
     <label htmlFor="password" className={` ${isPasswordEmpty ? 'text-[#ff0000] peer-focus:text-[#ff0000]' : 'text-[#888] peer-focus:text-[#01579B] ' } rounded-full tracking-wide absolute text-xs lg:text-sm duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-100 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}>
         Password
     </label>
     {isPasswordEmpty && (
     <div className="items-center gap-1 flex flex-row ml-1 absolute top-11 left-0">
         <i className="text-[#ff0000] fa-solid text-xs mt-[2px] fa-circle-exclamation"></i>
         <p className="text-[#ff0000] text-xs">
             Password cannot be empty
         </p>
     </div>
     )}

     <div className="flex flex-row flex-wrap items-center absolute top-1/2 right-0 transform -translate-y-1/2">
         {newStudent?.password && (
         <button onClick={handlePasswordCopy} className="text-[##2C384A] animate-fadeIn shadow bg-transparent border-[1px] border-[#D9D9D9] hover:bg-[#D9D9D9] hover:border-transparent transition ease-in duration-200 active:translate-y-0 text-[10px] lg:text-xs rounded-lg px-2 py-1 mr-2 font-semibold">
             {copyPasswordSuccess ? (
             <i className="text-[#28a745] transition-opacity duration-500 ease-in-out fa-solid fa-check animate-fadeIn"></i>
             ) : (
             <i className="fa-solid transition-opacity duration-500 ease-in-out fa-copy"></i>
             )}
         </button>
         )}
         <button onClick={generateRandomPassword} className="shadow bg-transparent border-[1px] border-[#D9D9D9] hover:bg-[#D9D9D9] hover:border-transparent transition ease-in duration-200 active:translate-y-0 text-[10px] lg:text-xs rounded-lg px-2 py-1 mr-2 font-semibold">Generate</button>
     </div>
 </div>
</div>
         
         <div className={`grid grid-cols-2 gap-4 mt-6 ${isAcademicLevelEmpty || isSectionEmpty ? 'mb-[45px] smallscreens:mb-[35px] lg:mb-[30px]' : ''}`}> 
         <div className="rounded-lg relative">
 <input
     value={newStudent?.academicLevel}
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
 <label htmlFor="academicLevel" className={`${isAcademicLevelEmpty ? 'text-[#ff0000] peer-focus:text-[#ff0000]' : 'text-[#888] peer-focus:text-[#01579B] ' } tracking-wide absolute text-xs lg:text-sm duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-[0.625rem] peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}>
     Academic Level
 </label>
 {isAcademicLevelEmpty && (
   <div className="items-center gap-1 flex flex-row ml-1 absolute top-11 left-0">
   <i className="text-[#ff0000] fa-solid text-xs mt-[2px] fa-circle-exclamation"></i> 
  <p className="text-[#ff0000]  text-xs">
 
  Academic Level cannot be empty
</p>
</div>
)}
</div>

<div className="rounded-lg relative">
 <input
     value={newStudent?.section}
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
 <label htmlFor="section" className={`${isSectionEmpty ? 'text-[#ff0000] peer-focus:text-[#ff0000]' : 'text-[#888] peer-focus:text-[#01579B] ' } tracking-wide absolute text-xs lg:text-sm duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-[0.625rem] peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}>
     Section
 </label>
 {isSectionEmpty && (
   <div className="items-center gap-1 flex flex-row ml-1 absolute top-11 left-0">
   <i className="text-[#ff0000] fa-solid text-xs mt-[2px] fa-circle-exclamation"></i> 
  <p className="text-[#ff0000]  text-xs">
 
  Section cannot be empty
</p>
</div>
)}
</div>

         
         
         </div>
         
         <div className={`grid grid-cols-2 gap-4 mt-6 ${isProgramEmpty || isStudentIdEmpty || studentIdError ? 'mb-[45px] smallerscreens:mb-[35px] lg:mb-[30px]' : ''}`}> 
         <div className="rounded-lg relative">
 <input
     value={newStudent?.program}
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
 <label htmlFor="program" className={`${isProgramEmpty ? 'text-[#ff0000] peer-focus:text-[#ff0000]' : 'text-[#888] peer-focus:text-[#01579B] ' } tracking-wide absolute text-xs lg:text-sm duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-[0.625rem] peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}>
     Program
 </label>
 {isProgramEmpty && (
   <div className="items-center gap-1 flex flex-row ml-1 absolute top-11 left-0">
   <i className="text-[#ff0000] fa-solid text-xs mt-[2px] fa-circle-exclamation"></i> 
  <p className="text-[#ff0000]  text-xs">
 
  Program cannot be empty
</p>
</div>
)}
</div>

<div className="rounded-lg relative">
 <input
     value={newStudent?.studentId}
     onChange={handleInputChange}  
     name="studentId"
     id="studentId"
     autoComplete="off"
     type="text"
     className={`text-sm lg:text-base block py-2 px-3 w-full text-black bg-transparent rounded-lg border-[1px] ${
      isStudentIdEmpty || studentIdError ? 'border-[#ff0000] focus:border-[#ff0000]' : 'focus:border-[#01579B]'
     } appearance-none focus:outline-none focus:ring-0 peer`}
     placeholder=" "
 />
 <label htmlFor="studentId" className={`${isStudentIdEmpty || studentIdError ? 'text-[#ff0000] peer-focus:text-[#ff0000]' : 'text-[#888] peer-focus:text-[#01579B] ' } tracking-wide absolute text-xs lg:text-sm duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-[0.625rem] peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}>
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
             <div className="flex justify-center items-center   gap-4 mt-6"> 
                
                

                 
             <div tabIndex={0} className={`${isGenderEmpty ? 'border-[#ff0000]' : 'focus:border-[#01579B]'} border-[1px] rounded-lg relative flex flex-row px-3 justify-start items-center`}>
 {/* <!-- Gender label --> */}
 <span className={`${isGenderEmpty ? 'text-[#ff0000]' : 'text-[#888] peer-focus:text-[#01579B]'} tracking-wide absolute text-sm duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#01579B] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}>Sex</span>
 
 {/* <!-- Gender options --> */}
 <div className="flex items-center flex-row justify-center p-4 flex-wrap space-x-4">
     {/* <!-- Male option --> */}
     <div className="flex items-center gap-1">
         <input onChange={handleInputChange} type="radio" className="form-radio text-[#01579B]" name="gender" id='male' value="Male" />
         <label htmlFor='male' className="text-sm lg:text-base text-[#2C384A] text-center">Male</label>
     </div>
     
     {/* <!-- Female option --> */}
     <div className="flex items-center gap-1">
         <input onChange={handleInputChange} type="radio" className="form-radio text-[#01579B]" name="gender" id='female' value="Female" />
         <label htmlFor='female' className="text-sm lg:text-base text-[#2C384A] text-center">Female</label>
     </div>
     
 </div>

</div>

                 
                 
               
                 </div>
                 {isGenderEmpty && (
   <div className="items-center justify-center gap-1 flex flex-row ml-1">
   <i className="text-[#ff0000] fa-solid text-xs mt-[2px] fa-circle-exclamation"></i> 
  <p className="text-[#ff0000]  text-xs">
 
  Sex cannot be empty
</p>
</div>
)}
                
                 {isAddBtnPressed ?

<button type='submit' className="flex flex-row px-5 cursor-pointer shadow  bg-transparent  border-[1px] border-[#D9D9D9]    hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 items-center mx-auto w-fit my-5 gap-1 py-2 rounded-lg" disabled={isAddBtnPressed}>
<span className='sr-only'>Loading...</span>

<div className='h-2 w-2 bg-[#D9D9D9] rounded-full animate-bounce [animation-delay:-0.3s]'></div>
<div className='h-2 w-2 bg-[#D9D9D9] rounded-full animate-bounce [animation-delay:-0.15s]'></div>
<div className='h-2 w-2 bg-[#D9D9D9] rounded-full animate-bounce'></div>
</button>
:
<button type='submit' className="flex flex-row px-5 cursor-pointer shadow  bg-transparent  border-[1px] border-[#D9D9D9]  hover:bg-[#D9D9D9]  hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 items-center mx-auto w-fit my-5 gap-1 py-3 rounded-lg" disabled={isAddBtnPressed}>
<i className="fa-solid fa-user-plus text-xs lg:text-sm text-center text-[#2C384A]"></i>
<span className=" font-semibold text-sm  ">Add Student</span>


</button>
}
           
{error && 
<div className=" flex flex-row items-center justify-center gap-1 text-[#ff0000]   ">
<i className="fa-solid fa-circle-exclamation text-[13px]"></i>
<p className="  text-[13px]">{error} </p>

</div>
}
                 </form>
             
               
    
         </div>
     </div>
     :

     <div id="alert-3" className="animate-fadeUp absolute bottom-0 flex items-center p-4 mb-4 text-[#28a745] rounded-lg bg-green-50  " role="alert">
     <i className="text-[#28a745] fa-solid fa-check "></i>
<span className="sr-only">Success</span>
<div className="ms-3 text-sm font-medium">
Student was successfully added as a student assistant
</div>
 </div>
 
     }   

   
        







    </div>

        
        </>
)
}

export default AddNewStudent;