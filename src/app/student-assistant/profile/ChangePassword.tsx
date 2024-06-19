import React, { FormEvent, useState } from 'react'
import Image from 'next/image';
import changePasswordicon from '@/app/Images/changepassicon.png'

interface ModalProps {
    currentId?: string | undefined;
 
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

const ChangePassword : React.FC<ModalProps> =  ({setRefetch, currentId, isVisible, onClose}) => {
    const [isSubmitPressed, setIsSubmitPressed] = useState(false);
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [currentPassErrorMessage, setCurrentPassErrorMessage] = useState<string | undefined>(undefined);
    const [newPassErrorMessage, setNewPassErrorMessage] = useState<string | undefined>(undefined);
    const [confNewPassErrorMessage, setConfNewPassErrorMessage] = useState<string | undefined>(undefined);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [currPasswordVisible, setcurrPasswordVisible] = useState(false);
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confNewPasswordVisible, setConfNewPasswordVisible] = useState(false);

    const toggleCurrentPasswordVisibility = (e : React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setcurrPasswordVisible(!currPasswordVisible);
      };

      const toggleNewPasswordVisibility = (e : React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setNewPasswordVisible(!newPasswordVisible);
      };

      const toggleConfirmNewPasswordVisibility = (e : React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setConfNewPasswordVisible(!confNewPasswordVisible);
      };

      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const trimmedValue = value.trim();
    
