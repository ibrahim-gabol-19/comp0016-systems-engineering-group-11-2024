import React from "react";

const FeaturedEvents = () => {
  // Placeholder data for Featured Events
  const featuredEvents = [
    {
      title: "Tech Conference 2024",
      openTimes: "9:00 AM - 5:00 PM",
      description: "A premier conference showcasing cutting-edge technology.",
      image: "https://picsum.photos/550",
    },
    {
      title: "Food Festival",
      openTimes: "11:00 AM - 9:00 PM",
      description: "Taste the best dishes from around the world.",
      image: "https://picsum.photos/840",
    },
    {
      title: "Music Concert",
      openTimes: "6:00 PM - 11:00 PM",
      description: "Enjoy live music performances from top artists.",
      image: "https://picsum.photos/830",
    },
  ];

  // Handle click on a featured event
  const handleEventClick = (event) => {
    alert(`Redirecting to detailed page for: ${event.title}`);
  };

  return (
    <div className="max-w-6xl mx-auto mt-14">
      <h2 className="text-2xl font-bold px-6 mb-8">Featured Events</h2>
      <div className="grid grid-cols-3 rows-1 gap-6">
        {featuredEvents.map((event, index) => (
          <div
            key={index}
            className="bg-yellow-100 border-2 border-yellow-400 rounded-lg overflow-hidden shadow-lg hover:shadow-xl cursor-pointer"
            onClick={() => handleEventClick(event)}
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
  );
};

export default FeaturedEvents;
