import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // For dynamic routing
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const DetailedEventPageView = () => {
    const { eventId } = useParams();
    console.log("Event ID from URL:", eventId);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);    
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

  
    useEffect(() => {
      axios
        .get(API_URL + `events/${eventId}/`)
        .then((response) => {
            const event = response.data;
          setEvent(event);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching event:", error);
          setError("Failed to load event. It may not exist.");
          setLoading(false);
        });
        // eslint-disable-next-line
    }, [eventId]);
  
    if (loading) return <p className="text-center text-lg">Loading event details...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!event) return <p className="text-center text-red-500">Event not found.</p>;
  
    const {
      title,
      description,
      time,
      date,
      location,
      event_type,
      poi_type,
      opening_times,
      latitude,
      longitude,
    } = event;

    const handleBack = () => { navigate(-1); };

  return (
    <div className="w-screen h-full flex justify-center items-start overflow-auto p-6 bg-gray-100 rounded-lg">
        <div className="max-w-7xl w-full bg-white p-6 rounded-md shadow-md">
            {/* Back Button */}
            <button
            onClick={handleBack}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                </svg>
            </button>
        {/* Title Section */}
        <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-gray-900 text-center flex-1">
            {title}
            </h1>
            {event_type === "point_of_interest" && !(poi_type === "other") && (
            <p className="text-lg mt-4 text-gray-600 text-center">
                {poi_type.charAt(0).toUpperCase() + poi_type.slice(1, -1)}
            </p>
            )}
        </div>

        <div className="mt-4">                
            {event.main_image && (
                <img
                    src={event.main_image}
                    alt={event.title}
                    className="w-full h-64 object-cover rounded-md shadow-md"
                />
                )}
        </div>

        {/* Description Section */}
        <p className="text-lg mt-6 text-gray-900 text-center break-words overflow-hidden">
            {description}
        </p>

        {event_type === "scheduled" && (
                <p className="text-lg mt-4 text-gray-900 text-center">
                <b>Event Date & Time: </b>

                  {new Date(date + 'T' + time).toLocaleDateString(undefined, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                  })} at {new Date(date + 'T' + time).toLocaleTimeString(undefined, {
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true
                  })}
                </p>)
              }
              {event_type === "point_of_interest" && (
                <p className="text-lg mt-4 text-gray-900 text-center">
                <b>Open Time:</b> {opening_times}
                </p>)
              }

        {/* Map Section */}
        <p className="text-lg mt-4 text-gray-900 text-center">
            <b>Location:</b> {location}
            {longitude && latitude && (
            <MapContainer
                center={[parseFloat(latitude), parseFloat(longitude)]}
                zoom={13}
                style={{ height: "300px", width: "100%" }}
                className="rounded-md"
            >
                <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[parseFloat(latitude), parseFloat(longitude)]}>
                <Popup>{location}</Popup>
                </Marker>
            </MapContainer>
            )}
        </p>
        </div>
    </div>
)};

export default DetailedEventPageView;
