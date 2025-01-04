import React, { useState } from "react";

const DateTime = ({ onDateChange, onTimeChange }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    onDateChange(newDate); // Pass the date back to the parent
  };

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    setTime(newTime);
    onTimeChange(newTime); // Pass the time back to the parent
  };

  return (
    <div className="relative bg-gray-50 text-gray-900 py-6 px-8 flex flex-col md:flex-row justify-between items-center shadow-lg rounded-lg md:space-x-6 space-y-6 md:space-y-0">
      {/* Date Picker */}
      <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 space-y-2 md:space-y-0">
        <label
          htmlFor="date-picker"
          className="text-sm font-medium text-gray-700 md:text-base"
        >
          Select a Date:
        </label>
        <input
          type="date"
          id="date-picker"
          value={date}
          onChange={handleDateChange}
          className="bg-white text-gray-900 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-48"
        />
      </div>

      {/* Time Picker */}
      <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 space-y-2 md:space-y-0">
        <label
          htmlFor="time-picker"
          className="text-sm font-medium text-gray-700 md:text-base"
        >
          Select a Time:
        </label>
        <input
          type="time"
          id="time-picker"
          value={time}
          onChange={handleTimeChange}
          className="bg-white text-gray-900 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-48"
        />
      </div>
    </div>
  );
};

export default DateTime;
