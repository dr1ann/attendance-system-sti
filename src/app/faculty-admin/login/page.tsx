'use client'

//Client Components
import Footer from "@/app/components/Footer";

//External Libraries
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation'; // Correct import for `useRouter`
import { useEffect, useState } from "react";
import PageLoader from "@/app/components/PageLoader";

//Images
import logo from '@/app/Images/logo.png';
import facultyadmin from '@/app/Images/admin.png';


//type
interface ApiResponseType {
  message?: string | undefined
  status?: number | undefined
 
}

const Page = () => {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [isUsernameEmpty, setIsUsernameEmpty] = useState(false);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);
  const [isInvalidCreds, setIsInvalidCreds] = useState(false);
  const [isLoginPressed, setIsLoginPressed] = useState(false);
  const [isAlreadyLoggedIn, setIsAlreadyLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/validate-user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies in the request
        });
        

        const data : ApiResponseType = await response.json();
          
          if(data?.message === 'USER IS STUDENT') {
            setIsAlreadyLoggedIn(true)
            router.push('/student-assistant/dashboard')
          } else if(data?.message === 'USER IS FACULTY') {
            setIsAlreadyLoggedIn(true)
            router.push('/faculty-admin/dashboard')
          } else {
          setIsAlreadyLoggedIn(false)
          
    
        }
      } catch (error) {
        setIsAlreadyLoggedIn(false)
        console.error("Error:" + error);
      } finally {
        setIsLoading(false)
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update the state based on the input field's name
    switch (name) {
        case 'username':
            setUsername(value);
            setIsUsernameEmpty(value.trim() === ''); // Check if the value is empty
            setIsInvalidCreds(false)
            break;
        case 'password':
            setPassword(value);
            setIsPasswordEmpty(value.trim() === ''); // Check if the value is empty
            setIsInvalidCreds(false)
            break;
        // Add more cases for other input fields if needed
        default:
            break;
    }
};



