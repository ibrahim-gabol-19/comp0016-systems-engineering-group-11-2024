import React, { useState, useEffect } from "react";

const MapFilter = ({ onFilterChange, onDateChange }) => {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const [filters, setFilters] = useState({
    events: true,
    issues: true,
  });

  const [dates, setDates] = useState({
    from: today, // Default "From" date: Today
    to: "",   // Default "To" date: Any time in the future
  });

  useEffect(() => {
    // Set default date filters when component mounts
    onDateChange(dates);
  }, [dates, onDateChange]); 

  const handleCheckboxChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.checked };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateChange = (e) => {
    const newDates = { ...dates, [e.target.name]: e.target.value };
    setDates(newDates);
    onDateChange(newDates);
  };

  return (
    <div className="w-80 p-6 bg-white rounded-2xl shadow-lg flex flex-col gap-5 border border-gray-200">
      {/* Filter Section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-semibold text-gray-900">Filter By</h3>
        <label className="flex items-center gap-3 text-gray-700 text-md font-medium cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-all">
          <input
            type="checkbox"
            name="events"
            checked={filters.events}
            onChange={handleCheckboxChange}
            className="w-5 h-5 cursor-pointer accent-blue-600"
          />
          Events <span className="text-blue-600">📍</span>
        </label>
        <label className="flex items-center gap-3 text-gray-700 text-md font-medium cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-all">
          <input
            type="checkbox"
            name="issues"
            checked={filters.issues}
            onChange={handleCheckboxChange}
            className="w-5 h-5 cursor-pointer accent-blue-600"
          />
          Issues <span className="text-yellow-600">⚠️</span>
        </label>
      </div>

      {/* Dates Section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-semibold text-gray-900">Dates</h3>
        <label className="text-gray-700 text-md font-medium flex flex-col gap-1">
          From:
          <input
            type="date"
            name="from"
            value={dates.from}
            onChange={handleDateChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </label>
        <label className="text-gray-700 text-md font-medium flex flex-col gap-1">
          To:
          <input
            type="date"
            name="to"
            value={dates.to}
            onChange={handleDateChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </label>
      </div>
    </div>
  );
};

export default MapFilter;
