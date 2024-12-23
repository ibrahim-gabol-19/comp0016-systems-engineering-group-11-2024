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
        New
      </button>
      <div className="basis-3/12"></div>

      <SearchBar />
      <div className="basis-3/12"></div>

      {/* Dropdown list, visible when isDropdownOpen is true */}
      <div
        className={`absolute bg-gray-200 py-2 px-14 mt-2 rounded-lg shadow-lg z-20 left-8 w-full max-w-xs top-full transition-all duration-200  ${
          isDropdownOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <button
          className="flex flex-row justify-center w-full py-3 bg-white font-bold text-green-500  rounded-lg  active:bg-green-100 hover:outline transition duration-500 active:duration-100 mb-2"
          onClick={onManual}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          Create
        </button>
        <button
          className="flex flex-row justify-center w-full py-3 bg-white font-bold text-green-500  rounded-lg  hover:outline active:bg-green-100 transition duration-500 active:duration-100"
          onClick={onUpload}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          Upload
        </button>
      </div>
    </div>
  );
};

export default DefaultTopBar;
