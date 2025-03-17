import React, { useState, useEffect, useContext } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CompanyContext } from "../../context/CompanyContext";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const Calendar = () => {
  const [currentWeek, setCurrentWeek] = useState(dayjs());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEventPosition, setSelectedEventPosition] = useState(null);
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [currentDay, setCurrentDay] = useState(dayjs()); // State for mobile day view
  const [isMobileView] = useState(window.innerWidth <= 1000); // Detect mobile

  const today = dayjs(); // Get today's date
  const [highlightToday, setHighlightToday] = useState(false);
  const startOfWeek = currentWeek.startOf("week").add(1, "day");
  const daysOfWeek = Array.from({ length: 7 }, (_, index) =>
    startOfWeek.add(index, "day")
  );
  const { main_color } = useContext(CompanyContext);

  useEffect(() => {
    axios
      .get(API_URL + `events/scheduled/`)
      .then((response) => {
        const event = response.data;
        setEvents(event);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching event:", error);
        setLoading(false);
      });
    // eslint-disable-next-line
  }, []);

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
    navigate(`/events/${id}`);
  };

  // Mobile view navigation
  const handleNextDay = () => {
    setCurrentDay((prevDay) => prevDay.add(1, "day"));
  };

  const handlePrevDay = () => {
    setCurrentDay((prevDay) => prevDay.subtract(1, "day"));
  };

  const lightenColor = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;

    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  };

  return (
    <div className="max-w-6xxl mx-auto mt-10 flex flex-col items-center">
      <p className="text-2xl font-bold mb-4">This Week&apos;s Events</p>
      {/* Navigation for Desktop */}
      <div className="hidden md:block w-[80%]">
        <div className="flex justify-center space-x-4 mb-4">
          <button
            className="text-gray-600 text-2xl hover:text-gray-800 focus:outline-none font-bold scale-125 hover:scale-150"
            onClick={handlePrevWeek}
          >
            &lt;
          </button>
          <button
            className="px-4 py-2  rounded-lg font-bold text-black hover:scale-110  transition active:duration-100 hover:duration-500 duration-500"
            style={{
              color: main_color,
              outline: "solid " + main_color,
              backgroundColor: "white", // Default background color
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "white";
              e.currentTarget.style.outline = "none";
              e.currentTarget.style.backgroundColor = lightenColor(
                main_color,
                20
              ); // Lighter background on hover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = main_color;
              e.currentTarget.style.outline = "solid " + main_color;
              e.currentTarget.style.backgroundColor = "white"; // Reset background on mouse leave
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.color = "white";
              e.currentTarget.style.backgroundColor = lightenColor(
                main_color,
                60
              ); // Even lighter background on active
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.backgroundColor = lightenColor(
                main_color,
                20
              ); // Reset to hover state on mouse up
            }}
            onClick={handleToday}
          >
            Today
          </button>
          <button
            className="text-gray-600 text-2xl hover:text-gray-800 focus:outline-none font-bold scale-125 hover:scale-150"
            onClick={handleNextWeek}
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handlePrevDay}
            className="text-gray-600 text-2xl focus:outline-none font-bold scale-150 px-10"
          >
            &lt;
          </button>
          <h2 className="text-lg font-bold">
            {currentDay.format("DD MMM YYYY")}
          </h2>
          <button
            onClick={handleNextDay}
            className="text-gray-600 text-2xl focus:outline-none font-bold scale-150 px-10"
          >
            &gt;
          </button>
        </div>
        {loading ? (
          <p className="text-center text-gray-500">Loading events...</p>
        ) : (
          <div className="rounded-lg p-4 bg-gray-100">
            {(() => {
              const dayKey = currentDay.format("YYYY-MM-DD");
              let todayEvents = events[dayKey] || [];

              // Sort todayEvents by time
              todayEvents.sort((a, b) => {
                const timeA = dayjs(a.time, ["HH:mm:ss", "HH:mm"]);
                const timeB = dayjs(b.time, ["HH:mm:ss", "HH:mm"]);
                return timeA.isBefore(timeB)
                  ? -1
                  : timeA.isAfter(timeB)
                  ? 1
                  : 0;
              });

              return todayEvents.length > 0 ? (
                todayEvents.map((event, index) => (
                  <div
                    key={index}
                    className="p-2  rounded-lg  cursor-pointer w-2/3 mb-2 mx-auto min-h-[75px] flex flex-col justify-center"
                    onClick={(e) =>
                      isMobileView
                        ? handleEventClick(event.id)
                        : openEventDetails(event, e)
                    }
                    style={{
                      color: "black",
                      backgroundColor: main_color, // Default background color
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = lightenColor(
                        main_color,
                        20
                      ); // Lighter background on hover
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = main_color; // Reset background on mouse leave
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.backgroundColor = lightenColor(
                        main_color,
                        20
                      ); // Reset to hover state on mouse up
                    }}
                  >
                    <p
                      className="font-semibold text-md line-clamp-2 overflow-hidden text-center"
                      title={event.title}
                    >
                      {event.title}
                    </p>
                    <p className="text-sm text-gray-600 text-center">
                      {dayjs(event.time, ["HH:mm:ss", "HH:mm"]).format(
                        "h:mm A"
                      )}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400">No events</p>
              );
            })()}
          </div>
        )}
      </div>

      {/* Desktop View Display loading state */}
      {loading ? (
        <p className="text-center text-gray-500">Loading events...</p>
      ) : (
        <div
          className="hidden md:grid grid-cols-7 gap-2 bg-gray-100 rounded-lg p-6 md:minWidth-1400"
          style={{ height: "400px", minWidth: "80%", maxWidth: "80%" }}
        >
          {daysOfWeek.map((day) => {
            const dayKey = day.format("YYYY-MM-DD");
            const isToday = today.isSame(day, "day");
            const dayEvents = events[dayKey] || [];

            // Sort dayEvents by time
            dayEvents.sort((a, b) => {
              const timeA = dayjs(a.time, ["HH:mm:ss", "HH:mm"]);
              const timeB = dayjs(b.time, ["HH:mm:ss", "HH:mm"]);
              return timeA.isBefore(timeB) ? -1 : timeA.isAfter(timeB) ? 1 : 0;
            });

            return (
              <div
                key={dayKey}
                className="border rounded-lg shadow p-4 flex flex-col"
                style={
                  isToday && highlightToday
                    ? {
                        backgroundColor: lightenColor(main_color, 40),
                        height: "100%",
                      }
                    : { backgroundColor: "white" }
                }
              >
                <h3 className="font-bold text-center text-lg">
                  {day.format("ddd")}
                </h3>
                <p className="font-bold text-sm text-center text-gray-500">
                  {day.format("DD MMM")}
                </p>

                <div
                  className="flex-grow mt-4 space-y-2 overflow-y-auto"
                  style={{ maxHeight: "300px" }}
                >
                  {dayEvents.length > 0 ? (
                    dayEvents.map((event, index) => (
                      <div
                        key={index}
                        className="p-2  rounded-lg  cursor-pointer w-full h-[90px] flex flex-col justify-center"
                        onClick={(e) => openEventDetails(event, e)}
                        style={{
                          color: "black",
                          backgroundColor: main_color,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = lightenColor(
                            main_color,
                            20
                          ); // Lighter background on hover
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = main_color; // Reset background on mouse leave
                        }}
                        onMouseUp={(e) => {
                          e.currentTarget.style.backgroundColor = main_color;
                        }}
                      >
                        <p
                          className="font-semibold text-md line-clamp-2 overflow-hidden text-center break-words"
                          title={event.title}
                        >
                          {event.title}
                        </p>
                        <p className="text-sm text-gray-600 text-center">
                          {dayjs(event.time, ["HH:mm:ss", "HH:mm"]).format(
                            "h:mm A"
                          )}
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
            <h3 className="text-lg font-bold mb-2 overflow-hidden break-words mt-4">
              {selectedEvent.title}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {dayjs(selectedEvent.time, ["HH:mm:ss", "HH:mm"]).format(
                "h:mm A"
              )}
            </p>
            <p className="text-gray-700 mb-6 overflow-hidden break-words line-clamp-3">
              {selectedEvent.description}
            </p>
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
