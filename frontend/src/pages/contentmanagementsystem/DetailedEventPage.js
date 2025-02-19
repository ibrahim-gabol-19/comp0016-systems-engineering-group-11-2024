import React, { useState, useEffect } from "react";
import DateTime from "../../components/contentmanagementsystem/detailed/DateTime.js";
import MainImage from "../../components/contentmanagementsystem/detailed/MainImage";
import { useParams } from "react-router-dom"; // For dynamic routing
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const NEW_EVENT_ID = "0";
const DetailedEventPage = () => {
  const { eventId } = useParams();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isEditing, setIsEditing] = useState(true);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventType, setEventType] = useState("");
  const [poiType, setPoiType] = useState("");
  const [openingTimes, setOpeningTimes] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [position, setPosition] = useState(null);


  useEffect(() => {
    if (eventId !== NEW_EVENT_ID) {
      axios
        .get(`http://127.0.0.1:8000/events/${eventId}/`)
        .then((response) => {
          const event = response.data;
          setTitle(event.title || "");
          setTime(event.time || "");
          setDate(event.date || "");
          setDescription(event.description || "");
          setLocation(event.location || "");
          setEventType(event.event_type || "");
          setPoiType(event.poi_type || "");
          setIsFeatured(event.is_featured || false);
          setOpeningTimes(event.opening_times || "");

          if (event.main_image) {
            setUploadedFiles([event.main_image]);
          }
          if (event.latitude && event.longitude) {
            setPosition([parseFloat(event.latitude), parseFloat(event.longitude)]);
          }
        })
        .catch((error) => {
          console.error("Error fetching event:", error);
          alert("Failed to fetch event data. Please try again.");
        });
    }
  }, [eventId]);

  const handleFilesUploaded = (acceptedFiles) => {
    if (acceptedFiles.length > 1) {
      alert("Only one image can be uploaded.");
      return;
    }
    setUploadedFiles([acceptedFiles[0]]);
  };

  const handleSave = async () => {
    if (eventType === "scheduled" && (!title || !date || !time || !description)) {
      alert("Please fill in all necessary fields for a Scheduled Event before saving.");
      return;
    }
    
    if (eventType === "point_of_interest" && (!title || !description || !location || !poiType)) {
      alert("Please fill in all necessary fields for a Point of Interest before saving.");
      return;
    }
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("date", date);
    formData.append("time", time);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("event_type", eventType);
    formData.append("poi_type", poiType);
    formData.append("is_featured", isFeatured);
    formData.append("opening_times", openingTimes);
    formData.append("latitude", position[0]);
    formData.append("longitude", position[1]);

    if (uploadedFiles.length > 0 && typeof uploadedFiles[0] !== "string") {
      formData.append("main_image", uploadedFiles[0]);
    }

    try {
      if (eventId !== NEW_EVENT_ID) {
        await axios.put(`http://127.0.0.1:8000/events/${eventId}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Event updated successfully!");
      } else {
        await axios.post("http://127.0.0.1:8000/events/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Event saved successfully!");
      }
    } catch (error) {
      console.error("Error saving or updating event:", error);
      alert("Error saving or updating event. Please try again.");
    }
  };

  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
    );
    const data = await res.json();
    setSuggestions(data);
  };

  const handleSelectLocation = (place) => {
    setLocation(place.display_name);
    setPosition([parseFloat(place.lat), parseFloat(place.lon)]);
    setSuggestions([]);
  };


  return (
    <div>
      <div className="p-6 flex justify-end">
        <button
          onClick={() => setIsEditing((prev) => !prev)}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
        >
          {isEditing ? "Switch to Preview" : "Switch to Edit"}
        </button>

        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
      {isEditing ? (
        <div className="flex justify-center items-center h-full w-full p-8">
          {/* Editing Section */}
          <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
            {/* Event Type Selection for New Events */}
            {eventId === NEW_EVENT_ID && (
              <label className="block text-sm font-medium text-gray-700">
                Event Type:
                <select
                  value={eventType}
                  onChange={(e) => {
                    const newType = e.target.value;
                    setEventType(newType);

                    // Reset relevant fields when switching event types
                    if (newType === "scheduled") {
                      setDate("");
                      setTime("");
                      setPoiType("");
                      setOpeningTimes("");
                    } else if (newType === "point_of_interest") {
                      setDate("");
                      setTime("");
                    }
                  }}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Type</option>
                  <option value="scheduled">Scheduled Event</option>
                  <option value="point_of_interest">Point of Interest</option>
                </select>
              </label>
            )}

            <div className="space-y-4 mt-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 resize-none overflow-auto"
                rows="3"
                style={{ maxHeight: "200px" }} // Limits growth, enables scrolling
              />
              <MainImage onFilesUploaded={handleFilesUploaded} />
              <label className="flex items-center space-x-2 text-gray-700">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
                <span className="text-sm font-medium">Featured Event</span>
              </label>
            </div>

            {eventType === "scheduled" && (
              <div className="mt-4">
                <DateTime date={date} time={time} onDateChange={setDate} onTimeChange={setTime} />
              </div>
            )}

            {eventType === "point_of_interest" && (
              <div className="mt-4 space-y-4">
                <label className="block text-sm font-medium text-gray-700">POI Type:</label>
                <select
                  value={poiType}
                  onChange={(e) => setPoiType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select POI Type</option>
                  <option value="landmarks">Landmarks</option>
                  <option value="museums">Museums</option>
                  <option value="parks">Parks</option>
                  <option value="other">Other</option>
                </select>

                <input
                  type="text"
                  value={openingTimes}
                  onChange={(e) => setOpeningTimes(e.target.value)}
                  placeholder="Open Dates & Times"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            )}
            <div className="space-y-4">
              {/* Input Field */}
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  fetchSuggestions(e.target.value);
                }}
                placeholder="Location"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />

              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <ul className="border border-gray-300 rounded-md bg-white shadow-md max-h-60 overflow-auto">
                  {suggestions.map((place) => (
                    <li
                      key={place.place_id}
                      onClick={() => handleSelectLocation(place)}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                    >
                      {place.display_name}
                    </li>
                  ))}
                </ul>
              )}


              {/* Map Display */}
              {position && (
                <MapContainer
                  center={position}
                  zoom={13}
                  style={{ height: "300px", width: "100%" }}
                  className="rounded-md"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    position={position}
                    draggable={true}
                    eventHandlers={{
                      dragend: (e) => {
                        const { lat, lng } = e.target.getLatLng();
                        setPosition([lat, lng]); // Updates position but not location name
                      },
                    }}
                  >
                    <Popup>{location}</Popup>
                  </Marker>
                </MapContainer>
              )}
            </div>
          </div>
        </div>

      ) : (
        <div className="w-screen h-full flex justify-center items-start overflow-auto p-6 bg-gray-100 rounded-lg">
          {/* Preview Event */}
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

            <div className="mt-4">
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
            </div>

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

            {/* Main Content Section */}
            <p className="text-lg mt-4 text-gray-900 text-center">
              <b>Location:</b> {location}
              {position && (
                <MapContainer
                  center={position}
                  zoom={13}
                  style={{ height: "300px", width: "100%" }}
                  className="rounded-md"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={position}>
                    <Popup>{location}</Popup>
                  </Marker>
                </MapContainer>
              )}
            </p>

            {/* Images */}
            <div className="mt-6 flex justify-center flex-wrap gap-6">
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailedEventPage;
