import React, { useRef, useState, useEffect } from "react";
import TitleEditor from "../../components/contentmanagementsystem/detailed/TitleEditor";
import NoToolbarEditor from "../../components/contentmanagementsystem/detailed/NoToolbarEditor.js";
import DateTime from "../../components/contentmanagementsystem/detailed/DateTime.js";
import MainImage from "../../components/contentmanagementsystem/detailed/MainImage";
import { useParams } from "react-router-dom"; // For dynamic routing
import axios from "axios";

const NEW_EVENT_ID = "0";
const DetailedEventPage = () => {
  const quillRefTitle = useRef();
  const quillRefDescription = useRef();
  const quillRefLocation = useRef();
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
          console.error("Error fetching article:", error);
          alert("Failed to fetch article data. Please try again.");
        });
    }
  }, [eventId]);

  const handleSave = async () => {
    if (eventType === "scheduled" && (!title || !date || !time || !description || !location)) {
      alert("Please fill in all fields for a Scheduled Event before saving.");
      return;
    }
    
    if (eventType === "poi" && (!title || !description || !location || !openingTimes || !poiType)) {
      alert("Please fill in all fields for a Point of Interest before saving.");
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
      <div className="p-6 flex justify-between items-center">
        <button onClick={() => setIsEditing((prev) => !prev)} className="bg-blue-500 text-white px-4 py-2 rounded mr-4">
          {isEditing ? "Switch to Preview" : "Switch to Edit"}
        </button>
        <select value={eventType} onChange={(e) => setEventType(e.target.value)} className="border rounded px-2 py-1">
          <option value="">Select Event Type</option>
          <option value="scheduled">Scheduled Event</option>
          <option value="poi">Point of Interest</option>
        </select>
        <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
      </div>
      {isEditing ? (
        <>
        {eventType === "scheduled" && (
          <>
            <TitleEditor ref={quillRefTitle} placeholderText="Title" fontSize="16px" defaultValue={title} onTextChange={setTitle} />
            <NoToolbarEditor ref={quillRefDescription} placeholderText="Description" fontSize="16px" defaultValue={description} onTextChange={setDescription} />
            <DateTime date={date} time={time} onDateChange={setDate} onTimeChange={setTime} />
            <MainImage onFilesUploaded={setUploadedFiles} />
            <NoToolbarEditor ref={quillRefLocation} placeholderText="Location" fontSize="16px" defaultValue={location} onTextChange={setLocation} />
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
        )}
        {eventType === "poi" && (
          <>
            <TitleEditor ref={quillRefTitle} placeholderText="Title" fontSize="16px" defaultValue={title} onTextChange={setTitle} />
            <NoToolbarEditor ref={quillRefDescription} placeholderText="Description" fontSize="16px" defaultValue={description} onTextChange={setDescription} />
            <NoToolbarEditor placeholderText="Opening Times" fontSize="16px" defaultValue={openingTimes} onTextChange={setOpeningTimes} />
            <select value={poiType} onChange={(e) => setPoiType(e.target.value)} className="border rounded px-2 py-1 mt-2">
              <option value="">Select POI Type</option>
              <option value="landmarks">Landmarks</option>
              <option value="museums">Museums</option>
              <option value="parks">Parks</option>
              <option value="other">Other</option>
            </select>
            <MainImage onFilesUploaded={setUploadedFiles} />
            <NoToolbarEditor ref={quillRefLocation} placeholderText="Location" fontSize="16px" defaultValue={location} onTextChange={setLocation} />
            <label className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="form-checkbox"
              />
              <span>Featured Event</span>
            </label>
            <TitleEditor ref={quillRefTitle} placeholderText="Title" fontSize="16px" defaultValue={title} onTextChange={setTitle} />
          </>
        )}
        </>
      ) : (
        <div className="w-screen h-full flex justify-center items-start overflow-auto p-6 bg-gray-100 rounded-lg shadow-lg">
          <div className="max-w-3xl w-full bg-white p-6 rounded-md shadow-md">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold text-gray-800 text-center flex-1">{title}</h1>
              <p className="text-lg text-gray-500 ml-4">{date} {time}</p>
              <p className="text-lg text-gray-500 ml-4">{eventType}</p>
            </div>
            <p className="text-lg mt-6 text-gray-600 italic text-center">{description}</p>
            <p className="text-lg mt-4 text-gray-700 text-center">{location}</p>
            <p className="text-lg mt-4 text-gray-700 text-center">{address}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailedEventPage;
