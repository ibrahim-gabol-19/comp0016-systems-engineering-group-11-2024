import React, { useState, useContext } from "react";
import SearchBar from "./SearchBar";
import { CompanyContext } from "../../context/CompanyContext";

const DefaultTopBar = ({
  onManual,
  setUserQuery,
  selectedCategory = "hi",
}) => {
  const { main_color } = useContext(CompanyContext);

  const lightenColor = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  };


  return (
    <div className="pb-2 text-white border-b-2 flex flex-row justify-center items-center z-10 relative">
      {/* Search Bar */}
      <div className="w-1/6"></div>
      <div className="w-3/12"></div>
      <SearchBar setUserQuery={setUserQuery} />
      <div className="w-3/12"></div>

      {/* New Button (Bottom Right) */}
      <div className="fixed bottom-8 right-8">
        <button
          className="w-16 h-16 rounded-full flex items-center justify-center text-white"
          style={{
            backgroundColor: main_color,
            backgroundColor: main_color,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = lightenColor(
              main_color,
              20
            );
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = main_color;
            e.currentTarget.style.backgroundColor = main_color;
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.backgroundColor = lightenColor(
              main_color,
              40
            );
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.backgroundColor = lightenColor(
              main_color,
              20
            );
          }}
          onClick={onManual}
        >
          <div className="flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8"
          >
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 0 1 .75.75v6h6a.75.75 0 0 1 0 1.5h-6v6a.75.75 0 0 1-1.5 0v-6h-6a.75.75 0 0 1 0-1.5h6v-6a.75.75 0 0 1 .75-.75Z"
              clipRule="evenodd"
            />
          </svg>
          </div>
        </button>
      </div>
    </div>
  );
};

export default DefaultTopBar;