const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
      setIsLoginPressed(true);

      // Check if either username or password is empty
      if (username.trim() === '' || password.trim() === '') {
          setIsUsernameEmpty(true);
          setIsPasswordEmpty(true);
          return;
      }
    
      const loginResponse = await fetch('/api/login-faculty', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
      });
      const userRoleResponse = await fetch('/api/validate-user', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies in the request
      });
      const loginData: ApiResponseType = await loginResponse.json();
      const userData: ApiResponseType = await userRoleResponse.json();
      if (loginResponse?.status === 200 &&  userData?.message === 'USER IS FACULTY') {
          setIsInvalidCreds(false);
          setIsUsernameEmpty(false);
          setIsPasswordEmpty(false);
          setError('');
          router.push('/faculty-admin/dashboard');
      } else {
          setIsInvalidCreds(true);
          setError(loginData?.message);
      }
  } catch (error) {
      setError('Something went wrong. Please try again');
      console.error(error);
  } finally {
      setIsLoginPressed(false); // Reset loading state when login attempt is completed
  }
};

  
  if (isLoading) {
    return (
      <PageLoader/>
    );
  }
  


  return (
    <>
    {!isAlreadyLoggedIn &&
        <div className="bg-gray-100 max-w-[2050px] mx-auto animate-fadeUp">
        <main className="flex min-h-screen">
          <div className="  p-6 pt-2 flex flex-col w-full   gap-2 lg:gap-6 lg:flex-row rounded-lg px-4 justify-center items-center m-2 ">
        <Link href="/" className="flex items-center relative flex-col mb-2 lg:mb-10 flex-grow justify-center">
          <Image src={logo} priority className="w-[60%] md:w-auto max-w-[520px] max-h-[480px]  h-auto" alt="logo" />
          <h2 style={{ textShadow: '2px 4px 3px rgba(44, 56, 74, 0.3)' }} className="px-4 lg:px-0 font-black text-xl  text-center text-black">ASSISTANT-DRIVEN ATTENDANCE SYSTEM</h2>
        </Link>
        <div className="flex flex-col justify-center items-center bigscreens:items-start flex-grow w-full lg:w-auto">
          <div className="flex justify-center items-center w-full max-w-[400px] mx-auto lg:mx-4 2xl:mr-auto bigscreens:mx-0 bg-[#fff000] pt-2 flex-col shadow rounded-md drop-shadow">
            <div className="flex flex-col gap-2 justify-center items-center">
              <Image src={facultyadmin} className="w-24 smallerscreens:w-32 rounded-md mx-2 lg:mx-0 h-auto " alt="" />
              <h1 className="text-center pt-2 px-2  text-sm sm:text-lg font-bold">LOGIN AS FACULTY ADMIN</h1>
            </div>
            <form className={`w-full px-6 lg:px-10 pt-6 pb-4 `} onSubmit={handleLogin}>
              
            <div className={` rounded-lg relative bg-white  ${isUsernameEmpty  ? 'border-[#ff0000] mb-7' : 'mb-4'}`}>
    <input
        value={username}
        onChange={handleInputChange}
        name="username"
        autoComplete="off"
        type="text"
        id="username"
        className={`text-sm block py-3 px-3 w-full text-black bg-transparent rounded-lg border-[1px] appearance-none focus:outline-none focus:ring-0 peer ${
             isUsernameEmpty  ? 'border-[#ff0000]' : 'focus:border-[#01579B]'
        }`}
        placeholder=" "
    />
      <label htmlFor="username" className={`tracking-wider absolute text-xs lg:text-sm text-[#888] duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 rounded-lg ${isUsernameEmpty ? 'text-[#ff0000]' : 'peer-focus:text-[#01579B]'}`}>Username</label>
    {isUsernameEmpty && (
        <div className="items-center gap-1 flex flex-row ml-1 absolute top-12 left-0">
            <i className="text-[#ff0000] fa-solid text-xs mt-[2px] fa-circle-exclamation"></i>
            <p className="text-[#ff0000] text-xs">
                Username cannot be empty
            </p>
        </div>
    )}
</div>

<div className={` rounded-lg relative bg-white  ${isPasswordEmpty  ? 'border-[#ff0000] mb-9' : 'mb-4'}`}>
    <input
        value={password}
        onChange={handleInputChange}
        name="password"
        autoComplete="off"
        type={passwordVisible ? 'text' : 'password'}
        id="password"
        className={`text-sm block py-3 px-3 w-full text-black bg-transparent rounded-lg border-[1px] appearance-none focus:outline-none focus:ring-0 peer ${
           isPasswordEmpty ? 'border-[#ff0000]' : 'focus:border-[#01579B]'
        }`}
        placeholder=" "
    />
        <label htmlFor="password" className={`tracking-wider absolute text-xs lg:text-sm text-[#888] duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 rounded-lg ${isPasswordEmpty  ? 'text-[#ff0000]' : 'peer-focus:text-[#01579B]'}`}>Password</label>
      <i onClick={togglePasswordVisibility} className={`text-sm toggle-password fa-solid ${passwordVisible ? 'fa-eye' : 'fa-eye-slash'} absolute top-1/2 right-0 transform -translate-y-1/2 px-2 focus:outline-none cursor-pointer`}></i>
    {isPasswordEmpty && (
        <div className="items-center gap-1 flex flex-row ml-1 absolute top-12 left-0">
            <i className="text-[#ff0000] fa-solid text-xs mt-[2px] fa-circle-exclamation"></i>
            <p className="text-[#ff0000] text-xs">
                Password cannot be empty
            </p>
        </div>
    )}
</div>



  {isLoginPressed ?

<button type="submit" className="text-white  outline-none border-0 flex flex-wrap justify-center flex-row items-center gap-1 w-full py-3  h-auto shadow bg-[#01579B]  hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 rounded-md mt-5" disabled={isLoginPressed}>
<span className='sr-only'>Loading...</span>

  <div className='h-2 w-2 bg-[#D9D9D9] rounded-full animate-bounce [animation-delay:-0.3s]'></div>
<div className='h-2 w-2 bg-[#D9D9D9] rounded-full animate-bounce [animation-delay:-0.15s]'></div>
<div className='h-2 w-2 bg-[#D9D9D9] rounded-full animate-bounce'></div>
</button>
:
<button type="submit" className="text-white outline-none border-0 block w-full py-3 text-sm font-bold h-auto shadow bg-[#01579B]  hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 rounded-md mt-5" disabled={isLoginPressed}>
   LOGIN
</button>
}
{isInvalidCreds && (
    <div className="items-center gap-1 flex flex-row justify-center my-2">
        <i className="text-[#ff0000] fa-solid text-xs mt-[2px] fa-circle-exclamation"></i>
        <p className="text-[#ff0000] text-xs lg:text-sm">
            Invalid credentials. Please try again.
        </p>
    </div>
)}
</form>

<span  className="text-black font-semibold mb-4 mx-auto text-sm">Student Assistant? <Link className="font-bold text-[#01579B] underline" href='/'>Click here</Link></span>
          </div>
        </div>
      </div>
    </main>
<Footer />
    </div>
    }
    </>
    )
        

   
}

export default Page