import React, { useState } from "react";
import SearchBar from "./SearchBar";

const DefaultTopBar = ({ onManual, onUpload }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="pb-2 text-white flex flex-row justify-center items-center z-10 relative">
      {/* New Button to toggle dropdown */}
      <button
        className="justify-center basis-1/6 flex flex-row py-3 max-w-80 bg-green-500 font-bold text-white rounded-lg hover:bg-green-400 active:bg-green-300 transition active:duration-100 duration-500"
        onClick={toggleDropdown}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.7"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        New Event
      </button>
      <div className="basis-3/12"></div>

      <SearchBar />
      <div className="basis-3/12"></div>

      {/* Dropdown list, visible when isDropdownOpen is true */}
      {isDropdownOpen && (
        <div className="absolute bg-gray-200 py-2 px-14 mt-2 rounded-lg shadow-lg z-20 top-full left-8 w-full max-w-xs">
          <button
            className="justify-center w-full py-3 bg-white font-bold text-green-500  rounded-lg  active:bg-green-100 hover:outline transition duration-500 active:duration-100 mb-2"
            onClick={onManual}
          >
            Manual
          </button>
          <button
            className="justify-center w-full py-3 bg-white font-bold text-green-500  rounded-lg  hover:outline active:bg-green-100 transition duration-500 active:duration-100"
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
