import React, { useState } from "react";
import aiLogo from "../../assets/ai_icon.png"; 

const SearchBar = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="flex flex-col items-center w-full mt-8">
      {/* Header with AI Logo and Title */}
      <div className="flex items-center justify-center mb-4">
        <img src={aiLogo} alt="AI Logo" className="w-10 h-10 mr-3" />
        <h1 className="text-3xl font-bold text-gray-800">Ask AI</h1>
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-4xl">
        <input
          type="text"
          placeholder={isFocused ? "" : "When is the next volunteering event?"}
          className={`transition-all duration-300 ease-in-out p-4 pl-12 rounded-full bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isFocused ? "h-36" : "h-12"
          } w-full`}
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







