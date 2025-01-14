import React, { useRef, useState, useEffect } from "react";
import NoToolbarEditor from "../../components/contentmanagementsystem/detailed/NoToolbarEditor.js";
import DateTime from "../../components/contentmanagementsystem/detailed/DateTime.js";
import MainImage from "../../components/contentmanagementsystem/detailed/MainImage";
import { useParams } from "react-router-dom";

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
  const [isDataExtracted, setIsDataExtracted] = useState(false);

  // Ref for hidden file input
  const hiddenFileInput = useRef(null);

  const handleFilesUploaded = (acceptedFiles) => {
    const fileURLs = acceptedFiles.map((file) => URL.createObjectURL(file));
    setUploadedFiles((prevFiles) => [...prevFiles, ...fileURLs]);
  };

  const handleExtractFromPDFClick = () => {
    hiddenFileInput.current.click();
    setIsDataExtracted(false);
  };

  const handlePDFUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
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
      const response = await fetch("http://127.0.0.1:8000/api/upload/event/", {
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

  const populateFields = (data) => {
    if (quillRefTitle.current) {
      quillRefTitle.current.setContents([{ insert: data.title || "" }]);
    }
    if (quillRefDescription.current) {
      quillRefDescription.current.setContents([{ insert: data.description || "" }]);
    }
    if (quillRefAuthor.current) {
      quillRefAuthor.current.setContents([{ insert: data.location || "" }]);
    }

    if (data.date_of_event) {
      const datePicker = document.querySelector("#date-picker");
      if (datePicker) {
        datePicker.value = data.date_of_event;
      }
    }

    if (data.time_of_event) {
      const timePicker = document.querySelector("#time-picker");
      if (timePicker) {
        timePicker.value = data.time_of_event;
      }
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
            className={`${
              isDataExtracted ? "bg-green-500" : "bg-orange-500"
            } text-white px-4 py-2 rounded`}
          >
            {isUploading
              ? "Uploading..."
              : isDataExtracted
              ? "Data successfully extracted!"
              : "Upload PDF"}
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
                className="mt-4 w-32 h-32 object-cover rounded"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedEventPage;




