import React, { useState } from "react";

const SearchBar = ({ setUserQuery }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    // Use full width on mobile, 4/12 on medium+ screens
    <div className="w-full md:w-4/12">
      {/* Search Bar Container */}
      <div
        className={`flex justify-center items-center transition-all duration-300 ease-in-out rounded-full bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isFocused ? "h-12 w-3/4" : "h-12 lg:w-1/2 w-3/4"
        }`}
      >
        {/* Icon */}
        <div className="w-1/6 h-full flex justify-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-gray-500"
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
        {/* Input */}
        <div className="w-5/6 h-full flex justify-center items-center">
          <input
            type="text"
            placeholder={isFocused ? "" : " Search"}
            className="bg-transparent h-full w-full outline-none"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => setUserQuery(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
