import React, { useState, useContext } from "react";
import SearchBar from "./SearchBar";
import { CompanyContext } from "../../context/CompanyContext";
const DefaultTopBar = ({ onManual, onUpload, setUserQuery, selectedCategory="hi" }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { main_color, logo, name } = useContext(CompanyContext);

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
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="pb-2 text-white border-b-2  flex flex-row justify-center items-center z-10 relative">
      {/* New Button to toggle dropdown */}
      <div className="w-1/6">
        <button
          className="justify-center w-full flex flex-row py-3 max-w-80 font-bold text-white rounded-lg transition active:duration-500 duration-100"
          style={{
            backgroundColor: main_color, // Default background color
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = lightenColor(
              main_color,
              20
            ); // Lighter background on hover
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = main_color; // Reset background on mouse leave
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.backgroundColor = lightenColor(
              main_color,
              40
            ); // Even lighter background on active
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.backgroundColor = lightenColor(
              main_color,
              20
            ); // Reset to hover state on mouse up
          }}
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
          New {selectedCategory === "Articles" && "Article"} {selectedCategory === "Events" && "Event"} {selectedCategory === "Reporting" && "Report"} 
        </button>
        <div
          className={`absolute bg-gray-200 py-1 px-5 mt-2 rounded-lg shadow-lg z-20 w-1/6 left-0 transition-all duration-200 ${
            isDropdownOpen
              ? "max-h-40 opacity-100 pointer-events-auto"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <button
            className="flex flex-row justify-center w-full py-3 bg-white font-bold rounded-lg hover:bg-gray-100 transition duration-500 active:duration-100 mb-2"
            style={{
              color: lightenColor(main_color, 10)
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.backgroundColor = lightenColor(
                main_color,
                80
              ); // Lighter background on active
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.backgroundColor = "white"; // Reset background on mouse up
            }}
            onClick={onManual}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
            Create
          </button>
          <button
            className="flex flex-row justify-center w-full py-3 bg-white font-bold rounded-lg hover:bg-gray-100 transition duration-500 active:duration-100"
            style={{
              color: lightenColor(main_color, 10)
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.backgroundColor = lightenColor(
                main_color,
                80
              ); // Lighter background on active
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.backgroundColor = "white"; // Reset background on mouse up
            }}
            onClick={onUpload}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
              />
            </svg>
            Upload
          </button>
        </div>
      </div>

      <div className="w-3/12"></div>

      <SearchBar setUserQuery={setUserQuery} />
      <div className="w-3/12"></div>
    </div>
  );
};

export default DefaultTopBar;
