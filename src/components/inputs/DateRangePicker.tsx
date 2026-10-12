'use client';
import React, { useState } from 'react';

interface DateRangePickerProps {
  value?: { start_date: string; end_date: string };
  onChange: (value: { start_date: string; end_date: string }) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ value, onChange }) => {
  const [startDate, setStartDate] = useState(value?.start_date || '');
  const [endDate, setEndDate] = useState(value?.end_date || '');

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);

    // Si la nouvelle start_date est plus grande que end_date, on ajuste end_date
    if (newStartDate && newStartDate > endDate) {
      setEndDate(newStartDate);
      onChange({ start_date: newStartDate, end_date: newStartDate });
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;

    // Si end_date est inférieur à start_date, on le met à jour
    if (newEndDate && newEndDate < startDate) {
      setEndDate(startDate);  // On fixe end_date à start_date
      onChange({ start_date: startDate, end_date: startDate });
    } else {
      setEndDate(newEndDate);
      onChange({ start_date: startDate, end_date: newEndDate });
    }
  };

  return (
    <div className="w-auto h-[40px] px-[15px] bg-white rounded-[10px] inline-flex justify-start items-center gap-2.5">
      <div className="flex flex-1 h-[40px] items-center justify-start text-dark-blue text-xs font-medium">
        <input
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          className="border px-2 py-1 rounded-[5px] border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="mx-2">-</span>
        <input
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          className="border px-2 py-1 rounded-[5px] border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
