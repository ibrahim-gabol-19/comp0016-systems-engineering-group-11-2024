import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const FeaturedEvents = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

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

  function convert12HourTo24Hour(time12) {
    const [time, modifier] = time12.split(' ');
    let [hours, minutes] = time.split(':');

    if (hours === '12') {
        hours = '00';
    }

    if (modifier === 'PM') {
        hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
}

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
                            {(() => {
                                let time24 = convert12HourTo24Hour(event.time);
                                const dateTimeString = event.date + 'T' + time24;
                                const date = new Date(dateTimeString);
                                if (isNaN(date.getTime())) {
                                    return "";
                                } else {
                                    return `${date.toLocaleDateString(undefined, {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })} at ${date.toLocaleTimeString(undefined, {
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: true
                                    })}`;
                                }
                            })()}
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
