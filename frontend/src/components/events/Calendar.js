import React, { useState } from "react";
import dayjs from "dayjs";

const Calendar = () => {
  const [currentWeek, setCurrentWeek] = useState(dayjs());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEventPosition, setSelectedEventPosition] = useState(null);

  // Fake event data
  const events = {
    "2024-12-01": [
      { time: "10:00 AM", title: "Team Meeting", description: "Discuss project roadmap." },
    ],
    "2024-12-02": [
      { time: "1:00 PM", title: "Lunch with Client", description: "Meeting with a key client at Cafe X." },
      { time: "3:00 PM", title: "Project Review", description: "Review milestones and deliverables." },
    ],
    "2024-12-05": [
      { time: "9:00 AM", title: "Doctor's Appointment", description: "Routine health check-up." },
    ],
    "2024-12-06": [
      { time: "8:00 AM", title: "Breakfast with John", description: "Catch up with John over breakfast." },
      { time: "12:00 PM", title: "Client Call", description: "Discuss new project details." },
      { time: "3:00 PM", title: "Team Lunch", description: "Weekly lunch with the team." },
      { time: "6:00 PM", title: "Evening Walk", description: "Relaxing walk in the park." },
      { time: "6:00 PM", title: "Evening Walk", description: "Relaxing walk in the park." },
      { time: "6:00 PM", title: "Evening Walk", description: "Relaxing walk in the park." },
      { time: "6:00 PM", title: "Evening Walk", description: "Relaxing walk in the park." },
    ],
  };

  const today = dayjs(); // Get today's date
  const [highlightToday, setHighlightToday] = useState(false);
  const startOfWeek = currentWeek.startOf("week").add(1, "day");
  const daysOfWeek = Array.from({ length: 7 }, (_, index) =>
    startOfWeek.add(index, "day")
  );

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
    const container = e.target.closest('.overflow-y-auto'); // Get the scrollable container
    const containerRect = container.getBoundingClientRect(); // Get container's position
    const eventRect = e.target.getBoundingClientRect(); // Get the event's position
    const containerScrollTop = container ? container.scrollTop : 0; // Get container's scroll position
  
    // Calculate the event's top position relative to the container and scroll
    const top = eventRect.top - containerRect.top + containerScrollTop;
    const left = eventRect.left + window.scrollX; // Get event's left position relative to page
  
    setSelectedEvent(eventData); // Store selected event data
    setSelectedEventPosition({
      top: top, // Set the calculated top position
      left: left, // Set the left position of the event
    });
  };
  
  
  

  const closeEventDetails = () => {
    setSelectedEvent(null);
    setSelectedEventPosition(null);
  };

  return (
    <div className="max-w-6xxl mx-auto mt-10">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold px-6">
          Week of {startOfWeek.format("DD MMM YYYY")}
        </h2>
        <div className="flex items-center space-x-4 px-6">
          <button
            className="text-gray-600 text-2xl hover:text-gray-800 focus:outline-none font-bold hover:scale-110"
            onClick={handlePrevWeek}
          >
            &lt;
          </button>
          <button
          className="px-4 py-2 bg-white text-green-500 outline rounded-lg hover:bg-green-500 hover:text-white hover:scale-110 hover:outline transition duration-500"
          // className="px-4 py-2 bg-green-500 text-white outline rounded-lg hover:scale-110 transition duration-500"
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
      {/* Weekly Calendar */}
      <div
        className="grid grid-cols-7 gap-2 bg-gray-100 rounded-lg p-6"
        style={{ height: "400px" }} // Fixed height
      >
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
              style={{ height: "100%" }} // Take the full height of the grid cell
            >
              <h3 className="font-bold text-center text-lg">{day.format("ddd")}</h3>
              <p className="font-bold text-sm text-center text-gray-500">{day.format("DD MMM")}</p>

              <div
                className={`flex-grow mt-4 space-y-2 overflow-y-auto`}
                style={{ maxHeight: "300px" }} // Limit content height
              >
                {dayEvents.length > 0 ? (
                  dayEvents.map((event, index) => (
                    <div
                      key={index}
                      className="p-2 bg-green-200 rounded-lg hover:bg-green-300 cursor-pointer w-full"
                      onClick={(e) => openEventDetails(event, e)}
                    >
                      <p
                        className="font-semibold text-md line-clamp-2 overflow-hidden"
                        title={event.title}
                      >
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

      {/* Event Modal */}
{selectedEvent && selectedEventPosition && (
  <div
    className="absolute bg-white border shadow-lg rounded-lg p-4 z-10"
    style={{
      top: selectedEventPosition.top + "px", // Position based on event's top value
      left: selectedEventPosition.left + "px", // Position based on event's left value
      width: "200px", // Fixed width for the modal
    }}
  >
    <h3 className="text-lg font-bold">{selectedEvent.title}</h3>
    <p className="text-sm text-gray-500">{selectedEvent.time}</p>
    <p className="text-gray-700 mt-2">{selectedEvent.description}</p>
    <button
      className="mt-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
      onClick={closeEventDetails}
    >
      Close
    </button>
  </div>
)}


    </div>
  );
};

export default Calendar;