        switch (name) {
            case 'currentPassword':
                setCurrentPassword(value);
                validateCurrentPassword(trimmedValue);
                break;
            case 'newPassword':
                setNewPassword(value);
                validatePasswords(value, confirmNewPassword);
                validateCurrentPassword(currentPassword.trim());
                break;
            case 'confirmNewPassword':
                setConfirmNewPassword(value);
                validatePasswords(newPassword, value);
                validateCurrentPassword(currentPassword.trim());
                break;
            default:
                break;
        }
    };
    
    const validateCurrentPassword = (currentPassword: string) => {
        if (currentPassword === '') {
            setCurrentPassErrorMessage("Current password cannot be empty");
        } else {
            setCurrentPassErrorMessage('');
        }
    };
    
    const validatePasswords = (newPassword: string, confirmNewPassword: string) => {
        const trimmedNewPassword = newPassword.trim();
        const trimmedConfirmNewPassword = confirmNewPassword.trim();
    
        if (trimmedNewPassword === '') {
            setNewPassErrorMessage("New password cannot be empty");
        } else {
            setNewPassErrorMessage('');
        }
    
        if (trimmedConfirmNewPassword === '') {
            setConfNewPassErrorMessage("Confirm new password cannot be empty");
        } else {
            setConfNewPassErrorMessage('');
        }
    
        if (trimmedNewPassword !== '' && trimmedConfirmNewPassword !== '') {
            if (trimmedNewPassword !== trimmedConfirmNewPassword) {
                setNewPassErrorMessage("New password and confirmation password do not match.");
                setConfNewPassErrorMessage("New password and confirmation password do not match.");
            } else {
                setNewPassErrorMessage('');
                setConfNewPassErrorMessage('');
            }
        }
    };
    
    

    
    
    const changePassword = async () => {
        try {
            setIsSubmitPressed(true);
            let isValid = true;
    
            // Validate current password
            if (currentPassword?.trim() === '') {
                setCurrentPassErrorMessage("Current password cannot be empty");
                isValid = false;
            } else {
                setCurrentPassErrorMessage('');
            }
    
            // Validate new password
            if (newPassword?.trim() === '') {
                setNewPassErrorMessage("New password cannot be empty");
                isValid = false;
            }  else {
                setNewPassErrorMessage('');
            }
    
            // Validate confirm new password
            if (confirmNewPassword?.trim() === '') {
                setConfNewPassErrorMessage("Confirm new password cannot be empty");
                isValid = false;
            }  else {
                setConfNewPassErrorMessage('');
            }
            if (newPassword?.trim() !== '' && confirmNewPassword?.trim() !== '') {
                if (newPassword?.trim() !== confirmNewPassword?.trim()) {
                    setNewPassErrorMessage("New password and confirmation password do not match.");
                    setConfNewPassErrorMessage("New password and confirmation password do not match.");
                    isValid = false
                } else {
                    setNewPassErrorMessage('');
                    setConfNewPassErrorMessage('');
                }
            }
            // If any validation fails, stop the form submission
            if (!isValid) {
                return;
            }
    
            // Clear any previous error messages
            setErrorMessage('');
    
            const response = await fetch('/api/change-password', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currentId, currentPassword, newPassword }),
            });
    
            const result: ApiResponseType = await response.json();
    
            if (response.ok) {
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('')
                setIsSuccessful(true);
                setRefetch();
                setTimeout(() => {
                    setIsSuccessful(false);
                    onClose();
                }, 1500);
                setErrorMessage('');
                setCurrentPassErrorMessage('');
                setConfNewPassErrorMessage('');
                setNewPassErrorMessage('')
            } else {
                if (result?.error === 'Incorrect current password') {
                    setCurrentPassErrorMessage(result?.error);
                } else {
                    setNewPassErrorMessage(result?.error || 'An error occurred. Please try again')
                    setConfNewPassErrorMessage(result?.error || 'An error occurred. Please try again')
                    setErrorMessage(result?.error || 'An error occurred. Please try again');
                }
            }
        } catch {
            setNewPassErrorMessage("Something went wrong. Please try again")
            setConfNewPassErrorMessage("Something went wrong. Please try again")
            setErrorMessage("Something went wrong. Please try again");
        } finally {
            setIsSubmitPressed(false);
        }
    };
    
    const handleChangePassword =  (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        changePassword();
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
                            <Image src={changePasswordicon} className="w-6 h-auto object-contain" alt="" />
                            <h3 className="text-lg lg:text-xl font-bold text-gray-900">Change Password</h3>
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
                                <h1 className='font-semibold text-base lg:text-lg'>Important Guidelines for Changing Your Password:</h1>
                                </div>
                               
                                <ul className="list-disc list-inside text-sm lg:text-base ml-4">
                                <li>Password must be between 8 and 30 characters.</li>
                                <li>Password must contain at least one uppercase letter.</li>
                                <li>Password must contain at least one special character (e.g., !, @, #, $, etc.).</li>
    
    </ul>
                </div>
         
                        {/* <!-- Modal body --> */}
                        <form className="p-5 md:px-5 gap-4" onSubmit={handleChangePassword} >
                            <div className='space-y-7 w-3/4 mx-auto'>
                            <div className="rounded-lg relative">
                                <input
                                value={currentPassword}
                                onChange={handleInputChange}
                                name="currentPassword"
                                id="currentPassword"
                                autoComplete="off"
                                type={currPasswordVisible ? 'text' : 'password'}
                                className={`text-sm lg:text-base block py-2 px-3 w-full text-black bg-transparent rounded-lg border-[1px] ${
                                    currentPassErrorMessage ? 'border-[#ff0000] focus:border-[#ff0000]' : 'focus:border-[#01579B]'
                                } appearance-none focus:outline-none focus:ring-0 peer`}
                                placeholder=" "
                            />

                                    <label htmlFor="currentPassword" className={`${currentPassErrorMessage ? 'text-[#ff0000] peer-focus:text-[#ff0000]' : 'text-[#888] peer-focus:text-[#01579B] '} tracking-wide absolute text-xs lg:text-sm duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-[0.625rem] peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}>
                                        Current Password
                                    </label>
                                    <i onClick={toggleCurrentPasswordVisibility} className={`text-sm toggle-password fa-solid ${currPasswordVisible ? 'fa-eye' : 'fa-eye-slash'} absolute top-1/2 right-0 transform -translate-y-1/2 px-2 focus:outline-none cursor-pointer`}></i>
                                    {currentPassErrorMessage && (
                                        <div className="items-center gap-1 flex flex-row ml-1 absolute top-11 left-0 ">
                                            <i className="text-[#ff0000] fa-solid text-xs mt-[2px] fa-circle-exclamation"></i>
                                            <p className="text-[#ff0000] text-xs">
                                                {currentPassErrorMessage}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="rounded-lg relative">
                            <input
                            value={newPassword}
                            onChange={handleInputChange}
                            name="newPassword"
                            id="newPassword"
                            autoComplete="off"
                            type={newPasswordVisible ? 'text' : 'password'}
                            className={`text-sm lg:text-base block py-2 px-3 w-full text-black bg-transparent rounded-lg border-[1px] ${
                                newPassErrorMessage ? 'border-[#ff0000] focus:border-[#ff0000]' : 'focus:border-[#01579B]'
                            } appearance-none focus:outline-none focus:ring-0 peer`}
                            placeholder=" "
                        />

                                    <label htmlFor="newPassword" className={`${newPassErrorMessage ? 'text-[#ff0000] peer-focus:text-[#ff0000]' : 'text-[#888] peer-focus:text-[#01579B] '} tracking-wide absolute text-xs lg:text-sm duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-[0.625rem] peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}>
                                        New Password
                                    </label>
                                    <i onClick={toggleNewPasswordVisibility} className={`text-sm toggle-password fa-solid ${newPasswordVisible ? 'fa-eye' : 'fa-eye-slash'} absolute top-1/2 right-0 transform -translate-y-1/2 px-2 focus:outline-none cursor-pointer`}></i>
                                    {newPassErrorMessage && (
                                        <div className="items-center gap-1 flex flex-row ml-1 absolute top-11 left-0 ">
                                            <i className="text-[#ff0000] fa-solid text-xs mt-[2px] fa-circle-exclamation"></i>
                                            <p className="text-[#ff0000] text-xs">
                                                {newPassErrorMessage}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="rounded-lg relative">
                                    <input
                                    value={confirmNewPassword}
                                    onChange={handleInputChange}
                                    name="confirmNewPassword"
                                    id="confirmNewPassword"
                                    autoComplete="off"
                                    type={confNewPasswordVisible ? 'text' : 'password'}
                                    className={`text-sm lg:text-base block py-2 px-3 w-full text-black bg-transparent rounded-lg border-[1px] ${
                                        confNewPassErrorMessage ? 'border-[#ff0000] focus:border-[#ff0000]' : 'focus:border-[#01579B]'
                                    } appearance-none focus:outline-none focus:ring-0 peer`}
                                    placeholder=" "
                                />

                                    <label htmlFor="confirmNewPassword" className={`${confNewPassErrorMessage ? 'text-[#ff0000] peer-focus:text-[#ff0000]' : 'text-[#888] peer-focus:text-[#01579B] '} tracking-wide absolute text-xs lg:text-sm duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-[0.625rem] peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}>
                                        Confirm New Password
                                    </label>
                                    <i onClick={toggleConfirmNewPasswordVisibility} className={`text-sm toggle-password fa-solid ${confNewPasswordVisible ? 'fa-eye' : 'fa-eye-slash'} absolute top-1/2 right-0 transform -translate-y-1/2 px-2 focus:outline-none cursor-pointer`}></i>
                                    {confNewPassErrorMessage && (
                                        <div className="items-center gap-1 flex flex-row ml-1 absolute top-11 left-0 ">
                                            <i className="text-[#ff0000] fa-solid text-xs mt-[2px] fa-circle-exclamation"></i>
                                            <p className="text-[#ff0000] text-xs">
                                                {confNewPassErrorMessage}
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
                                   <Image src={changePasswordicon} className="w-4 h-auto object-contain" alt="" />
                                    <span className="font-semibold text-sm">Change password</span>
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
                        Password changed successfully
                    </div>
                </div>
            }
        </div>
    );

}

export default ChangePassword