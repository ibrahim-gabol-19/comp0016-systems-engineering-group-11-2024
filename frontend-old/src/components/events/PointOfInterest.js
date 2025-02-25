import React, { useState } from "react";

const PointOfInterest = () => {
  const [selectedCategory, setSelectedCategory] = useState("Landmarks");

  const categories = ["Landmarks", "Museums", "Parks", "Other"];

  // Sample events data for each category
  const poiEvents = {
    Landmarks: [
      { title: "Big Ben", openTimes: "9:00 AM - 6:00 PM", description: "Iconic clock tower located in London.", image: "https://picsum.photos/850" },
      { title: "Tower of London", openTimes: "10:00 AM - 5:30 PM", description: "Historic castle on the River Thames.", image: "https://picsum.photos/750" },
      { title: "London Eye", openTimes: "10:00 AM - 8:00 PM", description: "Famous observation wheel offering panoramic views.", image: "https://picsum.photos/1000" },
      { title: "The Shard", openTimes: "9:00 AM - 10:00 PM", description: "Tallest building in London with an observation deck.", image: "https://picsum.photos/915" },
      { title: "Buckingham Palace", openTimes: "9:00 AM - 7:00 PM", description: "The official residence of the British monarch.", image: "https://picsum.photos/910" },
      { title: "Stonehenge", openTimes: "9:00 AM - 5:00 PM", description: "Prehistoric monument consisting of large stone circles.", image: "https://picsum.photos/1500" },
      { title: "Westminster Abbey", openTimes: "9:30 AM - 3:30 PM", description: "Historic church and burial site of many monarchs.", image: "https://picsum.photos/720" },
      { title: "London Bridge", openTimes: "Open 24 hours", description: "Iconic bridge spanning the River Thames.", image: "https://picsum.photos/760#" },
    ],
    Museums: [
      { title: "British Museum", openTimes: "10:00 AM - 6:00 PM", description: "Explore world history and culture.", image: "https://picsum.photos/150" },
      { title: "Natural History Museum", openTimes: "10:00 AM - 5:50 PM", description: "Discover the wonders of the natural world.", image: "https://picsum.photos/6750" },
    ],
    Parks: [
      { title: "Hyde Park", openTimes: "Open 24 hours", description: "Relax in one of London's largest parks.", image: "https://picsum.photos/950" },
    ],
    Other: [
      { title: "Camden Market", openTimes: "10:00 AM - 7:00 PM", description: "Browse eclectic shops and food stalls.", image: "https://picsum.photos/550" },
    ],
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const openEventDetails = (event) => {
    alert(`Redirecting to detailed page for: ${event.title}`);
  };

  return (
    <div className="max-w-6xxl mx-auto mt-14">
      <h2 className="text-2xl font-bold px-6 mb-8">Points of Interest</h2>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-1/6 bg-white flex flex-col justify-top">
          <ul className="space-y-3">
            {categories.map((category) => (
              <li
                key={category}
                className={`p-4 text-center font-bold cursor-pointer ${
                  selectedCategory === category
                    ? "bg-gray-200 text-green-600 border-r-4 border-green-600"
                    : "bg-white text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="w-5/6 bg-white p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-4">{selectedCategory}</h3>
          <div
            className="grid grid-cols-3 gap-6 overflow-y-auto"
            style={{
              height: "525px",
              overflowY: "auto",
              alignContent: "start",
            }}
          >
            {poiEvents[selectedCategory]?.map((event, index) => (
              <div
                key={index}
                className="bg-green-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl cursor-pointer"
                onClick={() => openEventDetails(event)}
                style={{ minHeight: "250px", maxHeight: "250px" }}
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
      </div>
    </div>
  );
};

export default PointOfInterest;
