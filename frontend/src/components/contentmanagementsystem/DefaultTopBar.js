import React, { useState } from "react";
import SearchBar from "./SearchBar";

const DefaultTopBar = ({ onManual, onUpload }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="bg-gray-800 text-white py-2 px-4 flex justify-between items-center z-10">
      <div>
        <SearchBar />
        {/* New Button to toggle dropdown */}
        <button
          className="mr-4 px-4 py-2 bg-blue-500 rounded-lg"
          onClick={toggleDropdown}
        >
          New
        </button>

        {/* Dropdown list, visible when isDropdownOpen is true */}
        {isDropdownOpen && (
          <div className="absolute bg-gray-700 py-2 px-4 mt-2 rounded-lg shadow-lg">
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
    </div>
  );
};

export default DefaultTopBar;
