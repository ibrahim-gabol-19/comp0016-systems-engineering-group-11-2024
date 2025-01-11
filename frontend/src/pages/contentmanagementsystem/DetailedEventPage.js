import React, { useRef, useState } from "react";
import NoToolbarEditor from "../../components/contentmanagementsystem/detailed/NoToolbarEditor.js";
import DateTime from "../../components/contentmanagementsystem/detailed/DateTime.js";
import MainImage from "../../components/contentmanagementsystem/detailed/MainImage";
import { useParams } from "react-router-dom";
import Quill, { Delta } from "quill";

const DetailedEventPage = () => {
  const quillRefTitle = useRef();
  const quillRefAuthor = useRef();
  const quillRefDescription = useRef();

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isEditing, setIsEditing] = useState(true);

  // State for PDF extraction
  const [pdfFile, setPdfFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Ref for hidden file input
  const hiddenFileInput = useRef(null);

  // Debugging state
  const [debugMessages, setDebugMessages] = useState([]);

  const addDebugMessage = (message) => {
    setDebugMessages((prev) => [...prev, message]);
  };

  const handleFilesUploaded = (acceptedFiles) => {
    setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const handleExtractFromPDFClick = () => {
    hiddenFileInput.current.click();
  };

  const handlePDFUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      addDebugMessage("Please upload a valid PDF file.");
    }
  };

  const handleUploadPDF = async () => {
    if (!pdfFile) {
      addDebugMessage("No PDF file selected for upload.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("pdf_file", pdfFile);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/upload-event-pdf/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const textResponse = await response.text();
        addDebugMessage(`Error from backend: ${textResponse}`);
        return;
      }

      const data = await response.json();
      addDebugMessage(`Data received from backend: ${JSON.stringify(data)}`);
      setExtractedData(data);
      populateFields(data);
    } catch (error) {
      addDebugMessage(`Error uploading PDF: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const populateFields = (data) => {
    addDebugMessage(`populateFields called with data: ${JSON.stringify(data)}`);

    if (quillRefTitle.current) {
      quillRefTitle.current.getEditor().setText(data.title || "");
    }
    if (quillRefDescription.current) {
      quillRefDescription.current.getEditor().setText(data.description || "");
    }
    if (quillRefAuthor.current) {
      quillRefAuthor.current.getEditor().setText(data.location || "");
    }

    if (data.date_of_event) {
      const dateInput = document.querySelector("#date-input");
      if (dateInput) {
        dateInput.value = data.date_of_event;
      }
    }

    if (data.time_of_event) {
      const timeInput = document.querySelector("#time-input");
      if (timeInput) {
        timeInput.value = data.time_of_event;
      }
    }

    if (data.images && data.images.length > 0) {
      setUploadedFiles(data.images);
    }
  };

  return (
    <div>
      <div>
        <h1>Event Page</h1>
      </div>
      <div className="p-6">
        <button
          onClick={() => setIsEditing((prev) => !prev)}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
        >
          {isEditing ? "Switch to Preview" : "Switch to Edit"}
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Save
        </button>
        <button
          onClick={handleExtractFromPDFClick}
          className="bg-purple-500 text-white px-4 py-2 rounded ml-4"
        >
          Extract From PDF
        </button>
        <input
          type="file"
          accept="application/pdf"
          ref={hiddenFileInput}
          onChange={handlePDFUpload}
          style={{ display: "none" }}
        />
      </div>

      {pdfFile && (
        <div className="p-6">
          <p>
            <strong>Selected PDF:</strong> {pdfFile.name}
          </p>
          <button
            onClick={handleUploadPDF}
            disabled={isUploading}
            className="bg-orange-500 text-white px-4 py-2 rounded"
          >
            {isUploading ? "Uploading..." : "Upload PDF"}
          </button>
        </div>
      )}

      <div className="flex justify-center items-center overflow-hidden relative">
        {isEditing ? (
          <div>
            <NoToolbarEditor ref={quillRefTitle} placeholderText="Title" />
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
            <h1 className="text-3xl font-bold">{extractedData?.title}</h1>
            <p>{extractedData?.date_of_event}</p>
            <p>{extractedData?.time_of_event}</p>
            <p className="mt-4">{extractedData?.description}</p>
            <p>{extractedData?.location}</p>
            {extractedData?.images?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Event Image ${index + 1}`}
                className="mt-4"
              />
            ))}
          </div>
        )}
      </div>

      {/* Debug Panel */}
      <div
        style={{
          position: "fixed",
          bottom: "0",
          right: "0",
          backgroundColor: "rgba(0,0,0,0.8)",
          color: "white",
          padding: "10px",
          maxHeight: "30%",
          overflowY: "auto",
          width: "100%",
          zIndex: 1000,
        }}
      >
        <h3>Debug Messages</h3>
        <ul style={{ listStyleType: "none", padding: "0" }}>
          {debugMessages.map((msg, index) => (
            <li key={index} style={{ marginBottom: "5px" }}>
              {msg}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DetailedEventPage;