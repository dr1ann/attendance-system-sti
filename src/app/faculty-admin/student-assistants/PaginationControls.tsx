"use client";

import { FC } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationControlsProps {
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const PaginationControls: FC<PaginationControlsProps> = ({
  hasNextPage,
  hasPrevPage,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = searchParams.get("page") ?? "1";
  const per_page = searchParams.get("per_page") ?? "5";
  const currentPage = Number(page);
  const hasPreviousPage = currentPage > 1;

  return (
    <div className="flex gap-2 items-center justify-center mt-4">
      <button
        className={`text-xs lg:text-sm shadow border-[1px] border-[#D9D9D9] w-fit my-4 rounded-lg px-3 py-1  flex justify-center flex-row items-center gap-1 ${
          hasPrevPage
            ? "cursor-pointer bg-transparent hover:bg-[#D9D9D9] hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0"
            : "cursor-not-allowed opacity-50"
        }`}
        disabled={!hasPreviousPage}
        onClick={() => {
          router.push(
            `/faculty-admin/student-assistants?page=${
              Number(page) - 1
            }&per_page=${per_page}`
          );
        }}
      >
        Previous page
      </button>

      <div className="text-xs lg:text-sm">
        {page} / {Math.ceil(10 / Number(per_page))}
      </div>

      <button
        className={`text-xs lg:text-sm shadow border-[1px] border-[#D9D9D9] w-fit my-4 rounded-lg px-3 py-1  flex justify-center flex-row items-center gap-1 ${
          hasNextPage
            ? "cursor-pointer bg-transparent hover:bg-[#D9D9D9] hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0"
            : "cursor-not-allowed opacity-50"
        }`}
        disabled={!hasNextPage}
        onClick={() => {
          router.push(
            `/faculty-admin/student-assistants?page=${
              Number(page) + 1
            }&per_page=${per_page}`
          );
        }}
      >
        Next page
      </button>
    </div>
  );
};

export default PaginationControls;
