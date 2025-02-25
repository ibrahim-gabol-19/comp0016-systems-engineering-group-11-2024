import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const FeaturedEvents = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios
      .get(API_URL + `events/featured/`)
      .then((response) => {
          const event = response.data;
        setFeaturedEvents(event);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching event:", error);
        setError("Failed to load featured events.");
        setLoading(false);
      });
    // eslint-disable-next-line
  }, []);

  // Handle click on a featured event
  const handleEventClick = (id) => {
    navigate(
      `/events/${id}`
    );
  };

  return (
    <div className="max-w-6xl mx-auto mt-14">
      <h2 className="text-2xl font-bold px-6 mb-8">Featured Events</h2>
      <div className="grid grid-cols-3 gap-6">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : featuredEvents.length > 0 ? (
          featuredEvents.map((event, index) => (
            <div
              key={index}
              className="bg-yellow-100 border-2 border-yellow-400 rounded-lg overflow-hidden shadow-lg hover:shadow-xl cursor-pointer"
              onClick={() => handleEventClick(event.id)}
            >
              {event.main_image && (
                <img
                  src={event.main_image}
                  alt={event.title}
                  className="w-full h-32 object-cover"
                />
              )}
              <div className="p-4">
                <h4 className="font-bold text-lg overflow-hidden break-words line-clamp-2">{event.title}</h4>
                {event.eventType === "scheduled" ? (
                  <p className="text-sm text-gray-600 overflow-hidden break-words line-clamp-1">
                    {event.date}, {event.time}
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 overflow-hidden break-words line-clamp-1">
                    {event.openTimes}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-2 overflow-hidden break-words line-clamp-3">
                  {event.description}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="px-6 text-gray-500">No featured events available.</p>
        )}
      </div>
    </div>
  );
};


export default FeaturedEvents;
