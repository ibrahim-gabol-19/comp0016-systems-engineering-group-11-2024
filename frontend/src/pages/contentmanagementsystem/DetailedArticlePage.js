import React, { useRef, useState, useEffect } from "react";
import NoToolbarEditor from "../../components/contentmanagementsystem/detailed/NoToolbarEditor.js";
import DateTime from "../../components/contentmanagementsystem/detailed/DateTime.js";
import MainImage from "../../components/contentmanagementsystem/detailed/MainImage";
import { useParams } from "react-router-dom";
import Editor from "../../components/contentmanagementsystem/detailed/Editor";
import Quill, { Delta } from "quill";
import MainEditor from "../../components/contentmanagementsystem/detailed/MainEditor";
import TitleEditor from "../../components/contentmanagementsystem/detailed/TitleEditor";

const DetailedArticlePage = () => {
  const quillRefTitle = useRef();
  const quillRefAuthor = useRef();
  const quillRefDescription = useRef();
  const quillRefMain = useRef();

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
    setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
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
      const response = await fetch("http://127.0.0.1:8000/api/upload/article/", {
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
    if (quillRefAuthor.current) {
      quillRefAuthor.current.setContents([{ insert: data.author || "" }]);
    }
    if (quillRefMain.current) {
      quillRefMain.current.setContents([{ insert: data.main_content || "" }]);
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
      <div className="pl-6">
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
        <div className="pl-6">
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

      <div className="flex justify-center items-center overflow-auto relative">
        {isEditing ? (
          <div className="w-screen h-full flex relative">
            <div className="w-5/6 px-72 overflow-y-auto">
              <TitleEditor
                ref={quillRefTitle}
                placeholderText="Title"
                fontSize="60px"
              />
              <MainEditor ref={quillRefMain} placeholderText="Main Content" />
            </div>
            <div className="w-1/6 px-16 overflow-hidden">
              <NoToolbarEditor
                ref={quillRefAuthor}
                placeholderText="Author"
                fontSize="16px"
              />
              <MainImage onFilesUploaded={handleFilesUploaded} />
            </div>
          </div>
        ) : (
          <div className="w-screen h-full justify-center overflow-auto p-4 bg-gray-100 rounded">
            <h1 className="text-6xl flex justify-center text-center font-bold">
              {extractedData?.title}
            </h1>
            <div className="flex justify-center py-6">
              {extractedData?.images?.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Article Image ${index + 1}`}
                  className="w-32 h-32 object-cover rounded"
                />
              ))}
            </div>
            <p className="justify-center text-center text-gray-500 font-semibold text-lg ">
              {extractedData?.author}
            </p>
            <p className="mt-4 flex px-64 ">{extractedData?.content}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedArticlePage;


