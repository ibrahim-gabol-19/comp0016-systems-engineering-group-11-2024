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
    <>
      {featuredEvents.length > 0 ? (
        <div className="max-w-6xl mx-auto mt-14 md:px-13">
          <h2 className="text-2xl font-bold px-6 mt-8 flex justify-center">Featured Events</h2>
          <div className="flex justify-center">
            <div className="mt-8 border-t-2 border-gray-300 w-1/2"></div>
          </div>
          <div className="mt-8 flex justify-center">
            <div className="flex justify-center flex-col md:flex-row gap-6 w-full px-6">
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-red-500">Error: {error}</p>
              ) : (
                featuredEvents.map((event, index) => (
                  <div
                    key={index}
                    className="bg-yellow-100 border-2 border-yellow-400 rounded-lg overflow-hidden shadow-lg hover:shadow-xl cursor-pointer w-full md:w-3/5"
                    onClick={() => handleEventClick(event.id)}
                  >
                    <div className="w-full">
                      {event.main_image && (
                        <img
                          src={event.main_image}
                          alt={event.title}
                          className="w-full h-32 object-cover"
                        />
                      )}
                      <div className="p-4 text-center">
                        <h4 className="font-bold text-lg overflow-hidden break-words line-clamp-2 min-h-[3.5rem]">{event.title}</h4>
                        {event.eventType === "scheduled" ? (
                          <p className="text-sm text-gray-600 overflow-hidden break-words line-clamp-1">
                              {new Date(event.date + 'T' + event.time).toLocaleDateString(undefined, {
                                  weekday: 'short', // e.g., "Mon"
                                  month: 'short',   // e.g., "Jan"
                                  day: 'numeric',   // e.g., "15"
                                  year: 'numeric'  // e.g., "2024"
                              })} at {new Date(event.date + 'T' + event.time).toLocaleTimeString(undefined, {
                                  hour: 'numeric',    // e.g., "3"
                                  minute: 'numeric',  // e.g., "30"
                                  hour12: true       // e.g., "AM/PM"
                              })}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-600 overflow-hidden break-words line-clamp-1">
                            {event.openTimes}
                          </p>
                        )}
                        <p className="text-sm text-gray-500 mt-2 overflow-hidden break-words line-clamp-3 ml-6 mr-6">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="flex justify-center">
            <div className="mt-8 border-t-2 border-gray-300 w-1/2"></div>
          </div>
        </div>
      ) : null}
    </>
  );
};


export default FeaturedEvents;
