"use client";
//External Libraries
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import moment from "moment";

//Components
import Footer from "@/app/components/Footer";
import AccessDenied from "@/app/components/AccessDenied";
import PageLoader from "@/app/components/PageLoader";

import { ActivityLog, User } from "@prisma/client";

//Images
import maleProf from "@/app/Images/male-prof.png";
import femaleProf from "@/app/Images/female-prof.png";
import dashboard from "@/app/Images/dashboard.png";
import studentassistants from "@/app/Images/studentassistant.png";
import notifications from "@/app/Images/notification.png";
import profile from "@/app/Images/profile.png";

import noneplaceholder from "@/app/Images/noneplaceholder.png";

const Dashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<User | null>(null);
  const [todayActivities, setTodayActivities] = useState<ActivityLog[]>([]);
  const router = useRouter();

  useEffect(() => {
    const validateFaculty = async () => {
      try {
        const response = await fetch("/api/validate-faculty", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies in the request
        });

        // Check if the response is successful (status 200)
        if (response?.status === 200) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          console.error(`HTTP error! Status: ${response.status}`);
        }
      } catch (error) {
        setIsAdmin(false);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    validateFaculty();
  }, []);

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
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: User = await response.json();

        setUserData(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchActivityLog = async () => {
      try {
        const response = await fetch("/api/activity-log", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: ActivityLog[] = await response.json();

        const filteredActivities = data.filter((activity) => {
          const scheduleDate = moment(activity.scheduledDate).startOf("day");
          return scheduleDate.isSame(moment(), "day");
        });

        setTodayActivities(filteredActivities);
      } catch (error) {
        console.error("Error fetching students activity log:", error);
      }
    };

    fetchActivityLog();
  }, []);

  function formatCreatedAtDate(timestamp: Date): string {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true, // Use 12-hour clock
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  if (isLoading) {
    return <PageLoader />;
  }
  return (
    <>
      {isAdmin ? (
        <div className="max-w-[2050px] mx-auto text-white animate-fadeUp">
          <div className=" flex flex-col  min-h-screen">
            <header>
              <div className="flex flex-row justify-start gap-1 items-center shadow drop-shadow bg-[#01579B]">
                {userData?.gender ? (
                  userData.gender === "Male" ? (
                    <>
                      <Image src={maleProf} className="w-24 p-4" alt="" />
                    </>
                  ) : (
                    <>
                      <Image src={femaleProf} className="w-24 p-4" alt="" />
                    </>
                  )
                ) : (
                  <>
                    <Image src={profile} className="w-24 p-4" alt="" />
                  </>
                )}

                {userData ? (
                  <div className="flex flex-col items-start">
                    <Link
                      className=" text-base lg:text-lg font-bold"
                      href={"/faculty-admin/profile"}
                    >
                      {userData?.name || "N/A"}
                    </Link>
                    <span className="text-xs  text-gray-100">FAC - A</span>
                  </div>
                ) : (
                  <span className="text-base lg:text-lg">
                    No User Data Available
                  </span>
                )}
              </div>
            </header>
            <div className="m-2 md:mb-6 md:mx-6">
              <div className="bg-white p-2 rounded-lg   shadow drop-shadow  max-w-[1000px]  mt-[-16px]  mx-auto">
                <div className="flex flex-col  p-2 gap-4">
                  <div
                    className={`flex flex-row ${
                      todayActivities?.length > 0
                        ? "justify-center"
                        : "justify-start"
                    } items-center`}
                  >
                    <Image src={dashboard} className="w-14 lg:w-20 " alt="" />
                    <p className="text-xl lg:text-2xl text-black font-bold pr-2">
                      Dashboard
                    </p>
                  </div>
                  {todayActivities?.length > 0 ? (
                    <>
                      <div className="flex  justify-between">
                        <h2 className="text-xl lg:text-2xl p-2 font-bold text-black">
                          As of today
                        </h2>
                        <Link
                          href="/faculty-admin/student-assistants"
                          className="text-xs lg:text-sm font-bold text-[#01579B]"
                        >
                          View more{" "}
                          <i className="fa-solid fa-arrow-right text-xs"></i>
                        </Link>
                      </div>
                      <table className="w-full text-left rtl:text-right">
                        <thead>
                          <tr className="bg-[#2C384A]">
                            <th
                              scope="col"
                              id="activityHeader"
                              className=" text-base lg:text-lg px-6 py-3"
                            >
                              Activity
                            </th>
                            <th
                              scope="col"
                              id="dateTimeHeader"
                              className=" text-base lg:text-lg px-6 py-3"
                            >
                              Date & Time
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {todayActivities.map((activity) => (
                            <tr key={activity?.id}>
                              <th
                                scope="row"
                                className={`px-6 py-3 text-sm font-normal lg:text-base h-full shadow drop-shadow ${
                                  activity?.attendanceStatus === "PRESENT"
                                    ? "bg-[#28a745]" // Green background for present
                                    : activity?.attendanceStatus === "ABSENT"
                                    ? "bg-[#ff0000]" // Red background for absent
                                    : activity?.attendanceStatus === "LATE"
                                    ? "bg-[#fd7e14]"
                                    : "" // Orange background for late
                                }`}
                              >
                                {activity?.activity || "N/A"}
                              </th>
                              <td
                                className={`px-6 py-3 text-sm lg:text-base h-full shadow drop-shadow ${
                                  activity?.attendanceStatus === "PRESENT"
                                    ? "bg-[#28a745]" // Green background for present
                                    : activity?.attendanceStatus === "ABSENT"
                                    ? "bg-[#ff0000]" // Red background for absent
                                    : activity?.attendanceStatus === "LATE"
                                    ? "bg-[#fd7e14]"
                                    : "" // Orange background for late
                                }`}
                              >
                                {formatCreatedAtDate(activity?.createdAt) ||
                                  "N/A"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  ) : (
                    <div className="flex flex-col gap-3 items-center justify-center mb-4">
                      <Image
                        priority
                        src={noneplaceholder}
                        className="w-[12rem] lg:w-[20rem] h-auto"
                        alt="nothing here"
                      />
                      <p className="text-center text-black text-lg lg:text-xl font-semibold">
                        There are currently No Student Activities
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-black  flex flex-row overflow-x-auto gap-10   shadow drop-shadow smallscreens:w-fit bg-gray-100  mx-auto  mt-6 rounded-lg">
                <Link
                  href="/faculty-admin/student-assistants"
                  className="flex min-w-32 w-32 lg:w-40 justify-center flex-col m-4 lg:m-6 items-center cursor-pointer rounded-md shadow  bg-white  border-[1px] border-[#D9D9D9]  hover:bg-[#D9D9D9]  hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 pb-2"
                >
                  <Image
                    src={studentassistants}
                    className="w-20 lg:w-28 h-auto "
                    alt=""
                  />
                  <p className="text-sm lg:text-base  font-bold text-center px-4">
                    STUDENT ASSISTANTS
                  </p>
                </Link>

                <Link
                  href="/faculty-admin/profile"
                  className="flex min-w-32 w-32 lg:w-40 justify-center flex-col m-4 lg:m-6 items-center cursor-pointer rounded-md shadow  bg-white  border-[1px] border-[#D9D9D9]  hover:bg-[#D9D9D9]  hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 pb-2"
                >
                  <Image src={profile} className="w-20 lg:w-28 h-auto" alt="" />
                  <p className="text-sm lg:text-base  font-bold text-center px-4">
                    PROFILE
                  </p>
                </Link>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      ) : (
        <AccessDenied />
      )}
    </>
  );
};

export default Dashboard;
