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
          value={displayValue}
          onClick={onClick}
          ref={ref}
          readOnly
          className="border shadow drop-shadow border-[#D9D9D9] rounded-lg py-2 px-3 focus:outline-none focus:border-[#01579B]"
        />
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
