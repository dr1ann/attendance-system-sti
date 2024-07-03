import type { ActivityLog } from "@prisma/client";
import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { ExportActivityLog } from "@/app/components/ExportToExcel";

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
}

const ActivityLog: React.FC<ModalProps> = ({
  isVisible,
  onClose,
  studentId,
  studentName,
}) => {
  const [isFetchSuccessful, setIsFetchSuccessful] = useState(false);
  const [studentActivities, setStudentActivities] = useState<ActivityLog[]>([]);
  const [sortedActivities, setSortedActivities] = useState<ActivityLog[]>([]);
  const [sortOption, setSortOption] = useState<"newest" | "oldest">("newest");

  const sortNewestToOldest = useMemo(() => {
    return [...studentActivities].sort((a, b) => {
      const createdAtA = a?.createdAt ? new Date(a?.createdAt).getTime() : 0;
      const createdAtB = b?.createdAt ? new Date(b?.createdAt).getTime() : 0;
      return createdAtB - createdAtA;
    });
  }, [studentActivities]);

  const sortOldestToNewest = useMemo(() => {
    return [...studentActivities].sort((a, b) => {
      const createdAtA = a?.createdAt ? new Date(a?.createdAt).getTime() : 0;
      const createdAtB = b?.createdAt ? new Date(b?.createdAt).getTime() : 0;
      return createdAtA - createdAtB;
    });
  }, [studentActivities]);

  useEffect(() => {
    switch (sortOption) {
      case "oldest":
        setSortedActivities(sortOldestToNewest);
        break;
      case "newest":
      default:
        setSortedActivities(sortNewestToOldest);
        break;
    }
  }, [sortOption, sortNewestToOldest, sortOldestToNewest]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!studentId) return; // Skip fetching if currentId is null

      try {
        const response = await fetch("/api/activity-log", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ studentId }),
        });

        if (!response.ok) {
          setIsFetchSuccessful(false);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: ActivityLog[] = await response.json();

        setStudentActivities(data);
        setIsFetchSuccessful(true);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setIsFetchSuccessful(false);
      }
    };

    fetchUserProfile();
  }, [studentId]);

  const formatTime = (timeString: string) => {
    return moment(timeString, "HH:mm").format("hh:mm A");
  };
  const formatDate = (dateString: string | Date | null) => {
    return moment(dateString).format("MM/DD/YYYY");
  };
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

  const handleExport = () => {
    ExportActivityLog(
      sortedActivities,
      studentName,
      `${studentName}'s Activity Log`
    );
  };

  if (!isVisible) return null;

  return (
    <div
      data-modal-backdrop="add"
      aria-hidden="true"
      className="flex animate-fadeUp z-[99999] min-h-screen backdrop-blur-sm m-auto overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 justify-center items-center w-full md:inset-0 max-h-full"
    >
      <div
        className={`relative p-4 w-full ${
          isFetchSuccessful ? "max-w-fit" : "max-w-[46rem]"
        } m-auto`}
      >
        {/* Modal content */}
        <div className="relative bg-white rounded-lg shadow">
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t gap-2">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900">
              <i className="fa-solid fa-chart-line text-base lg:text-lg text-center text-[#2C384A]"></i>{" "}
              {`${studentName}'s Activity Log`}
            </h3>
            <button
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-300 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              data-modal-hide="add-modal"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {!isFetchSuccessful ? (
            <div className="flex space-x-2 justify-center items-center bg-white h-[70vh] ">
              <span className="sr-only">Loading...</span>
              <div className="h-3 w-3 lg:h-4 lg:w-4 bg-[#01579B] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-3 w-3 lg:h-4 lg:w-4 bg-[#01579B] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-3 w-3 lg:h-4 lg:w-4 bg-[#01579B] rounded-full animate-bounce"></div>
            </div>
          ) : (
            <>
              {studentActivities?.length > 0 ? (
                <div className="flex flex-col gap-4 p-6 overflow-auto">
                  <div className="flex flex-row justify-between items-center">
                    <form className="flex flex-row items-center w-fit space-x-2">
                      <label
                        htmlFor="sort"
                        className="text-sm font-medium whitespace-nowrap"
                      >
                        Sort by:
                      </label>
                      <select
                        id="sort"
                        className="bg-gray-100 border border-[#D9D9D9] text-sm rounded-lg focus:ring-[#01579B] focus:border-[#01579B] block w-full p-1"
                        value={sortOption}
                        onChange={(e) =>
                          setSortOption(e.target.value as "newest" | "oldest")
                        }
                      >
                        <option value="dJoined" disabled>
                          Date joined:
                        </option>
                        <option value="newest">Newest - Oldest</option>
                        <option value="oldest">Oldest - Newest</option>
                      </select>
                    </form>
                    <button
                      onClick={handleExport}
                      className="shadow bg-transparent mt-2 lg:mt-0 border-[1px] border-[#D9D9D9] hover:bg-[#D9D9D9] hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 w-fit ml-auto rounded-lg px-3 py-1 mr-2 cursor-pointer flex justify-center flex-row items-center gap-1"
                    >
                      <i className="fa-solid fa-print text-sm text-[#2C384A]"></i>
                      <span
                        id="showAdd"
                        className="font-semibold text-sm text-center"
                      >
                        Export Activity Log
                      </span>
                    </button>
                  </div>
                  <table className="w-full text-left rtl:text-right text-white">
                    <thead>
                      <tr className="bg-[#2C384A]">
                        <th
                          scope="col"
                          id="activityHeader"
                          className="text-center text-sm lg:text-base px-6 py-3"
                        >
                          SUBJECT
                        </th>
                        <th
                          scope="col"
                          id="roomNumHeader"
                          className="text-center text-sm lg:text-base px-6 py-3"
                        >
                          ROOM NO.
                        </th>
                        <th
                          scope="col"
                          id="dateTimeHeader"
                          className="text-center text-sm lg:text-base px-6 py-3"
                        >
                          SCHEDULED DATE & TIME
                        </th>
                        <th
                          scope="col"
                          id="dateTimeHeader"
                          className="text-center text-sm lg:text-base px-6 py-3"
                        >
                          ACTIVITY
                        </th>
                        <th
                          scope="col"
                          id="dateTimeHeader"
                          className="text-center text-sm lg:text-base px-6 py-3"
                        >
                          UPDATED ON
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedActivities?.map((activity: ActivityLog) => (
                        <tr key={activity?.id}>
                          <td
                            scope="row"
                            className="px-6 py-3 text-center text-sm  text-black lg:text-base bg-gray-100 h-full shadow drop-shadow"
                          >
                            {activity?.subject || "N/A"}
                          </td>
                          <td className="px-6 py-3 text-center text-sm lg:text-base bg-gray-100 text-black h-full shadow drop-shadow">
                            {activity?.roomNum || "N/A"}
                          </td>

                          <td className="px-6 py-3 text-center text-sm lg:text-base bg-gray-100 text-black h-full shadow drop-shadow">
                            {formatDate(activity?.scheduledDate) || "N/A"}
                            <br />(
                            {formatTime(activity?.scheduledInTime) ||
                              "N/A"} -{" "}
                            {formatTime(activity?.scheduledOutTime) || "N/A"})
                          </td>

                          <td className="px-6 py-3 text-center text-sm lg:text-base bg-gray-100 text-black h-full shadow drop-shadow">
                            {activity?.activity || "N/A"}
                          </td>

                          <td className="px-6 py-3 text-center text-sm lg:text-base bg-gray-100 text-black h-full shadow drop-shadow">
                            {formatCreatedAtDate(activity?.createdAt) || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="px-4 py-2 text-center font-semibold">
                  No activities found for this student.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
