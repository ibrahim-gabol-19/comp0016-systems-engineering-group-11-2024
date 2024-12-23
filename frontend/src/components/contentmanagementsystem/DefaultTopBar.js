import React, { useState } from "react";
import SearchBar from "./SearchBar";

const DefaultTopBar = ({ onManual, onUpload }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="bg-gray text-white  flex flex-row justify-between items-center z-10 relative">
      {/* New Button to toggle dropdown */}
      <button
        className="justify-center  basis-1/6 flex flex-row  py-3  bg-green-500 font-bold text-white rounded-lg hover:bg-green-400  focus:bg-green-300 transition duration-500"
        onClick={toggleDropdown}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.7"
          stroke="currentColor"
          className="w-6 h-6 "
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        New Event
      </button>

      <SearchBar />

      {/* Dropdown list, visible when isDropdownOpen is true */}
      {isDropdownOpen && (
        <div className="absolute bg-gray-700 py-2 px-4 mt-2 rounded-lg shadow-lg z-20">
          <button
            className="block w-full text-left px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg mb-2"
            onClick={onManual}
          >
            Manual
          </button>
          <button
            className="block w-full text-left px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg"
            onClick={onUpload}
          >
            Upload
          </button>
        </div>
      )}
    </div>
  );
};

export default DefaultTopBar;
