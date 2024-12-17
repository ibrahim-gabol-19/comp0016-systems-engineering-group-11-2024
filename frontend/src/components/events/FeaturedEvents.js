import React, { useState } from "react";

const FeaturedEvents = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const featuredEvents = [
    {
      title: "Tech Conference 2024",
      openTimes: "9:00 AM - 5:00 PM",
      description: "A premier conference showcasing cutting-edge technology.",
      image: "https://via.placeholder.com/150",
    },
    {
      title: "Food Festival",
      openTimes: "11:00 AM - 9:00 PM",
      description: "Taste the best dishes from around the world.",
      image: "https://via.placeholder.com/150",
    },
    {
      title: "Music Concert",
      openTimes: "6:00 PM - 11:00 PM",
      description: "Enjoy live music performances from top artists.",
      image: "https://via.placeholder.com/150",
    },
    {
      title: "Art Exhibition",
      openTimes: "10:00 AM - 6:00 PM",
      description: "Explore stunning artworks from renowned artists.",
      image: "https://via.placeholder.com/150",
    },
    {
      title: "Fitness Workshop",
      openTimes: "7:00 AM - 3:00 PM",
      description: "Learn the best fitness practices for a healthier life.",
      image: "https://via.placeholder.com/150",
    },
  ];

  const openEventDetails = (event) => {
    setSelectedEvent(event);
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  const handleNext = () => {
    setScrollPosition((prev) => Math.min(prev + 3, featuredEvents.length - 3));
  };

  const handlePrev = () => {
    setScrollPosition((prev) => Math.max(prev - 3, 0));
  };

  return (
    <div className="max-w-6xxl mx-auto mt-14 relative">
      <h2 className="text-2xl font-bold px-6 mb-8">Featured Events</h2>
      <div className="overflow-hidden relative">
        {/* Event List */}
        <div
          className="flex transition-transform duration-500"
          style={{
            transform: `translateX(-${scrollPosition * 33.33}%)`,
          }}
        >
          {featuredEvents.map((event, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-1/3 px-2"
              onClick={() => openEventDetails(event)}
            >
              <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg overflow-hidden shadow-lg hover:shadow-xl cursor-pointer">
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
            </div>
          ))}
        </div>

        {/* Left Button */}
        {scrollPosition > 0 && (
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white font-bold text-green-500 outline rounded-lg px-4 py-2 hover:bg-green-500 hover:text-white hover:scale-110 hover:outline transition duration-500 z-10"
            onClick={handlePrev}
          >
            &lt;
          </button>
        )}

        {/* Right Button */}
        {scrollPosition < featuredEvents.length - 3 && (
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white font-bold text-green-500 outline rounded-lg px-4 py-2 hover:bg-green-500 hover:text-white hover:scale-110 hover:outline transition duration-500 z-10"
            onClick={handleNext}
          >
            &gt;
          </button>
        )}
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

export default FeaturedEvents;
