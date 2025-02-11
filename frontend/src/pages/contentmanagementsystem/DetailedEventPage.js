import React, { useState, useEffect } from "react";
import DateTime from "../../components/contentmanagementsystem/detailed/DateTime.js";
import MainImage from "../../components/contentmanagementsystem/detailed/MainImage";
import { useParams } from "react-router-dom"; // For dynamic routing
import axios from "axios";

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
  const [address, setAddress] = useState("");
  const [eventType, setEventType] = useState("");
  const [poiType, setPoiType] = useState("");
  const [openingTimes, setOpeningTimes] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);


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
          setAddress(event.address || "");
          setEventType(event.event_type || "");
          setPoiType(event.poi_type || "");
          setIsFeatured(event.is_featured || false);
          setOpeningTimes(event.opening_times || "");

          if (event.main_image) {
            setUploadedFiles([event.main_image]);
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
    formData.append("address", address);
    formData.append("event_type", eventType);
    formData.append("poi_type", poiType);
    formData.append("is_featured", isFeatured);
    formData.append("opening_times", openingTimes);

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

  return (
    <div>
      <h1>{isEditing ? "Edit Event" : "Event Details"}</h1>
      {/* Event Type Selection for New Events */}
      {eventId === NEW_EVENT_ID && (
        <label>
          Event Type:
          <select value={eventType} onChange={(e) => {
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
          }}>
            <option value="">Select Type</option>
            <option value="scheduled">Scheduled Event</option>
            <option value="point_of_interest">Point of Interest</option>
          </select>
        </label>
      )}
      <>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <MainImage onFilesUploaded={handleFilesUploaded} />
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
        <label className="flex items-center space-x-2 mt-2">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="form-checkbox"
          />
          <span>Featured Event</span>
        </label>
      </>


      {eventType === "scheduled" && <DateTime date={date} time={time} onDateChange={setDate} onTimeChange={setTime} />}
      {eventType === "point_of_interest" && (
        <>
          <select value={poiType} onChange={(e) => setPoiType(e.target.value)}>
            <option value="">Select POI Type</option>
            <option value="landmarks">Landmarks</option>
            <option value="museums">Museums</option>
            <option value="parks">Parks</option>
            <option value="other">Other</option>
          </select>
          <input type="text" value={openingTimes} onChange={(e) => setOpeningTimes(e.target.value)} placeholder="Opening Times" />
        </>
      )}
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default DetailedEventPage;
