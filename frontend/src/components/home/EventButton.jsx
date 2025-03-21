import React from "react";

const EventButton = () => {
  

  return (
    <button
      className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600 font-semibold
                 "
      // Handle click event
    >
      <span>📍</span> {/* Location emoji */}
      Event
    </button>
  );
};

export default EventButton;
