import React, { useState } from "react";

const MapFilter = ({ onFilterChange, onDateChange }) => {
  const [filters, setFilters] = useState({
    volunteering: false,
    events: false,
    news: false,
    issues: false,
  });
  const [dates, setDates] = useState({
    from: "",
    to: "",
  });

  const handleCheckboxChange = (e) => {
    const newFilters = {
      ...filters,
      [e.target.name]: e.target.checked,
    };
    setFilters(newFilters);
    onFilterChange(newFilters); // Pass changes up to App.js
  };

  const handleDateChange = (e) => {
    const newDates = {
      ...dates,
      [e.target.name]: e.target.value,
    };
    setDates(newDates);
    onDateChange(newDates); // Pass changes up to App.js
  };

  return (
    <div className="w-[300px] p-5 bg-[#f9f9f9] rounded-lg font-sans flex flex-col gap-5 shadow-md transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
      {/* Filter Section */}
      <div className="flex flex-col gap-2.5">
        <h3 className="text-lg font-semibold text-gray-900">Filter By</h3>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            name="volunteering"
            checked={filters.volunteering}
            onChange={handleCheckboxChange}
            className="transform scale-150 cursor-pointer accent-[#007bff]"
          />
          Volunteering 🙌
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            name="events"
            checked={filters.events}
            onChange={handleCheckboxChange}
            className="transform scale-150 cursor-pointer accent-[#007bff]"
          />
          Events 📍
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            name="news"
            checked={filters.news}
            onChange={handleCheckboxChange}
            className="transform scale-150 cursor-pointer accent-[#007bff]"
          />
          News 📰
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            name="issues"
            checked={filters.issues}
            onChange={handleCheckboxChange}
            className="transform scale-150 cursor-pointer accent-[#007bff]"
          />
          Issues ⚠️
        </label>
      </div>

      {/* Dates Section */}
      <div className="flex flex-col gap-2.5">
        <h3 className="text-lg font-semibold text-gray-900">Dates</h3>
        <label className="text-sm font-medium text-gray-700">
          From:{" "}
          <input
            type="date"
            name="from"
            value={dates.from}
            onChange={handleDateChange}
            className="w-full py-1.5 px-3 border border-gray-300 rounded-md text-sm"
          />
        </label>
        <label className="text-sm font-medium text-gray-700">
          To:{" "}
          <input
            type="date"
            name="to"
            value={dates.to}
            onChange={handleDateChange}
            className="w-full py-1.5 px-3 border border-gray-300 rounded-md text-sm"
          />
        </label>
      </div>
    </div>
  );
};

export default MapFilter;
