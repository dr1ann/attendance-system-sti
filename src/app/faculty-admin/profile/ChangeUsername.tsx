import React, { FormEvent, useState } from 'react'
import Image from 'next/image';
import changeUsernameicon from '@/app/Images/changeusernameicon.png'

interface ModalProps {
    currentId?: string
    currentUsername?: string;
    isVisible: boolean;
    onClose: () => void;
    setRefetch: () => void;
  }

//type
interface ApiResponseType {
    message?: string | undefined
    status?: number | undefined
    error?:  string | undefined

  }

const ChangeUsername : React.FC<ModalProps> =  ({setRefetch, currentId, currentUsername, isVisible, onClose}) => {
    const [isSubmitPressed, setIsSubmitPressed] = useState(false);
    const [isSuccessful, setIsSuccessful] = useState(false);
  
    const [newUsername, setNewUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  

    const changeUsername = async () => {
        try {
            setIsSubmitPressed(true);
            if(newUsername?.trim() === '') {
                setErrorMessage('New username cannot be empty')
                return;
            } else {
                setErrorMessage('')
            }

            const response = await fetch('/api/change-username', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({currentId, currentUsername, newUsername }),
            });
            const result: ApiResponseType = await response.json();
           
            
            if (response.ok) {
              
                setNewUsername('');
                setIsSuccessful(true);
                setRefetch()
                setTimeout(() => {
                    setIsSuccessful(false);
                  onClose();
                }, 1500);
                setErrorMessage('')
            } else {
                setErrorMessage(result?.error);
            }
        } catch {
            setErrorMessage("Something went wrong. Please try again");
        } finally {
            setIsSubmitPressed(false);
            console.log(isSuccessful)
        }
    };
    
    const handleChangeUsername =  (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
          changeUsername();
    };
    
    
    if(!isVisible) {
        return null
    }
  return (
   
        <div data-modal-backdrop="change" aria-hidden="true" className="flex animate-fadeUp z-[99999] min-h-screen backdrop-blur-sm m-auto overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 justify-center items-center w-full md:inset-0 max-h-full">
            {!isSuccessful ? 
                <div className="relative p-4 w-full max-w-[40rem] m-auto">
                    {/* <!-- Modal content --> */}
                    <div className="relative bg-white rounded-lg shadow">
                        {/* <!-- Modal header --> */}
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t gap-2">
                            <Image src={changeUsernameicon} className="w-6 mt-1 h-auto object-contain" alt="" />
                            <h3 className="text-lg lg:text-xl font-bold text-gray-900">Change Username</h3>
                            <button onClick={(e) => { e.preventDefault(); onClose(); }} type="button" className="text-gray-400 bg-transparent hover:bg-gray-300 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="change-modal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>

                                <div className='flex justify-start flex-col gap-4 items-start px-8 py-4 w-[90%]'>
                                
                                <div className="flex flex-row gap-2 items-center">
                                <i className="fa-solid fa-note-sticky text-[#2C384A] text-sm lg:text-base"></i> 
                                <h1 className='font-semibold text-base lg:text-lg'>Important Guidelines for Changing Your Username:</h1>
                                </div>
                               
                                <ul className="list-disc list-inside text-sm lg:text-base ml-4">
      <li>Username must be between 6 and 20 characters.</li>
      <li>Username can only contain letters, numbers, and underscores.</li>
     
    
    </ul>
                </div>
         
                        {/* <!-- Modal body --> */}
                        <form className="p-5 md:px-5 gap-4" onSubmit={handleChangeUsername} >
                            <div className='space-y-7 w-3/4 mx-auto'>
                                <div className="rounded-lg relative bg-gray-100">
                                    <input
                                        readOnly
                                        value={currentUsername}
                                        name="currentUsername"
                                        id="currentUsername"
                                        autoComplete="off"
                                        type="text"
                                        className='text-sm lg:text-base block py-2 px-3 w-full text-black bg-transparent rounded-lg border-[1px] focus:border-[#01579B] appearance-none focus:outline-none focus:ring-0 peer'
                                        placeholder=" "
                                    />
                                    <label htmlFor="currentUsername" className='rounded-full bg-gray-100 text-[#888] peer-focus:text-[#01579B] tracking-wide absolute text-xs lg:text-sm duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-[0.625rem] peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1'>
                                        Current Username
                                    </label>
                                </div>
                                <div className="rounded-lg relative">
                               <input
                                value={newUsername}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    // Update the new username state
                                    setNewUsername(e.target.value);

                                    // Validate new username in real-time
                                    const username = e.target.value.trim();
                                    if (username === '') {
                                        setErrorMessage("New username cannot be empty");
                                    } else {
                                        setErrorMessage('');
                                    }
                                }}
                                name="newUsername"
                                id="newUsername"
                                autoComplete="off"
                                type="text"
                                className={`text-sm lg:text-base block py-2 px-3 w-full text-black bg-transparent rounded-lg border-[1px] ${
                                    errorMessage ? 'border-[#ff0000] focus:border-[#ff0000]' : 'focus:border-[#01579B]'
                                } appearance-none focus:outline-none focus:ring-0 peer`}
                                placeholder=" "
                            />

                                    <label htmlFor="newUsername" className={`${errorMessage ? 'text-[#ff0000] peer-focus:text-[#ff0000]' : 'text-[#888] peer-focus:text-[#01579B] '} tracking-wide absolute text-xs lg:text-sm duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-[0.625rem] peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}>
                                        New username
                                    </label>
                                    {errorMessage && (
                                        <div className="items-center gap-1 flex flex-row ml-1 absolute top-11 left-0">
                                            <i className="text-[#ff0000] fa-solid text-xs mt-[2px] fa-circle-exclamation"></i>
                                            <p className="text-[#ff0000] text-xs">
                                                {errorMessage}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {isSubmitPressed ?
                                <button type='submit' className="flex flex-row px-5 cursor-not-allowed shadow bg-transparent border-[1px] border-[#D9D9D9]  hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 items-center mx-auto w-fit my-5 gap-1 py-2 rounded-lg" disabled={isSubmitPressed}>
                                    <span className='sr-only'>Loading...</span>
                                    <div className='h-2 w-2 bg-[#D9D9D9] rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                                    <div className='h-2 w-2 bg-[#D9D9D9] rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                                    <div className='h-2 w-2 bg-[#D9D9D9] rounded-full animate-bounce'></div>
                                </button>
                                :
                                <button type='submit' className=" flex flex-row px-5 cursor-pointer shadow bg-transparent border-[1px] border-[#D9D9D9] hover:bg-[#D9D9D9] hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 items-center mx-auto w-fit mt-10 mb-0 gap-1 py-3 rounded-lg" disabled={isSubmitPressed}>
                                 <Image src={changeUsernameicon} className="w-4 mt-[2px] h-auto object-contain" alt="" />
                                    <span className="font-semibold text-sm">Change username</span>
                                </button>
                            }
                        </form>
                    </div>
                </div>
             : 
                <div id="alert-3" className="animate-fadeUp absolute bottom-0 flex items-center p-4 mb-4 text-[#28a745] rounded-lg bg-green-50" role="alert">
                    <i className="text-[#28a745] fa-solid fa-check"></i>
                    <span className="sr-only">Success</span>
                    <div className="ms-3 text-sm font-medium">
                        Username changed successfully
                    </div>
                </div>
            }
        </div>
    );

}

export default ChangeUsername