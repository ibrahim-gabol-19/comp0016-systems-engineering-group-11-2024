import React, { useState } from "react";

const Calendar = () => {
  const [currentWeek, setCurrentWeek] = useState(0);

  const handleNextWeek = () => {
    setCurrentWeek((prevWeek) => prevWeek + 1);
  };

  const handlePrevWeek = () => {
    setCurrentWeek((prevWeek) => prevWeek - 1);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="flex justify-end mb-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded-lg mr-2 hover:bg-gray-300"
          onClick={handlePrevWeek}
        >
          Previous
        </button>
        <button
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          onClick={handleNextWeek}
        >
          Next
        </button>
      </div>
      <div className="border rounded-lg p-6 bg-white shadow">
        <h2 className="text-lg font-bold mb-4">Week {currentWeek}</h2>
        <p>Here would be your weekly calendar content.</p>
      </div>
    </div>
  );
};

export default Calendar;
