import React, { useRef, useState } from "react";

import NoToolbarEditor from "../../components/contentmanagementsystem/detailed/NoToolbarEditor.js";
import DateTime from "../../components/contentmanagementsystem/detailed/DateTime.js";
import MainImage from "../../components/contentmanagementsystem/detailed/MainImage";

import axios from "axios";

const DetailedEventPage = () => {
  const quillRefTitle = useRef();
  const quillRefDescription = useRef();
  const quillRefLocation = useRef();

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isEditing, setIsEditing] = useState(true);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleFilesUploaded = (acceptedFiles) => {
    if (acceptedFiles.length > 1) {
      alert("Only one image can be uploaded.");
      return;
    }
    setUploadedFiles([acceptedFiles[0]]);
  };

  const handleSave = async () => {
    console.log("Save button clicked");

    const titleEditor = quillRefTitle.current;
    const descriptionEditor = quillRefDescription.current;
    const locationEditor = quillRefLocation.current;

    // Access editor content using .root.innerText
    const title = titleEditor.root.innerText.trim();
    const description = descriptionEditor.root.innerText.trim();
    const location = locationEditor.root.innerText.trim();

    // Check if essential fields are filled
    if (!title || !date || !time || !description || !location) {
      alert("Please fill in all fields before saving.");
      return;
    }

    // Log content to verify data before sending
    console.log('Title:', title);
    console.log('Date:', date);
    console.log('Time:', time);
    console.log('Description:', description);
    console.log('Location:', location);

    // Prepare the form data to be sent to the backend
    const formData = new FormData();
    formData.append('title', title);
    formData.append('date', date);
    formData.append('time', time);
    formData.append('description', description);
    formData.append('location', location);

    // Add uploaded files to formData (only one image)
    if (uploadedFiles.length > 0) {
      formData.append('main_image', uploadedFiles[0]); // Append the first file as 'main_image'
    } else {
      console.error("No image uploaded");
    }

    try {
      // Send data to the backend API
      const response = await axios.post('http://127.0.0.1:8000/events/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure it’s form-data
        },
      });
      console.log('Data saved successfully:', response.data);
      alert("Event saved successfully!");
    } catch (error) {
      console.error('Error saving data:', error);
      alert("Error saving event. Please try again.");
    }
  };

  return (
    <div>
      <div className="p-6">
        <button
          onClick={() => setIsEditing((prev) => !prev)}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
        >
          {isEditing ? "Switch to Preview" : "Switch to Edit"}
        </button>

        <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
          Save
        </button>
      </div>

      <div className="flex justify-center items-center overflow-hidden relative">
        {isEditing ? (
          <div>
            <NoToolbarEditor ref={quillRefTitle} placeholderText="Title" />
            <DateTime onDateChange={setDate} onTimeChange={setTime} />
            <NoToolbarEditor ref={quillRefDescription} placeholderText="Description" />
            <MainImage onFilesUploaded={handleFilesUploaded} />
            <NoToolbarEditor ref={quillRefLocation} placeholderText="Location" />
          </div>
        ) : (
          <div className="w-1/2 h-4/5 overflow-auto p-4 bg-gray-100 rounded">
            <h1 className="text-3xl font-bold">Preview Title</h1>
            <p className="mt-4">Preview Description</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedEventPage;
