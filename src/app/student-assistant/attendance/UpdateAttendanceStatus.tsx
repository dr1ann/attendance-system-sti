import React, { useEffect, useState } from "react";
import Image from "next/image";
import present from "@/app/Images/present.png";
import late from "@/app/Images/late.png";
import absent from "@/app/Images/absent.png";
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

interface ModalProps {
  scheduleId: string;
  studentName: string | null | undefined;
  teacherName: string | null;
  subject: string | null;
  roomNum: string | null;
  scheduledDate: Date | string;
  scheduledInTime: string | null;
  scheduledOutTime: string | null;
  setRefetch: () => void;
  isVisible: boolean;
  onClose: () => void;
  currentAttendanceStatus: string | null;
}

const UpdateAttendanceStatus: React.FC<ModalProps> = ({
  isVisible,
  currentAttendanceStatus,
  teacherName,
  studentName,
  subject,
  roomNum,
  scheduledDate,
  scheduledInTime,
  scheduledOutTime,
  setRefetch,
  onClose,
  scheduleId,
}) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isSaveButtonPressed, setIsSaveButtonPressed] = useState(false);
  const [isConfirmationShown, setIsConfirmationShown] = useState(false);
  const [isStatusUpdated, setIsStatusUpdated] = useState<boolean>(false);

  const [confirmationMessage, setConfirmationMessage] = useState("");

  const handleUpdate = async (status: string) => {
    try {
      setIsSaveButtonPressed(true);

      // Update attendance status and create activity log
      const response = await fetch("/api/update-attendance-status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scheduleId,
          studentName,
          subject,
          roomNum,
          scheduledDate,
          scheduledInTime,
          scheduledOutTime,
          attendanceStatus: status,
        }),
      });

      if (!response.ok) {
        setConfirmationMessage("");
        setIsStatusUpdated(false);
        setErrorMessage("Error updating attendance status");
        return;
      }

      setRefetch();
      setErrorMessage("");
      setIsStatusUpdated(true);
      setConfirmationMessage(
        `Teacher ${teacherName} was marked as ${status.toLowerCase()}`
      );
    } catch (error) {
      setIsStatusUpdated(false);
      setConfirmationMessage("");
      setErrorMessage("Internal Server Error");
      console.error("Error updating attendance status:", error);
    } finally {
      setIsConfirmationShown(true);
      onClose();
      setTimeout(() => {
        setIsSaveButtonPressed(false);
        setIsConfirmationShown(false);
      }, 1500);
    }
  };

  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (selectedStatus) {
      handleUpdate(selectedStatus);
      console.log(isConfirmationShown);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="flex lg:flex-wrap items-start lg:items-center flex-col lg:justify-center mt-4 lg:mt-0 gap-3">
      <h3 className="text-sm text-center font-semibold">
        Choose Attendance Color:
      </h3>
      <div className="flex flex-row gap-6">
        {currentAttendanceStatus !== "PRESENT" && (
          <AlertDialog key="present">
            <AlertDialogTrigger
              className="cursor-pointer w-8 h-auto"
              onClick={() => setSelectedStatus("PRESENT")}
            >
              <Image src={present} alt="present" />
            </AlertDialogTrigger>
            {selectedStatus === "PRESENT" && (
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to mark teacher {teacherName}'s
                    attendance status as Present?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>No</AlertDialogCancel>
                  <AlertDialogAction
                    className={`bg-[#2C384A] ${
                      isSaveButtonPressed
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    onClick={handleConfirm}
                    disabled={isSaveButtonPressed}
                  >
                    {isSaveButtonPressed ? (
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
                  {isConfirmationShown && (
                    <div className="flex animate-fadeUp z-[99999] min-h-screen m-auto overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 justify-center items-center w-full md:inset-0 max-h-full">
                      <div
                        id="alert-3"
                        className={`animate-fadeUp absolute bottom-0 flex items-center p-4 mb-4 ${
                          isStatusUpdated ? "text-[#28a745]" : "text-[#ff0000]"
                        } rounded-lg ${
                          isStatusUpdated ? "bg-green-50" : "bg-red-50"
                        }`}
                        role="alert"
                      >
                        <i
                          className={`${
                            isStatusUpdated
                              ? "text-[#28a745]"
                              : "text-[#ff0000]"
                          } fa-solid ${
                            isStatusUpdated ? "fa-check" : "fa-times"
                          }`}
                        ></i>
                        <span className="sr-only">
                          {isStatusUpdated ? "Success" : "Error"}
                        </span>
                        <div className="ms-3 text-sm font-medium">
                          {isStatusUpdated ? confirmationMessage : errorMessage}
                        </div>
                      </div>
                    </div>
                  )}
                </AlertDialogFooter>
              </AlertDialogContent>
            )}
          </AlertDialog>
        )}

        {currentAttendanceStatus !== "LATE" && (
          <AlertDialog key="late">
            <AlertDialogTrigger
              className="cursor-pointer w-8 h-auto"
              onClick={() => setSelectedStatus("LATE")}
            >
              <Image src={late} alt="late" />
            </AlertDialogTrigger>
            {selectedStatus === "LATE" && (
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to mark teacher {teacherName}'s
                    attendance status as Late?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>No</AlertDialogCancel>
                  <AlertDialogAction
                    className={`bg-[#2C384A] ${
                      isSaveButtonPressed
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    onClick={handleConfirm}
                    disabled={isSaveButtonPressed}
                  >
                    {isSaveButtonPressed ? (
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
                  {isConfirmationShown && (
                    <div className="flex animate-fadeUp z-[99999] min-h-screen m-auto overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 justify-center items-center w-full md:inset-0 max-h-full">
                      <div
                        id="alert-3"
                        className={`animate-fadeUp absolute bottom-0 flex items-center p-4 mb-4 ${
                          isStatusUpdated ? "text-[#28a745]" : "text-[#ff0000]"
                        } rounded-lg ${
                          isStatusUpdated ? "bg-green-50" : "bg-red-50"
                        }`}
                        role="alert"
                      >
                        <i
                          className={`${
                            isStatusUpdated
                              ? "text-[#28a745]"
                              : "text-[#ff0000]"
                          } fa-solid ${
                            isStatusUpdated ? "fa-check" : "fa-times"
                          }`}
                        ></i>
                        <span className="sr-only">
                          {isStatusUpdated ? "Success" : "Error"}
                        </span>
                        <div className="ms-3 text-sm font-medium">
                          {isStatusUpdated ? confirmationMessage : errorMessage}
                        </div>
                      </div>
                    </div>
                  )}
                </AlertDialogFooter>
              </AlertDialogContent>
            )}
          </AlertDialog>
        )}

        {currentAttendanceStatus !== "ABSENT" && (
          <AlertDialog key="absent">
            <AlertDialogTrigger
              className="cursor-pointer w-8 h-auto"
              onClick={() => setSelectedStatus("ABSENT")}
            >
              <Image src={absent} alt="absent" />
            </AlertDialogTrigger>
            {selectedStatus === "ABSENT" && (
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to mark teacher {teacherName}'s
                    attendance status as Absent?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>No</AlertDialogCancel>
                  <AlertDialogAction
                    className={`bg-[#2C384A] ${
                      isSaveButtonPressed
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    onClick={handleConfirm}
                    disabled={isSaveButtonPressed}
                  >
                    {isSaveButtonPressed ? (
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
                  {isConfirmationShown && (
                    <div className="flex animate-fadeUp z-[99999] min-h-screen m-auto overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 justify-center items-center w-full md:inset-0 max-h-full">
                      <div
                        id="alert-3"
                        className={`animate-fadeUp absolute bottom-0 flex items-center p-4 mb-4 ${
                          isStatusUpdated ? "text-[#28a745]" : "text-[#ff0000]"
                        } rounded-lg ${
                          isStatusUpdated ? "bg-green-50" : "bg-red-50"
                        }`}
                        role="alert"
                      >
                        <i
                          className={`${
                            isStatusUpdated
                              ? "text-[#28a745]"
                              : "text-[#ff0000]"
                          } fa-solid ${
                            isStatusUpdated ? "fa-check" : "fa-times"
                          }`}
                        ></i>
                        <span className="sr-only">
                          {isStatusUpdated ? "Success" : "Error"}
                        </span>
                        <div className="ms-3 text-sm font-medium">
                          {isStatusUpdated ? confirmationMessage : errorMessage}
                        </div>
                      </div>
                    </div>
                  )}
                </AlertDialogFooter>
              </AlertDialogContent>
            )}
          </AlertDialog>
        )}
      </div>
    </div>
  );
};

export default UpdateAttendanceStatus;
