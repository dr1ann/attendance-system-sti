import React, { useEffect, useState } from "react";
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
  editingRowId: string | null;
  setRefetch: () => void;
}
interface ApiResponseType {
  message?: string | undefined;
  status?: number | undefined;
}
const RemoveSchedule: React.FC<ModalProps> = ({ editingRowId, setRefetch }) => {
  const [isRemoveBtnPressed, setIsRemoveBtnPressed] = useState(false);
  const [isScheduleRemoved, setIsScheduleRemoved] = useState(false);
  const [removeError, setRemoveError] = useState("");
  const [isConfirmationShown, setIsConfirmationShown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [key, setKey] = useState(Math.random());

  const removeSchedule = async () => {
    try {
      setIsRemoveBtnPressed(true);
      const response = await fetch("/api/schedule-info", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: editingRowId }),
      });

      const data: ApiResponseType = await response.json();

      if (response.ok) {
        setRemoveError("");
        setIsScheduleRemoved(true);
      } else {
        setIsScheduleRemoved(false);
        setRemoveError("Error removing schedule. Please try again");
        console.error(data.message);
      }
    } catch (error) {
      setIsScheduleRemoved(false);
      setRemoveError("Something went wrong. Please try again");
    } finally {
      setTimeout(() => {
        setIsRemoveBtnPressed(false);
      }, 1500);

      setIsConfirmationShown(true);
    }
  };
  useEffect(() => {
    if (isConfirmationShown) {
      const timer = setTimeout(() => {
        setIsConfirmationShown(false);
        setIsScheduleRemoved(false);
        setKey(Math.random()); // Add this line to force a re-render of the modal
        setRefetch();
        setTimeout(() => {
          setIsModalOpen(false); // PUT DELAY ON CLOSING THE MODAL
        }, 1000);
      }, 1500); // Show confirmation for 1.5 seconds before refetching and closing the modal
      return () => clearTimeout(timer);
    }
  }, [isConfirmationShown, setRefetch]);

  const handleRemoveSchedule = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    removeSchedule();
  };

  return (
    <>
      <AlertDialog key={key}>
        <AlertDialogTrigger
          onClick={() => setIsModalOpen(true)}
          className="shadow  bg-transparent  border-[1px] border-[#ff0000] border-dashed hover:text-white hover:bg-[#ff0000]  hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 w-fit mx-auto  rounded-lg px-2 py-1 cursor-pointer flex  justify-center flex-row items-center gap-1"
        >
          <i className="fa-solid fa-calendar-minus text-xs text-center "></i>
          <span className="font-semibold text-sm text-center">Remove</span>
        </AlertDialogTrigger>
        {isModalOpen && (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete this schedule?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Deleting this schedule will permanently remove it from the
                system. This action cannot be undone. Please confirm if you wish
                to proceed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>No</AlertDialogCancel>

              <AlertDialogAction
                className="bg-[#2C384A]"
                onClick={handleRemoveSchedule}
                disabled={isRemoveBtnPressed}
              >
                {isRemoveBtnPressed ? (
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
                <div className="flex animate-fadeUp z-[99999] min-h-screen  m-auto overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 justify-center items-center w-full md:inset-0 max-h-full">
                  <div
                    id="alert-3"
                    className={`animate-fadeUp absolute bottom-0 flex items-center p-4 mb-4 ${
                      isScheduleRemoved ? "text-[#28a745]" : "text-[#ff0000]"
                    } rounded-lg ${
                      isScheduleRemoved ? "bg-green-50" : "bg-red-50"
                    }`}
                    role="alert"
                  >
                    <i
                      className={`${
                        isScheduleRemoved ? "text-[#28a745]" : "text-[#ff0000]"
                      } fa-solid ${
                        isScheduleRemoved ? "fa-check" : "fa-times"
                      }`}
                    ></i>
                    <span className="sr-only">
                      {isScheduleRemoved ? "Success" : "Error"}
                    </span>
                    <div className="ms-3 text-sm font-medium">
                      {isScheduleRemoved
                        ? "Schedule was removed successfully"
                        : removeError}
                    </div>
                  </div>
                </div>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
      </AlertDialog>
    </>
  );
};

export default RemoveSchedule;
