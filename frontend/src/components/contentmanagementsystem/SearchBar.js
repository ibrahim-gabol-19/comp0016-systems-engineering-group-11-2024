import React, { useState } from "react";

const SearchBar = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="basis-4/12 ">
     

      {/* Search Bar */}
      <div className="relative w-full ">
        <input
          type="text"
          placeholder={isFocused ? "" : "Search"}
          className={` transition-all duration-300 ease-in-out  pr-48 pl-12 rounded-full bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isFocused ? "h-12 w-3/4" : "h-12 w-1/2"
          }`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-500"
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
    </div>
  );
};

export default SearchBar;