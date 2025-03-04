import React, { useRef, useState, useEffect } from "react";
// import TitleEditor from "../../components/contentmanagementsystem/detailed/TitleEditor";
// import NoToolbarEditor from "../../components/contentmanagementsystem/detailed/NoToolbarEditor.js";
import MainImage from "../../components/contentmanagementsystem/detailed/MainImage";
import DateTime from "../../components/contentmanagementsystem/detailed/DateTime.js";
import { useParams, useNavigate } from "react-router-dom"; // For dynamic routing
import Header from "../../components/Header";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import DropdownExtract from "../../components/contentmanagementsystem/detailed/DropdownExtractEvents";

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
 const API_URL = process.env.REACT_APP_API_URL;
  // State for PDF and ICS extraction
  const [pdfFile, setPdfFile] = useState(null);
  const [icsFile, setIcsFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDataExtracted, setIsDataExtracted] = useState(false);

  // Refs for hidden file inputs
  const hiddenFileInputPDF = useRef(null);
  const hiddenFileInputICS = useRef(null);
  const [eventType, setEventType] = useState("scheduled");
  const [poiType, setPoiType] = useState("");
  const [openingTimes, setOpeningTimes] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [position, setPosition] = useState(null);
  const [requiredFields, setRequiredFields] = useState({});
  const navigate = useNavigate();
  


  useEffect(() => {
    if (eventId !== NEW_EVENT_ID) {
      console.log("useEffect is running");
      console.log("event id received was", eventId);
      setIsEditing(false); // initially view preview when clicking box
      const token = localStorage.getItem("token");
      // Fetch article data when editing an existing article
      axios
        .get(API_URL + `events/${eventId}/`, {
          headers: { Authorization: `Bearer ${token}` },  // ✅ Include token
      })
        .then((response) => {
          const event = response.data;
          setTitle(event.title || "");
          setTime(event.time || "");
          setDate(event.date || "");
          setDescription(event.description || "");
          setLocation(event.location || "");
          setEventType(event.event_type || "");
          setPoiType(event.poi_type || "");
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
    // eslint-disable-next-line
  }, [eventId]);


  const handleFilesUploaded = (acceptedFiles) => {
    if (acceptedFiles.length > 1) {
      alert("Only one image can be uploaded.");
      return;
    }
    setUploadedFiles([acceptedFiles[0]]);
  };

  const handleSave = async () => {
  const token=localStorage.getItem('token');
    const newRequiredFields = {};

    if (eventType === "scheduled") {
      if (!title) newRequiredFields.title = true;
      if (!date) newRequiredFields.date = true;
      if (!time) newRequiredFields.time = true;
      if (!description) newRequiredFields.description = true;
      if (!location) newRequiredFields.location = true;

    } else if (eventType === "point_of_interest") {
      if (!title) newRequiredFields.title = true;
      if (!description) newRequiredFields.description = true;
      if (!location) newRequiredFields.location = true;
      if (!poiType) newRequiredFields.poiType = true;
    }

    setRequiredFields(newRequiredFields);

    if (Object.keys(newRequiredFields).length > 0) {
      alert("Please fill in all necessary fields.");
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
    formData.append("opening_times", openingTimes);

    // Check if position is null before setting latitude/longitude
    if (position) {
      formData.append("latitude", position[0]);
      formData.append("longitude", position[1]);
    } else {
      formData.append("latitude", "");
      formData.append("longitude", "");
    }

    if (uploadedFiles.length > 0 && typeof uploadedFiles[0] !== "string") {
      formData.append("main_image", uploadedFiles[0]);
    }

    try {
      if (eventId !== NEW_EVENT_ID) {
        const token = localStorage.getItem("token");
        // PUT operation for updating an existing article

        await axios.put(
          API_URL + `events/${eventId}/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`, 
            },
          }
          );
        

        alert("Event updated successfully!");
      } else {
        // POST operation for creating a new article
        await axios.post(
          API_URL + "events/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`, 
            },
          }
        );
        alert("Event saved successfully!");
      }
    } catch (error) {
      console.error("Error saving or updating event:", error);
      alert("Error saving or updating event. Please try again.");
    }
  };

  const handleExtractFromPDFClick = () => {
    hiddenFileInputPDF.current.click();
    setIsDataExtracted(false);
  };

  const handleExtractFromICSClick = () => {
    hiddenFileInputICS.current.click();
    setIsDataExtracted(false);
  };

  const handlePDFUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    }
  };

  const handleICSUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/calendar") {
      setIcsFile(file);
    }
  };

  const handleUploadPDF = async () => {
    if (!pdfFile) {
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("pdf_file", pdfFile);

    try {
      const response = await fetch(API_URL + "api/upload/event/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setExtractedData(data);
      populateFields(data);
      setIsDataExtracted(true);
    } catch (error) {
      console.error("Error uploading PDF:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadICS = async () => {
    if (!icsFile) {
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("ics_file", icsFile);

    try {
      const response = await fetch(API_URL + "api/upload_ics/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setExtractedData(data);
      populateFields(data);
      setIsDataExtracted(true);
    } catch (error) {
      console.error("Error uploading ICS:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const populateFields = (data) => {
    setEventType("scheduled");
    setTitle(data.title || "");
    setDescription(data.description || "");
    setLocation(data.location || "");

    if (data.date_of_event) {
      // Convert date from dd/mm/yyyy to yyyy-mm-dd format for the date picker
      const [day, month, year] = data.date_of_event.split("/");
      const formattedDate = `${year}-${month}-${day}`;
      setDate(formattedDate);
    }

    if (data.time_of_event) {
      setTime(data.time_of_event);
    }

    if (data.images && data.images.length > 0) {
      setUploadedFiles(data.images);
    }
  };

  useEffect(() => {
    if (isEditing && extractedData) {
      populateFields(extractedData);
    }
  }, [isEditing, extractedData]);

  const fetchSuggestions = async (query) => {
    if (!query) return;
  
    try {
      const controller = new AbortController(); // Allows us to cancel the fetch
      const timeoutId = setTimeout(() => {
        controller.abort(); // Abort the fetch after 3 seconds
        alert("Location not found"); 
      }, 3000);
  
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`,
        { signal: controller.signal }
      );
  
      clearTimeout(timeoutId); // Clear timeout if fetch is successful
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (data.length === 0) {
        alert("Location not found");
      } else {
        setSuggestions(data);
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.warn("Fetch aborted due to timeout");
      } else {
        console.error("Error fetching suggestions:", error);
      }
    }
  };
  
  const handleSelectLocation = (place) => {
    setLocation(place.display_name);
    setPosition([parseFloat(place.lat), parseFloat(place.lon)]);
    setSuggestions([]);
  };

  const handleDeleteLocation = () => {
    setPosition(null);
  };

  const isFieldRequired = (fieldName) => requiredFields[fieldName];

  const handleBack = () => { navigate(-1); };

  return (
    <div>
      <Header />
      <div className="pt-20"></div>
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mb-4 ml-6">
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
      <div className="flex justify-between px-5">
        <div>
          <DropdownExtract
          handleExtractFromPDFClick={handleExtractFromPDFClick}
          handleExtractFromICSClick={handleExtractFromICSClick}
        />
        </div>
        <div>
        <button
          onClick={() => setIsEditing((prev) => !prev)}
          className="bg-blue-500 text-white justify-center font-bold rounded-lg hover:bg-blue-400 active:bg-blue-300 transition active:duration-100 duration-300 px-4 py-2 mr-4"
        >
          {isEditing ? "Switch to Preview" : "Switch to Edit"}
        </button>
  
        <button
          onClick={handleSave}
          className="bg-green-500 text-white justify-center font-bold rounded-lg hover:bg-green-400 active:bg-green-300 transition active:duration-100 duration-300 px-4 py-2 mr-4"
        >
          Save
        </button>
        </div>
  
        <input
          type="file"
          accept="application/pdf"
          ref={hiddenFileInputPDF}
          onChange={handlePDFUpload}
          style={{ display: "none" }}
        />
        <input
          type="file"
          accept="text/calendar"
          ref={hiddenFileInputICS}
          onChange={handleICSUpload}
          style={{ display: "none" }}
        />
      </div>
  
      {pdfFile && (
        <div className="p-6 mt-6">
          <p className="mb-2">
            <strong>Selected PDF:</strong> {pdfFile.name}
          </p>
          <button
            onClick={handleUploadPDF}
            disabled={isUploading}
            className={`${
              isDataExtracted ? "bg-green-500" : "bg-orange-500"
            } text-white justify-center font-bold rounded-lg hover:${
              isDataExtracted ? "bg-green-400" : "bg-orange-400"
            } active:${
              isDataExtracted ? "bg-green-300" : "bg-orange-300"
            } transition active:duration-100 duration-300 px-4 py-2`}
          >
            {isUploading
              ? "Uploading..."
              : isDataExtracted
              ? "Data successfully extracted!"
              : "Upload PDF"}
          </button>
        </div>
      )}
  
      {icsFile && (
        <div className="p-6 mt-6">
          <p className="mb-2">
            <strong>Selected ICS:</strong> {icsFile.name}
          </p>
          <button
            onClick={handleUploadICS}
            disabled={isUploading}
            className={`${
              isDataExtracted ? "bg-green-500" : "bg-orange-500"
            } text-white justify-center font-bold rounded-lg hover:${
              isDataExtracted ? "bg-green-400" : "bg-orange-400"
            } active:${
              isDataExtracted ? "bg-green-300" : "bg-orange-300"
            } transition active:duration-100 duration-300 px-4 py-2`}
          >
            {isUploading
              ? "Uploading..."
              : isDataExtracted
              ? "Data successfully extracted!"
              : "Upload ICS"}
          </button>
        </div>
      )}
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
                className={`w-full p-3 border ${
                  isFieldRequired("title") ? "border-red-500" : "border-gray-300"
                } rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className={`w-full p-3 border ${
                  isFieldRequired("description") ? "border-red-500" : "border-gray-300"
                } rounded-md focus:ring-indigo-500 focus:border-indigo-500 resize-none overflow-auto`}
                rows="3"
                style={{ maxHeight: "200px" }} // Limits growth, enables scrolling
              />
              <MainImage onFilesUploaded={handleFilesUploaded} />
            </div>

            {eventType === "scheduled" && (
              <div className="mt-4">
                <DateTime
                  date={date}
                  time={time}
                  onDateChange={setDate}
                  onTimeChange={setTime}
                  dateClassName={`w-full p-3 border ${
                    isFieldRequired("date") ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
                  timeClassName={`w-full p-3 border ${
                    isFieldRequired("time") ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
                />
              </div>
            )}

            {eventType === "point_of_interest" && (
              <div className="mt-4 space-y-4">
                <label className="block text-sm font-medium text-gray-700">POI Type:</label>
                <select
                  value={poiType}
                  onChange={(e) => setPoiType(e.target.value)}
                  className={`w-full p-3 border ${
                    isFieldRequired("poiType") ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
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
            <div className="mt-4 space-y-4">
              {/* Input Field */}
              <div className="w-full flex space-x-4">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                  }}
                  placeholder="Location"
                  className={`flex-1 p-3 border ${
                    isFieldRequired("location") ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
                />
                <button
                  onClick={() => fetchSuggestions(location)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Find Location
                </button>
              </div>

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
                <div className="relative">
                  <MapContainer
                    center={position}
                    zoom={13}
                    style={{ height: "400px", width: "100%", zIndex: 0 }}
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
                          setPosition([lat, lng]); // Updates position
                        },
                      }}
                    >
                      <Popup>{location}</Popup>
                    </Marker>
                  </MapContainer>
                  <button
                  onClick={handleDeleteLocation}
                  className="absolute bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg"
                  style={{zIndex: 10 }}
                  >
                    Delete Map
                  </button>
                </div>
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