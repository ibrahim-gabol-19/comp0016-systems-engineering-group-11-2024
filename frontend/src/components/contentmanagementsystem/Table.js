import React, { useState } from "react";

const Table = () => {
  const [selectedCategory, setSelectedCategory] = useState("Museums");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const categories = ["Forum", "Reporting", "Events", "News"];

  // Sample events data for each category
  const sampleData = {
    Forum: [
      { title: "Big Ben", openTimes: "9:00 AM - 6:00 PM", description: "Iconic clock tower located in London.", image: "https://via.placeholder.com/150" },
      { title: "Tower of London", openTimes: "10:00 AM - 5:30 PM", description: "Historic castle on the River Thames.", image: "https://via.placeholder.com/150" },
      { title: "London Eye", openTimes: "10:00 AM - 8:00 PM", description: "Famous observation wheel offering panoramic views.", image: "https://via.placeholder.com/150" },
      { title: "The Shard", openTimes: "9:00 AM - 10:00 PM", description: "Tallest building in London with an observation deck.", image: "https://via.placeholder.com/150" },
      { title: "Buckingham Palace", openTimes: "9:00 AM - 7:00 PM", description: "The official residence of the British monarch.", image: "https://via.placeholder.com/150" },
      { title: "Stonehenge", openTimes: "9:00 AM - 5:00 PM", description: "Prehistoric monument consisting of large stone circles.", image: "https://via.placeholder.com/150" },
      { title: "Westminster Abbey", openTimes: "9:30 AM - 3:30 PM", description: "Historic church and burial site of many monarchs.", image: "https://via.placeholder.com/150" },
      { title: "London Bridge", openTimes: "Open 24 hours", description: "Iconic bridge spanning the River Thames.", image: "https://via.placeholder.com/150" },
    ],
    Reporting: [
      { title: "British Museum", openTimes: "10:00 AM - 6:00 PM", description: "Explore world history and culture.", image: "https://via.placeholder.com/150" },
      { title: "Natural History Museum", openTimes: "10:00 AM - 5:50 PM", description: "Discover the wonders of the natural world.", image: "https://via.placeholder.com/150" },
    ],
    Events: [
      { title: "Hyde Park", openTimes: "Open 24 hours", description: "Relax in one of London's largest parks.", image: "https://via.placeholder.com/150" },
    ],
    News: [
      { title: "Camden Market", openTimes: "10:00 AM - 7:00 PM", description: "Browse eclectic shops and food stalls.", image: "https://via.placeholder.com/150" },
    ],
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const openEventDetails = (event) => {
    setSelectedEvent(event);
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 flex border rounded-lg shadow-lg overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 flex flex-col justify-center">
        <ul className="space-y-1">
          {categories.map((category) => (
            <li
              key={category}
              className={`p-4 text-center font-bold cursor-pointer ${
                selectedCategory === category
                  ? "bg-white text-blue-600 border-r-4 border-blue-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 bg-white p-6">
        <h3 className="text-xl font-bold mb-4">{selectedCategory}</h3>
        <div
          className="grid grid-cols-2 gap-6 overflow-y-auto"
          style={{
            height: "525px", // Fixed height for the grid container
            overflowY: "auto", // Enable scrolling
            alignContent: "start", // Prevent stretching when fewer events exist
          }}
        >
        {poiEvents[selectedCategory]?.map((event, index) => (
            <div
              key={index}
              className="bg-blue-100 rounded-lg overflow-hidden shadow-lg hover:shadow-xl cursor-pointer"
              onClick={() => openEventDetails(event)}
              style={{ minHeight: "250px", maxHeight: "250px" }} // Prevent stretching
            >
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-32 object-cover"
                />
              )}
              <div className="p-4">
                <h4 className="font-bold text-lg">{event.title}</h4>
                <p className="text-sm text-gray-600">{event.openTimes}</p>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-2">{selectedEvent.title}</h3>
            <img
              src={selectedEvent.image}
              alt={selectedEvent.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <p className="text-gray-700">
              <strong>Open Times:</strong> {selectedEvent.openTimes}
            </p>
            <p className="text-gray-700 mt-2">
              <strong>Description:</strong> {selectedEvent.description}
            </p>
            <div className="mt-4 text-right">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={closeEventDetails}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;