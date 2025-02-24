import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";


const Calendar = () => {
  const [currentWeek, setCurrentWeek] = useState(dayjs());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEventPosition, setSelectedEventPosition] = useState(null);
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;


  const today = dayjs(); // Get today's date
  const [highlightToday, setHighlightToday] = useState(false);
  const startOfWeek = currentWeek.startOf("week").add(1, "day");
  const daysOfWeek = Array.from({ length: 7 }, (_, index) =>
    startOfWeek.add(index, "day")
  );

  useEffect(() => {
    fetchScheduledEvents();
  }, []);

  const fetchScheduledEvents = async () => {
    try {
      const response = await fetch(API_URL + "events/scheduled/");
      if (!response.ok) throw new Error("Failed to fetch events");
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextWeek = () => {
    setCurrentWeek((prevWeek) => prevWeek.add(7, "day"));
  };

  const handlePrevWeek = () => {
    setCurrentWeek((prevWeek) => prevWeek.subtract(7, "day"));
  };

  const handleToday = () => {
    setCurrentWeek(today); 
    setHighlightToday(true); 
    setTimeout(() => setHighlightToday(false), 2000);
  };
  const openEventDetails = (eventData, e) => {
    const eventRect = e.target.getBoundingClientRect(); // Get the event's position
    const topPosition = eventRect.top + window.scrollY + 50; // Adjusted Y offset
    const leftPosition = eventRect.left + window.scrollX; // Keep X-axis unchanged
  
    setSelectedEvent(eventData);
    setSelectedEventPosition({
      top: topPosition, // Use adjusted top
      left: leftPosition,
    });
  };
  
  

  const closeEventDetails = () => {
    setSelectedEvent(null);
    setSelectedEventPosition(null);
  };

  const handleEventClick = (id) => {
    navigate(
      `/events/${id}`
    );
  };


  return (
    <div className="max-w-6xxl mx-auto mt-10">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold px-6">This Week's Events</p>
          <h2 className="text-md">
            Week of {startOfWeek.format("DD MMM YYYY")}
          </h2>
        </div>
        <div className="flex items-center space-x-4 px-6">
          <button
            className="text-gray-600 text-2xl hover:text-gray-800 focus:outline-none font-bold hover:scale-110"
            onClick={handlePrevWeek}
          >
            &lt;
          </button>
          <button
          className="px-4 py-2 bg-white font-bold text-green-500 outline rounded-lg hover:bg-green-500 hover:text-white hover:scale-110 hover:outline transition duration-500"
          onClick={handleToday}
        >
          Today
        </button>
          <button
            className="text-gray-600 text-2xl hover:text-gray-800 focus:outline-none font-bold hover:scale-110"
            onClick={handleNextWeek}
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Display loading state */}
      {loading ? (
        <p className="text-center text-gray-500">Loading events...</p>
      ) : (
        <div className="grid grid-cols-7 gap-2 bg-gray-100 rounded-lg p-6" style={{ height: "400px" }}>
          {daysOfWeek.map((day) => {
            const dayKey = day.format("YYYY-MM-DD");
            const isToday = today.isSame(day, "day");
            const dayEvents = events[dayKey] || [];

            return (
              <div
                key={dayKey}
                className={`border rounded-lg shadow p-4 flex flex-col ${
                  isToday && highlightToday ? "bg-green-200" : "bg-white"
                }`}
                style={{ height: "100%" }}
              >
                <h3 className="font-bold text-center text-lg">{day.format("ddd")}</h3>
                <p className="font-bold text-sm text-center text-gray-500">{day.format("DD MMM")}</p>

                <div className="flex-grow mt-4 space-y-2 overflow-y-auto" style={{ maxHeight: "300px" }}>
                  {dayEvents.length > 0 ? (
                    dayEvents.map((event, index) => (
                      <div
                        key={index}
                        className="p-2 bg-green-200 rounded-lg hover:bg-green-300 cursor-pointer w-full"
                        onClick={(e) => openEventDetails(event, e)}
                      >
                        <p className="font-semibold text-md line-clamp-2 overflow-hidden" title={event.title}>
                          {event.title}
                        </p>
                        <p className="text-sm text-gray-600">{event.time}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-400">No events</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Event Modal */}
      {selectedEvent && selectedEventPosition && (
        <div
          className="absolute bg-white border shadow-lg rounded-lg p-4 z-10"
          style={{
            top: `${selectedEventPosition.top}px`, // Use dynamically calculated top position
            left: `${selectedEventPosition.left}px`, // Use dynamically calculated left position
            width: "250px",
          }}
        >
          {/* Close Button */}
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 focus:outline-none"
            onClick={closeEventDetails}
          >
            &#10005;
          </button>

          {/* Event Details */}
          <div className="text-center">
            <h3 className="text-lg font-bold mb-2 overflow-hidden break-words line-clamp-2">{selectedEvent.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{selectedEvent.time}</p>
            <p className="text-gray-700 mb-6 overflow-hidden break-words line-clamp-3">{selectedEvent.description}</p>
          </div>

          {/* More Info Button */}
          <button
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
            onClick={() => handleEventClick(selectedEvent.id)} // Replace with functionality
          >
            More info
          </button>
        </div>
      )}
    </div>
  );
};

export default Calendar;
