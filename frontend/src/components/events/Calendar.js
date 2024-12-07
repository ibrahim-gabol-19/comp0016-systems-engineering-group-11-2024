import React, { useState } from "react";
import dayjs from "dayjs";

const Calendar = () => {
  const [currentWeek, setCurrentWeek] = useState(dayjs());
  const [selectedEvent, setSelectedEvent] = useState(null);

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
  const startOfWeek = currentWeek.startOf("week").add(1, "day"); // Adjusting for Monday start
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
  
  const openEventDetails = (event) => {
    setSelectedEvent(event);
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={handleToday}
        >
          Today
        </button>
        <div className="flex items-center space-x-4">
          <button
            className="text-gray-600 text-xl hover:text-gray-800 focus:outline-none font-bold"
            onClick={handlePrevWeek}
          >
            &lt;
          </button>
          <button
            className="text-gray-600 text-xl hover:text-gray-800 focus:outline-none font-bold"
            onClick={handleNextWeek}
          >
            &gt;
          </button>
          <h2 className="text-2xl font-bold">
            Week of {startOfWeek.format("DD MMM YYYY")}
          </h2>
        </div>
      </div>

      {/* Weekly Calendar */}
      <div className="grid grid-cols-7 gap-4 bg-gray-100 rounded-lg p-6 shadow-lg">
        {daysOfWeek.map((day) => {
          const dayKey = day.format("YYYY-MM-DD");
          const isToday = today.isSame(day, "day");
          const dayEvents = events[dayKey] || [];

          return (
            <div
              key={dayKey}
              className={`border rounded-lg shadow p-4 flex flex-col ${
                isToday && highlightToday ? "bg-blue-200" : "bg-white"
              }`}
            >
              <h3 className="font-bold text-center text-lg">{day.format("ddd")}</h3>
              <p className="text-sm text-center text-gray-500">
                {day.format("DD MMM")}
              </p>

              <div
                className={`flex-grow mt-4 space-y-2 ${
                  dayEvents.length > 3 ? "max-h-[300px] overflow-y-auto" : ""
                }`}
              >
                {dayEvents.length > 0 ? (
                  dayEvents.map((event, index) => (
                    <div
                      key={index}
                      className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 cursor-pointer w-full"
                      onClick={() => openEventDetails(event)}
                    >
                      <p className="font-semibold">{event.time}</p>
                      <p className="font-semibold text-sm line-clamp-2 overflow-hidden" title={event.title}>
                        {event.title}
                      </p>
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
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-2">{selectedEvent.title}</h3>
            <p className="text-gray-700">
              <strong>Time:</strong> {selectedEvent.time}
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

export default Calendar;
