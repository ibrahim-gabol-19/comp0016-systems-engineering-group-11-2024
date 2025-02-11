import React, { useRef, useState, useEffect, useCallback } from "react";
import TitleEditor from "../../components/contentmanagementsystem/detailed/TitleEditor";
import NoToolbarEditor from "../../components/contentmanagementsystem/detailed/NoToolbarEditor.js";
import DateTime from "../../components/contentmanagementsystem/detailed/DateTime.js";
import MainImage from "../../components/contentmanagementsystem/detailed/MainImage";
import { useParams } from "react-router-dom"; // For dynamic routing
import axios from "axios";

// Custom debounce hook
function useDebounce(func, delay) {
  const timeoutRef = useRef(null);

  const debouncedFunc = useCallback((...args) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      func(...args);
    }, delay);
  }, [func, delay]);

  return debouncedFunc;
}

const NEW_EVENT_ID = "0";
const DetailedEventPage = () => {
  const quillRefTitle = useRef(null);
  const quillRefDescription = useRef(null);
  const quillRefLocation = useRef(null);
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

  const debouncedSetTitle = useDebounce(setTitle, 300);
  const debouncedSetDescription = useDebounce(setDescription, 300);
  const debouncedSetLocation = useDebounce(setLocation, 300);

  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  // *** MISSING DECLARATIONS - THIS WAS THE PROBLEM ***
  const [debouncedTitle, setDebouncedTitle] = useState("");
  const [debouncedDescription, setDebouncedDescription] = useState("");
  const [debouncedLocation, setDebouncedLocation] = useState("");

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle); // Update input state immediately
    // setDebouncedTitle(newTitle); // Update debounced state
  };

  const handleDescriptionChange = (newDescription) => {
    setDescription(newDescription); // Update input state immediately
    // setDebouncedDescription(newDescription); // Update debounced state
  };

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation); // Update input state immediately
    // setDebouncedLocation(newLocation); // Update debounced state
  };

  // useEffect(() => {
  //   debouncedSetTitle(debouncedTitle);
  // }, [debouncedTitle, debouncedSetTitle]);

  // useEffect(() => {
  //   debouncedSetDescription(debouncedDescription);
  // }, [debouncedDescription, debouncedSetDescription]);

  // useEffect(() => {
  //   debouncedSetLocation(debouncedLocation);
  // }, [debouncedLocation, debouncedSetLocation]);

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

  const CommonFields = ({ title, description, location, isFeatured, setIsFeatured, quillRefTitle, quillRefDescription, quillRefLocation, setUploadedFiles }) => (
    <>
      <TitleEditor ref={quillRefTitle} placeholderText="Title" fontSize="16px" defaultValue={title} onTextChange={debouncedSetTitle} />
      <NoToolbarEditor ref={quillRefDescription} placeholderText="Description" fontSize="16px" defaultValue={description} onTextChange={debouncedSetDescription} />
      <MainImage onFilesUploaded={setUploadedFiles} />
      <NoToolbarEditor ref={quillRefLocation} placeholderText="Location" fontSize="16px" defaultValue={location} onTextChange={debouncedSetLocation} />
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
  );

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
      <CommonFields
        title={title}
        description={description}
        location={location}
        isFeatured={isFeatured}
        setIsFeatured={setIsFeatured}
        quillRefTitle={quillRefTitle}
        quillRefDescription={quillRefDescription}
        quillRefLocation={quillRefLocation}
        setUploadedFiles={setUploadedFiles}
      />
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
