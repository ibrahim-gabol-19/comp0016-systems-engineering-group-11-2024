import React, { useRef, useState } from "react";

import NoToolbarEditor from "../../components/contentmanagementsystem/detailed/NoToolbarEditor.js";
import DateTime from "../../components/contentmanagementsystem/detailed/DateTime.js";
import MainImage from "../../components/contentmanagementsystem/detailed/MainImage";

import { useParams } from "react-router-dom";
import Editor from "../../components/contentmanagementsystem/detailed/Editor";
import Quill, { Delta } from "quill";
import MainEditor from "../../components/contentmanagementsystem/detailed/MainEditor";

const DetailedEventPage = () => {
  const quillRef = useRef(); // Ref for the Quill container
  const quillRefTitle = useRef();
  const quillRefAuthor = useRef();
  const quillRefDescription = useRef();
  const quillRefMain = useRef();

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const category = "Articles";
  const [isEditing, setIsEditing] = useState(true);

  // State for PDF extraction
  const [pdfFile, setPdfFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);

  // Ref for hidden file input
  const hiddenFileInput = useRef(null);

  // Events: Title, Main Image, Location, Map embedding, About, Date, Time, Contact
  const sampleData = {
    Articles: [
      {
        title: "Big Ben: What is it?",
        main_image: "Image goes here",
        author: "Bartholomew",
        date: "10/10/2001",
        description: "Iconic clock tower located in London.",
        time_to_read: "3 minutes",
      },
    ],
  };

  const cardData = sampleData[category]?.[0];
  // Default Content for the editor
  const defaultValue = new Delta();
  defaultValue.insert(`${cardData.title}\n`, { bold: true, header: 1 });

  defaultValue.insert(`${cardData.author}\n\n`, { header: 3 });

  if (cardData.image) {
    defaultValue.insert({ image: cardData.image }); // Add image
  }

  defaultValue.insert(`${cardData.date}\n`, {});
  defaultValue.insert(`${cardData.description}\n`, {});

  if (!cardData) {
    return <div>Card not found</div>;
  }

  const handleFilesUploaded = (acceptedFiles) => {
    setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  // Handler for Extract From PDF button click
  const handleExtractFromPDFClick = () => {
    hiddenFileInput.current.click();
  };

  // Handler for PDF file selection
  const handlePDFUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      // You can add additional actions here, such as uploading the file to the backend
      console.log("PDF file selected:", file.name);
      // Example: Set extracted data if you have a mock or placeholder
      // setExtractedData(mockExtractedData);
    } else {
      alert("Please select a valid PDF file.");
    }
  };

  return (
    <div>
      <div>
        <h1>EventPage</h1>
      </div>
      {/* Toggle between edit and preview */}
      <div className="p-6">
        <button
          onClick={() => setIsEditing((prev) => !prev)}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
        >
          {isEditing ? "Switch to Preview" : "Switch to Edit"}
        </button>
        {/* Non-functional save button */}
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Save
        </button>
        {/* Extract From PDF Button */}
        <button
          onClick={handleExtractFromPDFClick}
          className="bg-purple-500 text-white px-4 py-2 rounded ml-4"
        >
          Extract From PDF
        </button>
        {/* Hidden File Input */}
        <input
          type="file"
          accept="application/pdf"
          ref={hiddenFileInput}
          onChange={handlePDFUpload}
          style={{ display: "none" }}
        />
      </div>

      {/* Display selected PDF file name */}
      {pdfFile && (
        <div className="p-6">
          <p>
            <strong>Selected PDF:</strong> {pdfFile.name}
          </p>
          {/* You can add more UI elements here to show extracted data once available */}
        </div>
      )}

      {/* Full-screen container */}
      <div className="flex justify-center items-center overflow-hidden relative">
        {/* Conditionally render either editor or preview */}
        {isEditing ? (
          <div>
            <NoToolbarEditor ref={quillRefTitle} placeholderText="Title" />
            {/* File Upload */}
            <DateTime />
            <NoToolbarEditor
              ref={quillRefDescription}
              placeholderText="Description"
            />

            <MainImage onFilesUploaded={handleFilesUploaded} />

            <NoToolbarEditor ref={quillRefAuthor} placeholderText="Location" />
          </div>
        ) : (
          <div className="w-1/2 h-4/5 overflow-auto p-4 bg-gray-100 rounded">
            {/* Card Details (Preview Mode) */}
            <h1 className="text-3xl font-bold">{cardData.title}</h1>
            <p className="">{cardData.openTimes}</p>
            <p className="mt-4">{cardData.description}</p>
            {cardData.image && (
              <img src={cardData.image} alt={cardData.title} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedEventPage;



