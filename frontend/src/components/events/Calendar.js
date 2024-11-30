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
  };

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

  const handleCurrentWeek = () => {
    setCurrentWeek(dayjs());
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
        <h2 className="text-2xl font-bold">
          Week of {startOfWeek.format("DD MMM YYYY")}
        </h2>
        <div className="flex space-x-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            onClick={handlePrevWeek}
          >
            Previous
          </button>
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            onClick={handleNextWeek}
          >
            Next
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handleCurrentWeek}
          >
            Current Week
          </button>
        </div>
      </div>

      {/* Weekly Calendar */}
      <div className="grid grid-cols-7 gap-4 bg-gray-100 rounded-lg p-6 shadow-lg">
        {daysOfWeek.map((day) => {
          const dayKey = day.format("YYYY-MM-DD");
          return (
            <div
              key={dayKey}
              className="bg-white border rounded-lg shadow p-4 flex flex-col"
            >
              <h3 className="font-bold text-center text-lg">{day.format("ddd")}</h3>
              <p className="text-sm text-center text-gray-500">
                {day.format("DD MMM")}
              </p>
              <div className="flex-grow mt-4 space-y-2">
                {events[dayKey] ? (
                  events[dayKey].map((event, index) => (
                    <div
                      key={index}
                      className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 cursor-pointer"
                      onClick={() => openEventDetails(event)}
                    >
                      <p className="font-semibold">{event.time}</p>
                      <p>{event.title}</p>
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
