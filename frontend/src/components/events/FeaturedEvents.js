import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const FeaturedEvents = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;


  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      try {
        const response = await fetch(API_URL + "events/featured/");
        if (!response.ok) throw new Error("Failed to fetch featured events");
        
        const data = await response.json();
        setFeaturedEvents(data);
      } catch (error) {
        console.error("Error fetching featured events:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedEvents();
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
                <h4 className="font-bold text-lg">{event.title}</h4>
                <p className="text-sm text-gray-600">{event.openTimes}</p>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
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
