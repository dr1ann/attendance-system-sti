"use client";
//External Libraries
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BeatLoader } from "react-spinners";
import moment from "moment";

//Components
import Footer from "@/app/components/Footer";
import PageLoader from "@/app/components/PageLoader";
import AccessDenied from "@/app/components/AccessDenied";
import { Schedule, User } from "@prisma/client";

//Images
import maleProf from "@/app/Images/male-prof.png";
import femaleProf from "@/app/Images/female-prof.png";
import dashboard from "@/app/Images/dashboard.png";
import attendance from "@/app/Images/attendance.png";
import notifications from "@/app/Images/notification.png";
import profile from "@/app/Images/profile.png";
import noneplaceholder from "@/app/Images/noneplaceholder.png";

const MAX_SCHEDULES = 6; // Maximum number of schedules to fetch

const Dashboard = () => {
  const [isStudentAssistant, setIsStudentAssistant] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchSuccessful, setIsFetchSuccessful] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [upcomingSchedules, setUpcomingSchedules] = useState<Schedule[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/validate-student", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies in the request
        });

        // Check if the response is successful (status 200)
        if (response?.status === 200) {
          setIsStudentAssistant(true);
        } else {
          setIsStudentAssistant(false);
          console.error(`HTTP error! Status: ${response.status}`);
        }
      } catch (error) {
        setIsStudentAssistant(false);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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
    const fetchUserSchedule = async () => {
      try {
        const response = await fetch("/api/schedule-info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies in the request
          body: JSON.stringify({ studentId: userData?.id }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: Schedule[] = await response.json();

        // Filter and limit the number of schedules
        const upcoming = data
          .filter((schedule) => new Date(schedule.scheduledDate) > new Date())
          .slice(0, MAX_SCHEDULES);
        console.log(data);

        setUpcomingSchedules(upcoming);
        setIsFetchSuccessful(true);
      } catch (error) {
        console.error("Error fetching user schedules:", error);
        setIsFetchSuccessful(false);
      }
    };

    fetchUserSchedule();
  }, [userData?.id]);

  const formatTime = (timeString: string) => {
    return moment(timeString, "HH:mm").format("hh:mm A");
  };
  const formatDate = (dateString: string | Date | null) => {
    return moment(dateString).format("MM/DD/YYYY");
  };

  if (isLoading) {
    return <PageLoader />;
  }
  return (
    <>
      {isStudentAssistant ? (
        <div className="max-w-[2050px] mx-auto text-white animate-fadeUp">
          <div className="flex flex-col min-h-screen">
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
                      href={"/student-assistant/profile"}
                    >
                      {userData?.name || "N/A"}
                    </Link>
                    <span className="text-xs  text-gray-100">STUD - A</span>
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
                <div className="flex flex-col p-2 gap-4">
                  <div
                    className={`flex flex-row ${
                      upcomingSchedules?.length > 0
                        ? "justify-center"
                        : "justify-start"
                    } items-center`}
                  >
                    <Image src={dashboard} className="w-14 lg:w-20" alt="" />
                    <p className="text-xl lg:text-2xl text-black font-bold pr-5">
                      Dashboard
                    </p>
                  </div>

                  {upcomingSchedules?.length > 0 ? (
                    <>
                      <div className="flex justify-between">
                        <h2 className="text-xl lg:text-2xl p-2 font-bold text-black">
                          Upcoming Schedules
                        </h2>
                        <Link
                          href="/student-assistant/attendance"
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
                              className="text-center text-base lg:text-lg px-6 py-3"
                            >
                              TEACHER
                            </th>
                            <th
                              scope="col"
                              id="roomNumHeader"
                              className="text-center text-base lg:text-lg px-6 py-3"
                            >
                              ROOM NO.
                            </th>
                            <th
                              scope="col"
                              id="dateTimeHeader"
                              className="text-center text-base lg:text-lg px-6 py-3"
                            >
                              Date & Time
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {upcomingSchedules?.map((schedule: Schedule) => (
                            <tr key={schedule?.id}>
                              <th
                                scope="row"
                                className="px-6 py-3 text-center text-sm font-semibold text-black lg:text-base bg-gray-100 h-full shadow drop-shadow"
                              >
                                {schedule?.teacherName || "N/A"}
                              </th>
                              <td className="px-6 py-3 text-center text-sm lg:text-base bg-gray-100 text-black h-full shadow drop-shadow">
                                {schedule?.roomNum || "N/A"}
                              </td>
                              <td className="px-6 py-3 text-center text-sm lg:text-base bg-gray-100 text-black h-full shadow drop-shadow">
                                {formatDate(schedule?.scheduledDate) || "N/A"}
                                <br />(
                                {formatTime(schedule?.scheduledInTime) ||
                                  "N/A"}{" "}
                                -{" "}
                                {formatTime(schedule?.scheduledOutTime) ||
                                  "N/A"}
                                )
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
                      <p className="text-center text-black text-xl lg:text-2xl font-semibold">
                        No upcoming schedules
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-black  flex flex-row overflow-x-auto gap-10  shadow drop-shadow smallscreens:w-fit  bg-gray-100 mx-auto  mt-6 rounded-lg">
                <Link
                  href="/student-assistant/attendance"
                  className="flex min-w-32 w-32 lg:w-40 justify-center flex-col m-4 lg:m-6 items-center cursor-pointer rounded-md shadow  bg-white  border-[1px] border-[#D9D9D9]  hover:bg-[#D9D9D9]  hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 pb-2"
                >
                  <Image
                    src={attendance}
                    className="w-20 lg:w-28 h-auto "
                    alt=""
                  />
                  <p className="text-sm lg:text-base  font-bold text-center px-4">
                    ATTENDANCE
                  </p>
                </Link>

                <Link
                  href="/student-assistant/profile"
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
