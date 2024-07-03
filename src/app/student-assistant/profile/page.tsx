"use client";
//External Libraries
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
} from "@/app/components/shadcn/alert-dialog";

//Components
import Footer from "@/app/components/MainFooter";
import Header from "@/app/components/Header";
import Sidebar from "@/app/components/Sidebar";
import AccessDenied from "@/app/components/AccessDenied";
import PageLoader from "@/app/components/PageLoader";
import { User } from "@prisma/client";
import SidePageLoader from "@/app/components/SidePageLoader";

//Images
import profile from "@/app/Images/profile.png";
import maleProf from "@/app/Images/male-prof.png";
import femaleProf from "@/app/Images/female-prof.png";
import changepass from "@/app/Images/changepassicon.png";
import changeusername from "@/app/Images/changeusernameicon.png";
import ChangeUsername from "./ChangeUsername";
import ChangePassword from "./ChangePassword";

const Profile = () => {
  const router = useRouter();
  const [isLogoutPressed, setIsLogoutPressed] = useState(false);
  const [isChangeUsernameOpen, setIsChangeUsernameOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [isStudent, setIsStudent] = useState(false);
  const [isFetchSuccessful, setIsFetchSuccessful] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [refetch, setRefetch] = useState<boolean>(false);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/current-user-profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies in the request
        });

        if (!response.ok) {
          setIsFetchSuccessful(false);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: User = await response.json();
        setUserData(data);
        setIsFetchSuccessful(true);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setIsFetchSuccessful(false);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (refetch) {
      const fetchUserProfile = async () => {
        try {
          const response = await fetch("/api/current-user-profile", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // Include cookies in the request
          });

          if (!response.ok) {
            setIsFetchSuccessful(false);
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data: User = await response.json();
          setUserData(data);
          setRefetch(false);
          setIsFetchSuccessful(true);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setIsFetchSuccessful(false);
        }
      };

      fetchUserProfile();
    }
  }, [refetch]);

  useEffect(() => {
    const validateStudent = async () => {
      try {
        const response = await fetch("/api/validate-student", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies in the request
        });

        if (response.status === 200) {
          setIsStudent(true);
        } else {
          setIsStudent(false);
        }
      } catch (error) {
        setIsStudent(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateStudent();
  }, []);

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLogoutPressed(true);
    setLogoutError(null); // Reset any previous errors

    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        // Redirect to login page after successful logout
        router.push("/");
      } else {
        setLogoutError(`An error occurred during logout, please try again.`);
      }
    } catch (error) {
      setLogoutError("An error occurred during logout, please try again.");
    } finally {
      setIsLogoutPressed(false); // Reset loading state when logout attempt is completed
    }
  };
  function formatDate(timestamp: Date): string {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  const userDataCreatedAt: Date | undefined = userData?.createdAt;
  const joinedOn: string | undefined = userDataCreatedAt
    ? formatDate(userDataCreatedAt)
    : "N/A";

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      {isStudent ? (
        <div className="max-w-[2050px] mx-auto">
          <Header headingImg={profile} headingName="PROFILE" />
          <Sidebar />
          <div id="container" className="p-4 lg:ml-64 min-h-screen">
            {isFetchSuccessful ? (
              <div className="px-0 py-4 overflow-y-auto mt-[3em] sm:mt-[4em] rounded-lg ">
                <div
                  style={{
                    border: "1px solid #D9D9D9",
                    borderRadius: "0.5rem",
                  }}
                  className="animate-fadeUp mt-16 rounded-lg flex flex-col lg:flex-row items-center lg:items-start flex-wrap lg:flex-nowrap justify-center relative gap-1 lg:gap-10 shadow drop-shadow p-4 lg:p-10 w-fit mx-auto"
                >
                  <div className="flex flex-col items-center">
                    {userData?.gender ? (
                      userData.gender === "Male" ? (
                        <>
                          <Image
                            src={maleProf}
                            priority
                            className="mt-[-90px] h-32 w-32 lg:h-40 lg:w-40"
                            alt="Male Profile"
                          />
                          <div className="flex flex-row items-center justify-center gap-1">
                            <i className="fa-solid fa-mars text-blue-400 text-sm lg:text-base"></i>
                            <h3 className="text-sm lg:text-base">MALE</h3>
                          </div>
                        </>
                      ) : (
                        <>
                          <Image
                            src={femaleProf}
                            priority
                            className="mt-[-90px] h-32 w-32 lg:h-40 lg:w-40"
                            alt="Female Profile"
                          />
                          <div className="flex flex-row items-center justify-center gap-1">
                            <i className="fa-solid fa-venus text-pink-400 text-sm lg:text-base"></i>
                            <h3 className="text-sm lg:text-base">FEMALE</h3>
                          </div>
                        </>
                      )
                    ) : (
                      <>
                        <Image
                          src={profile}
                          className="mt-[-90px] h-32 w-32 lg:h-40 lg:w-40"
                          alt="No Profile"
                        />
                        <div className="flex flex-row items-center justify-center gap-1">
                          <h3 className="text-sm lg:text-base">N/A </h3>
                        </div>
                      </>
                    )}

                    <div className="hidden lg:flex flex-col mt-10 gap-10">
                      <label
                        style={{
                          border: "1px solid #D9D9D9",
                          borderRadius: "0.5rem",
                        }}
                        htmlFor=""
                        className=" relative  flex flex-col"
                      >
                        <span className="absolute top-[-9px] h-fit mx-2 px-1 rounded-lg  bg-white z-20 text-xs text-[#333333]">
                          Student ID:
                        </span>
                        <input
                          className=" py-2 px-3 shadow drop-shadow rounded-lg font-semibold"
                          type="text"
                          value={userData?.studentId || "N/A"}
                          readOnly
                        />
                      </label>

                      <label
                        style={{
                          border: "1px solid #D9D9D9",
                          borderRadius: "0.5rem",
                        }}
                        htmlFor=""
                        className="relative  flex flex-col"
                      >
                        <span className="absolute top-[-9px] h-fit mx-2 px-1 rounded-lg  bg-white z-20 text-xs text-[#333333]">
                          Joined on:
                        </span>
                        <input
                          className="py-2 px-3 shadow drop-shadow rounded-lg font-semibold"
                          type="text"
                          value={joinedOn}
                          readOnly
                        />
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 ">
                    <div className="flex justify-center lg:justify-between flex-col lg:flex-row flex-wrap gap-2 lg:gap-10 items-center mt-2 lg:mt-0">
                      <div className="flex flex-col items-center justify-center  lg:items-start">
                        <h1 className="text-lg lg:text-xl font-bold text-center">
                          {userData?.name || "N/A"}
                        </h1>
                        <span className="text-xs text-[#333333] text-center">
                          {userData?.role === "STUDENT"
                            ? "STUDENT ASSISTANT"
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex-row lg:flex-col flex gap-6 lg:gap-2 flex-wrap">
                        <button
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.preventDefault();
                            setIsChangeUsernameOpen(true);
                          }}
                          className="flex flex-row px-2 cursor-pointer items-center  mx-auto w-fit mt-2 gap-1 py-1  rounded-lg shadow  bg-transparent  border-[1px] border-[#D9D9D9]  hover:bg-[#D9D9D9]  hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0"
                        >
                          <Image
                            src={changeusername}
                            className="w-4 h-auto object-contain"
                            alt=""
                          />
                          <span className=" font-semibold text-sm ">
                            Change Username
                          </span>
                        </button>
                        <button
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.preventDefault();
                            setIsChangePasswordOpen(true);
                          }}
                          className="flex flex-row px-2 cursor-pointer items-center  mx-auto w-fit mt-2 gap-1 py-1  rounded-lg shadow  bg-transparent  border-[1px] border-[#D9D9D9]  hover:bg-[#D9D9D9]  hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0"
                        >
                          <Image
                            src={changepass}
                            className="w-4 h-auto object-contain"
                            alt=""
                          />
                          <span className=" font-semibold text-sm ">
                            Change Password
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4 lg:mt-8">
                      <label
                        style={{
                          border: "1px solid #D9D9D9",
                          borderRadius: "0.5rem",
                        }}
                        htmlFor=""
                        className="relative flex flex-col"
                      >
                        <span className="absolute top-[-9px] h-fit mx-2 px-1 rounded-lg  bg-white z-20 text-xs text-[#333333]">
                          Full name:
                        </span>
                        <input
                          className=" text-sm lg:text-base py-2 px-3 z-10 shadow drop-shadow rounded-lg font-semibold "
                          type="text"
                          value={userData?.name || "N/A"}
                          readOnly
                        />
                      </label>

                      <label
                        style={{
                          border: "1px solid #D9D9D9",
                          borderRadius: "0.5rem",
                        }}
                        htmlFor=""
                        className="relative flex flex-col"
                      >
                        <span className="absolute top-[-9px] h-fit mx-2 px-1 rounded-lg  bg-white z-20 text-xs text-[#333333]">
                          Username:
                        </span>
                        <input
                          className=" text-sm lg:text-base py-2 px-3 z-10 shadow drop-shadow rounded-lg font-semibold "
                          type="text"
                          value={userData?.username || "N/A"}
                          readOnly
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-10">
                      <label
                        style={{
                          border: "1px solid #D9D9D9",
                          borderRadius: "0.5rem",
                        }}
                        htmlFor=""
                        className="relative flex flex-col"
                      >
                        <span className="absolute top-[-9px] h-fit mx-2 px-1 rounded-lg  bg-white z-20 text-xs text-[#333333]">
                          Academic level:
                        </span>
                        <input
                          className="text-sm lg:text-base py-2 px-3 shadow drop-shadow rounded-lg font-semibold"
                          type="text"
                          value={userData?.academicLevel || "N/A"}
                          readOnly
                        />
                      </label>

                      <label
                        style={{
                          border: "1px solid #D9D9D9",
                          borderRadius: "0.5rem",
                        }}
                        htmlFor=""
                        className="relative flex flex-col"
                      >
                        <span className="absolute top-[-9px] h-fit mx-2 px-1 rounded-lg  bg-white z-20 text-xs text-[#333333]">
                          Section:
                        </span>
                        <input
                          className="text-sm lg:text-base py-2 px-3 shadow drop-shadow rounded-lg font-semibold"
                          type="text"
                          value={userData?.section || "N/A"}
                          readOnly
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-10">
                      <label
                        style={{
                          border: "1px solid #D9D9D9",
                          borderRadius: "0.5rem",
                        }}
                        htmlFor=""
                        className="relative flex flex-col"
                      >
                        <span className="absolute top-[-9px] h-fit mx-2 px-1 rounded-lg  bg-white z-20 text-xs text-[#333333]">
                          Program :
                        </span>
                        <input
                          className="text-sm lg:text-base py-2 px-3 shadow drop-shadow rounded-lg font-semibold"
                          type="text"
                          value={userData?.program || "N/A"}
                          readOnly
                        />
                      </label>
                      <label
                        style={{
                          border: "1px solid #D9D9D9",
                          borderRadius: "0.5rem",
                        }}
                        htmlFor=""
                        className="relative flex flex-col"
                      >
                        <span className="absolute top-[-9px] h-fit mx-2 px-1 rounded-lg  bg-white z-20 text-xs text-[#333333]">
                          Year level :
                        </span>
                        <input
                          className="text-sm lg:text-base py-2 px-3 shadow drop-shadow rounded-lg font-semibold"
                          type="text"
                          value={userData?.yearLevel || "N/A"}
                          readOnly
                        />
                      </label>
                    </div>

                    <div className="lg:hidden grid grid-cols-2 gap-4 mt-10">
                      <label
                        style={{
                          border: "1px solid #D9D9D9",
                          borderRadius: "0.5rem",
                        }}
                        htmlFor=""
                        className="relative flex flex-col"
                      >
                        <span className="absolute top-[-9px] h-fit mx-2 px-1 rounded-lg  bg-white z-20 text-xs text-[#333333]">
                          Student ID:
                        </span>
                        <input
                          className="text-sm py-2 px-3 shadow drop-shadow rounded-lg font-semibold"
                          type="text"
                          value={userData?.studentId || "N/A"}
                          readOnly
                        />
                      </label>

                      <label
                        style={{
                          border: "1px solid #D9D9D9",
                          borderRadius: "0.5rem",
                        }}
                        htmlFor=""
                        className="relative flex flex-col"
                      >
                        <span className="absolute top-[-9px] h-fit mx-2 px-1 rounded-lg  bg-white z-20 text-xs text-[#333333]">
                          Joined on:
                        </span>
                        <input
                          className="text-sm py-2 px-3 shadow drop-shadow rounded-lg font-semibold"
                          type="text"
                          value={joinedOn}
                          readOnly
                        />
                      </label>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger className=" shadow  bg-transparent  border-[1px] border-[#ff0000] border-dashed hover:bg-[#ff0000] hover:text-white  hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 w-fit mx-auto flex flex-row px-2 items-center mt-5 me-3 gap-1 py-1 rounded-lg">
                        <i className="fa-solid fa-right-from-bracket text-xs text-center "></i>
                        <span className=" font-semibold text-sm  text-center">
                          Logout
                        </span>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to logout?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            You will be logged out of your account and will need
                            to log in again.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          {logoutError && (
                            <p className="px-1 pt-2 text-[#ff0000] text-[13px]">
                              <i className="fa-solid fa-circle-exclamation"></i>{" "}
                              {logoutError}
                            </p>
                          )}
                          <AlertDialogCancel>No</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-[#2C384A]"
                            onClick={handleLogout}
                            disabled={isLogoutPressed}
                          >
                            {isLogoutPressed ? (
                              <>
                                <span className="sr-only">Loading...</span>

                                <div className="h-1 w-1 bg-[#D9D9D9] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="h-1 w-1 bg-[#D9D9D9] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="h-1 w-1 bg-[#D9D9D9] rounded-full animate-bounce"></div>
                              </>
                            ) : (
                              <span>Yes</span>
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ) : (
              <SidePageLoader />
            )}

            <ChangeUsername
              setRefetch={() => setRefetch(true)}
              isVisible={isChangeUsernameOpen}
              currentId={userData?.id}
              currentUsername={userData?.username}
              onClose={() => setIsChangeUsernameOpen(false)}
            />

            <ChangePassword
              setRefetch={() => setRefetch(true)}
              isVisible={isChangePasswordOpen}
              currentId={userData?.id}
              onClose={() => setIsChangePasswordOpen(false)}
            />
          </div>
          <Footer />
        </div>
      ) : (
        <AccessDenied />
      )}
    </>
  );
};

export default Profile;
