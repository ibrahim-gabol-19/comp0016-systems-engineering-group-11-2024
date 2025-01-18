import React, { useRef, useState } from "react";
import TitleEditor from "../../components/contentmanagementsystem/detailed/TitleEditor";
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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const handleFilesUploaded = (acceptedFiles) => {
    if (acceptedFiles.length > 1) {
      alert("Only one image can be uploaded.");
      return;
    }
    setUploadedFiles([acceptedFiles[0]]);
  };

  const handleSave = async () => {
    console.log("Save button clicked");

   
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
            <TitleEditor
                ref={quillRefTitle}
                placeholderText="Title"
                fontSize="16px"
                defaultValue={title}
                onTextChange={setTitle}
              />
            <DateTime 
  date={date} 
  time={time} 
  onDateChange={setDate} 
  onTimeChange={setTime} 
/>

            <NoToolbarEditor
                ref={quillRefDescription}
                placeholderText="Description"
                fontSize="16px"
                defaultValue={description}
                onTextChange={setDescription}
              />
            <MainImage onFilesUploaded={handleFilesUploaded} />
            <NoToolbarEditor
                ref={quillRefLocation}
                placeholderText="Location"
                fontSize="16px"
                defaultValue={location}
                onTextChange={setLocation}
              />
          </div>
        ) : (
          <div className="w-screen h-full flex justify-center items-start overflow-auto p-6 bg-gray-100 rounded-lg shadow-lg">
  <div className="max-w-3xl w-full bg-white p-6 rounded-md shadow-md">
    {/* Title and Author Section */}
    <div className="flex items-center justify-between">
      <h1 className="text-4xl font-bold text-gray-800 text-center flex-1">{title}</h1>
      <p className="text-lg text-gray-500 ml-4">{date} {time}</p>
    </div>

    {/* Image Section*/}
    <div className="mt-4">
      {uploadedFiles.length > 0 && uploadedFiles[0] && (
        <img
          src={URL.createObjectURL(uploadedFiles[0])}
          alt="Main Image"
          className="w-full h-64 object-cover rounded-md shadow-md"
        />
      )}
    </div>

    {/* Description Section */}
    <p className="text-lg mt-6 text-gray-600 italic text-center">{description}</p>

    {/* Main Content Section */}
    <p className="text-lg mt-4 text-gray-700 text-center">{location}</p>

    {/* Images */}
    <div className="mt-6 flex justify-center flex-wrap gap-6">
      {uploadedFiles.length > 1 &&
        uploadedFiles.slice(1).map((file, index) => (
          <div key={index} className="text-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
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
    </div>
  );
};

export default DetailedEventPage;
