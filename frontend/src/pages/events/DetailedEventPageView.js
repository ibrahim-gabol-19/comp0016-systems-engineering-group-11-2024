import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // For dynamic routing
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const DetailedEventPageView = () => {
    const { eventId } = useParams();
    console.log("Event ID from URL:", eventId);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      axios
        .get(`http://127.0.0.1:8000/events/${eventId}/`)
        .then((response) => {
          setEvent(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching event:", error);
          setError("Failed to load event. It may not exist.");
          setLoading(false);
        });
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
      eventType,
      poiType,
      openingTimes,
      mainImage,
      latitude,
      longitude,
    } = event;


  return (
    <div className="w-screen h-full flex justify-center items-start overflow-auto p-6 bg-gray-100 rounded-lg">
        <div className="max-w-7xl w-full bg-white p-6 rounded-md shadow-md">
        {/* Title Section */}
        <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-gray-900 text-center flex-1">
            {title}
            </h1>
            {eventType === "point_of_interest" && !(poiType === "other") && (
            <p className="text-lg mt-4 text-gray-600 text-center">
                {poiType.charAt(0).toUpperCase() + poiType.slice(1, -1)}
            </p>
            )}
        </div>

        {/* <div className="mt-4">
            {uploadedFiles.length > 0 && uploadedFiles[0] && (
            <img
                src={
                typeof uploadedFiles[0] === "string"
                    ? uploadedFiles[0]
                    : URL.createObjectURL(uploadedFiles[0])
                }
                alt="Main"
                className="w-full h-64 object-cover rounded-md shadow-md"
            />
            )}
        </div> */}

        {/* Description Section */}
        <p className="text-lg mt-6 text-gray-900 text-center break-words overflow-hidden">
            {description}
        </p>

        {eventType === "scheduled" && (
            <p className="text-lg mt-4 text-gray-900 text-center">
            <b>Event Date & Time:</b> On {date} at {time}
            </p>)
            }
            {eventType === "point_of_interest" && (
            <p className="text-lg mt-4 text-gray-900 text-center">
            <b>Open Time:</b> {openingTimes}
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

        {/* Images */}
        {/* <div className="mt-6 flex justify-center flex-wrap gap-6">
            {uploadedFiles.length > 1 &&
            uploadedFiles.slice(1).map((file, index) => (
                <div
                key={index}
                className="text-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
                >
                <p className="text-sm text-gray-700">{file.name}</p>
                <img
                    src={URL.createObjectURL(file)}
                    alt="Uploaded File"
                    className="w-full h-48 object-cover rounded-md mt-2"
                />
                </div>
            ))}
        </div> */}
        </div>
    </div>
)};

export default DetailedEventPageView;
