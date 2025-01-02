import React, { useRef, useState } from "react";
import NoToolbarEditor from "../../components/contentmanagementsystem/detailed/NoToolbarEditor.js";
import MainImage from "../../components/contentmanagementsystem/detailed/MainImage";
import { useParams } from "react-router-dom";
import MainEditor from "../../components/contentmanagementsystem/detailed/MainEditor";
import TitleEditor from "../../components/contentmanagementsystem/detailed/TitleEditor";
import axios from 'axios'; // Import axios for API calls

const DetailedArticlePage = () => {
  const quillRefTitle = useRef();
  const quillRefMain = useRef();
  const quillRefAuthor = useRef();
  const quillRefDescription = useRef();
  const [uploadedFiles, setUploadedFiles] = useState([]); // To store uploaded files (only one file)
  const [isEditing, setIsEditing] = useState(true); // Toggle between editing and preview mode

  // Handles file upload and ensures only one file is uploaded
  const handleFilesUploaded = (acceptedFiles) => {
    if (acceptedFiles.length > 1) {
      alert("Only one image can be uploaded.");
      return;
    }
    setUploadedFiles([acceptedFiles[0]]); // Keep only the first uploaded file
  };

  // Saves the content and uploaded files
  const handleSave = async () => {
    console.log("Save button clicked");

    const titleEditor = quillRefTitle.current;
    const mainEditor = quillRefMain.current;
    const authorEditor = quillRefAuthor.current;
    const descriptionEditor = quillRefDescription.current;

    // Access editor content using .root.innerText
    const title = titleEditor.root.innerText.trim();
    const mainContent = mainEditor.root.innerText.trim();
    const author = authorEditor.root.innerText.trim();
    const description = descriptionEditor.root.innerText.trim();

    // Check if essential fields are filled
    if (!title || !mainContent || !author || !description) {
      alert("Please fill in all fields before saving.");
      return;
    }

    // Log content to verify data before sending
    console.log('Title:', title);
    console.log('Main Content:', mainContent);
    console.log('Author:', author);
    console.log('Description:', description);

    // Prepare the form data to be sent to the backend
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', mainContent);
    formData.append('author', author);
    formData.append('description', description);

    // Add uploaded files to formData (only one image)
    if (uploadedFiles.length > 0) {
      formData.append('main_image', uploadedFiles[0]); // Append the first file as 'main_image'
    } else {
      console.error("No image uploaded");
    }

    try {
      // Send data to the backend API
      const response = await axios.post('http://127.0.0.1:8000/articles/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure it’s form-data
        },
      });
      console.log('Data saved successfully:', response.data);
      alert("Article saved successfully!");
    } catch (error) {
      console.error('Error saving data:', error);
      alert("Error saving article. Please try again.");
    }
  };

  return (
    <div>
      <div className="pl-6">
        {/* Toggle between edit and preview */}
        <button
          onClick={() => setIsEditing((prev) => !prev)}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
        >
          {isEditing ? "Switch to Preview" : "Switch to Edit"}
        </button>
        {/* Save button */}
        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>

      {/* Full-screen container for content */}
      <div className="flex justify-center items-center overflow-auto relative">
        {isEditing ? (
          // Editing mode
          <div className="w-screen h-full flex relative">
            <div className="w-5/6 px-72 overflow-y-auto">
              <TitleEditor ref={quillRefTitle} placeholderText="Title" fontSize="60px" />
              <MainEditor ref={quillRefMain} placeholderText="Main Content" />
            </div>
            <div className="w-1/6 px-16 overflow-hidden">
              <NoToolbarEditor ref={quillRefAuthor} placeholderText="Author" fontSize="16px" />
              <NoToolbarEditor ref={quillRefDescription} placeholderText="Description" fontSize="16px" />
              <MainImage onFilesUploaded={handleFilesUploaded} />
            </div>
          </div>
        ) : (
          // Preview mode
          <div className="w-screen h-full justify-center overflow-auto p-4 bg-gray-100 rounded">
            <h1 className="text-3xl font-bold">{quillRefTitle.current?.root.innerText}</h1>
            <p className="text-xl mt-4">{quillRefAuthor.current?.root.innerText}</p>
            <p className="mt-4">{quillRefDescription.current?.root.innerText}</p>
            <div>
              {uploadedFiles.length > 0 && uploadedFiles.map((file, index) => (
                <div key={index}>
                  <p>{file.name}</p>
                  <img src={URL.createObjectURL(file)} alt={file.name} className="w-1/2" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedArticlePage;
