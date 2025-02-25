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
    { featuredEvents.length > 0 ? (
      <div className="max-w-6xl mx-auto mt-14">
        <h2 className="text-2xl font-bold px-6 mt-8 flex justify-center">Featured Events</h2>
        <div className="flex justify-center">
          <div className="mt-8 border-t-2 border-gray-300 w-1/2"></div> {/* Line */}
        </div>
        <div className="mt-8 gap-6 flex justify-center"> {/* grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 */}
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            featuredEvents.map((event, index) => (
              <div
                key={index}
                className="bg-yellow-100 border-2 border-yellow-400 rounded-lg overflow-hidden shadow-lg hover:shadow-xl cursor-pointer flex justify-center w-2/5" 
                onClick={() => handleEventClick(event.id)}
              >
                <div className="w-full "> {/* Added w-full to contain content within column */}
                  {event.main_image && (
                    <img
                      src={event.main_image}
                      alt={event.title}
                      className="w-full h-32 object-cover"
                    />
                  )}
                  <div className="p-4 text-center">
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
                </div> {/* Close w-full container */}
              </div>
            ))
          )}
        </div>
        <div className="flex justify-center"> {/* line */}
          <div className="mt-8 border-t-2 border-gray-300 w-1/2"></div>
        </div>
      </div>
    ): null}
    </>
  );
};


export default FeaturedEvents;
