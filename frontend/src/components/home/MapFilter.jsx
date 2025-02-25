import React, { useState } from "react";

const MapFilter = ({ onFilterChange, onDateChange }) => {
  const [filters, setFilters] = useState({
    volunteering: true,
    events: true,
    news: true,
    issues: true,
  });
  const [dates, setDates] = useState({
    from: "",
    to: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // You can handle the search logic here if needed, or pass the query up to parent component
  };

  return (
    <div className="h-[530px] w-[300px] mt-6 p-5 bg-[#f9f9f9] rounded-lg font-sans flex flex-col gap-5 shadow-md">
      {/* Search Bar */}
      <div className="mb-3 relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder={isFocused ? "" : "Search map..."}
          className={`transition-all duration-300 ease-in-out p-2 pl-10 rounded-full bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isFocused ? "h-12" : "h-10"
          } w-full`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19a7 7 0 117-7 7 7 0 01-7 7zm0 0l-6 6"
            />
          </svg>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-gray-900">Filter By</h3>
        <label className="flex items-center mt-2 gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md">
          <input
            type="checkbox"
            name="volunteering"
            checked={filters.volunteering}
            onChange={handleCheckboxChange}
            className="transform scale-150 cursor-pointer accent-[#007bff]"
          />
          Volunteering 🙌
        </label>
        <label className="flex items-center mt-2 gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md">
          <input
            type="checkbox"
            name="events"
            checked={filters.events}
            onChange={handleCheckboxChange}
            className="transform scale-150 cursor-pointer accent-[#007bff]"
          />
          Events 📍
        </label>
        <label className="flex items-center mt-2 gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md">
          <input
            type="checkbox"
            name="news"
            checked={filters.news}
            onChange={handleCheckboxChange}
            className="transform scale-150 cursor-pointer accent-[#007bff]"
          />
          News 📰
        </label>
        <label className="flex items-center mt-2 gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md">
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
      <div className="flex flex-col gap-2 mt-4">
        <h3 className="text-lg font-semibold text-gray-900">Dates</h3>
        <label className="text-sm mt-2 font-medium text-gray-700">
          From:{" "}
          <input
            type="date"
            name="from"
            value={dates.from}
            onChange={handleDateChange}
            className="w-full py-1.5 px-3 border border-gray-300 rounded-md text-sm"
          />
        </label>
        <label className="text-sm mt-2 font-medium text-gray-700">
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






 





