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
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isEditing, setIsEditing] = useState(true);

  // Handles file upload and updates the state
  const handleFilesUploaded = (acceptedFiles) => {
    console.log("Uploaded Files:", acceptedFiles); // Log uploaded files to ensure they're correct
    setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  // Saves the content and uploaded files
  const handleSave = async () => {
    console.log("Save button clicked");

    const titleEditor = quillRefTitle.current;
    const mainEditor = quillRefMain.current;
    const authorEditor = quillRefAuthor.current;
    const descriptionEditor = quillRefDescription.current;

    // Access editor content using .root.innerText
    const title = titleEditor.root.innerText;
    const mainContent = mainEditor.root.innerText;
    const author = authorEditor.root.innerText;
    const description = descriptionEditor.root.innerText;

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
    

    // Add uploaded files to formData, log each file to ensure correct data
    if (uploadedFiles.length > 0) {
      uploadedFiles.forEach((file, index) => {
        console.log(`Appending file: ${file.name}`);
        formData.append(`file${index}`, file); // Append file to FormData
      });
    } else {
      console.error("No files uploaded");
    }

    try {
      // Send data to the backend API
      const response = await axios.post('http://127.0.0.1:8000/articles/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure it’s form-data
        },
      });
      console.log('Data saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving data:', error);
      // Handle error if needed, such as displaying error messages to the user
    }
  };

  return (
    <div>
      <div className="pl-6">
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

      <div className="flex justify-center items-center overflow-auto relative">
        {isEditing ? (
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
          <div className="w-screen h-full justify-center overflow-auto p-4 bg-gray-100 rounded">
            {/* Preview content goes here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedArticlePage;
