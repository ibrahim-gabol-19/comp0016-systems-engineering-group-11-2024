import React from "react";
import { useNavigate } from "react-router-dom"; // Importing useNavigate for routing

const EventButton = () => {
  const navigate = useNavigate(); // Initialize navigate hook for navigation

  const handleClick = () => {
    navigate("/events"); // Redirect to the event page
  };

  return (
    <button
      className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600 font-semibold
                 hover:bg-red-200 hover:text-red-700 hover:shadow-lg transition-all duration-200"
      onClick={handleClick} // Handle click event
    >
      <span>📍</span> {/* Location emoji */}
      Event
    </button>
  );
};

export default EventButton;
