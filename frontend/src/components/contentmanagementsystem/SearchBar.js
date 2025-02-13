import React, { useState } from "react";

const SearchBar = ({setUserQuery}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-4/12 ">


      {/* Search Bar */}
      <div
        className={` justify-center px-2 items-center transition-all flex duration-300 ease-in-out    rounded-full bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isFocused ? "h-12 w-3/4 ring-2 ring-blue-500" : "h-12 w-1/2"
          }`}>
        <div className="w-1/6 h-full flex justify-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7  w-7  justify-center items-center text-gray-500"
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
        <div className="w-5/6 h-full justify-center items-center">
          <input
            type="text"
            placeholder={isFocused ? "" : "Search"}
            className="bg-transparent h-full w-full justify-center items-center focus-ring-green-100 outline-none bg-transparent"
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