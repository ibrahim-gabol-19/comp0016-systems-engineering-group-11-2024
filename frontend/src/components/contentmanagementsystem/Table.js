import React, { useState } from "react";

const Table = () => {
  const [selectedCategory, setSelectedCategory] = useState("Museums");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const categories = ["Forum", "Reporting", "Events", "News"];

  const sampleData = {
    Forum: [
      { title: "Big Ben", openTimes: "9:00 AM - 6:00 PM", description: "Iconic clock tower located in London.", image: "https://via.placeholder.com/150" },
      { title: "Tower of London", openTimes: "10:00 AM - 5:30 PM", description: "Historic castle on the River Thames.", image: "https://via.placeholder.com/150" },
      { title: "London Eye", openTimes: "10:00 AM - 8:00 PM", description: "Famous observation wheel offering panoramic views.", image: "https://via.placeholder.com/150" },
      { title: "The Shard", openTimes: "9:00 AM - 10:00 PM", description: "Tallest building in London with an observation deck.", image: "https://via.placeholder.com/150" },
    ],
    Reporting: [
      { title: "British Museum", openTimes: "10:00 AM - 6:00 PM", description: "Explore world history and culture.", image: "https://via.placeholder.com/150" },
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
    <div className="max-w-screen-2xl mx-auto mt-10 flex border-2 border-gray-700 rounded-3xl shadow-lg overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/6 bg-gray-100 flex flex-col">
        <ul className="space-y-2 py-4">
          {categories.map((category) => (
            <li
              key={category}
              className={`p-4 text-center font-semibold cursor-pointer rounded-full transition-colors ${
                selectedCategory === category
                  ? "bg-white text-white-600 border-2 border-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </li>
          ))}
        </ul>
      </div>

     {/* Main Content */}
<div className="w-5/6 bg-white p-6 overflow-auto">
  <h3 className="text-2xl font-bold mb-4 text-gray-800">{selectedCategory}</h3>
  <div
    className="grid grid-cols-3 gap-8 overflow-y-auto"
    style={{
      height: "700px", // Fixed height for the grid container
      alignContent: "start", // Prevent stretching when fewer events exist
    }}
  >
    {sampleData[selectedCategory]?.map((event, index) => (
      <div
        key={index}
        className="bg-green-50 rounded-3xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer transition-transform"
        onClick={() => openEventDetails(event)}
      >
        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-48 object-cover rounded-t-3xl" // Fixed height for image
          />
        )}
        <div className="p-4">
          <h4 className="font-bold text-lg text-gray-800">{event.title}</h4>
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
          <div className="bg-white rounded-3xl shadow-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-800">{selectedEvent.title}</h3>
            <img
              src={selectedEvent.image}
              alt={selectedEvent.title}
              className="w-full h-48 object-cover rounded-3xl mb-4"
            />
            <p className="text-gray-700">
              <strong>Open Times:</strong> {selectedEvent.openTimes}
            </p>
            <p className="text-gray-700 mt-2">
              <strong>Description:</strong> {selectedEvent.description}
            </p>
            <div className="mt-4 text-right">
              <button
                className="px-6 py-2 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition"
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
