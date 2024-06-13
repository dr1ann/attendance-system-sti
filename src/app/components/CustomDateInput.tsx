import React, { forwardRef } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

interface CustomInputProps {
  value: string | Date | null;
  onClick: () => void;
}

const CustomDateInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ value, onClick }: CustomInputProps, ref) => {
    const displayValue = value instanceof Date ? value.toLocaleDateString() : value || '';

    return (
      <div className="relative">
        <input
          type="text"
          name='date'
          id='date'
          value={displayValue}
          onClick={onClick}
          ref={ref}
          readOnly
          className="peer border shadow drop-shadow border-[#D9D9D9] text-sm rounded-lg py-2 px-3 focus:outline-none focus:border-[#01579B]"
        />
          <label htmlFor="date" className={`tracking-wider absolute text-xs lg:text-sm text-[#888] duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 rounded-lg peer-focus:text-[#01579B]`}>mm/dd/year</label>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <span className="text-gray-500">
            <FaCalendarAlt />
          </span>
        </div>
      </div>
    );
  }
);

export default CustomDateInput;
