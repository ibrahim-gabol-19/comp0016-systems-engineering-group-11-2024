import React, { useRef, useState, useEffect } from "react";
import TitleEditor from "../../components/contentmanagementsystem/detailed/TitleEditor";
import MainEditor from "../../components/contentmanagementsystem/detailed/MainEditor";
import NoToolbarEditor from "../../components/contentmanagementsystem/detailed/NoToolbarEditor";
import MainImage from "../../components/contentmanagementsystem/detailed/MainImage";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
const API_URL = process.env.REACT_APP_API_URL;
const NEW_ARTICLE_ID = "0";

const DetailedArticlePage = () => {
  const { articleId } = useParams(); // Get the article ID from the route
  const quillRefTitle = useRef();
  const quillRefMain = useRef();
  const quillRefAuthor = useRef();
  const quillRefDescription = useRef();

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isEditing, setIsEditing] = useState(true);
  const [title, setTitle] = useState("");
  const [mainContent, setMainContent] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // State for PDF extraction
  const [pdfFile, setPdfFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDataExtracted, setIsDataExtracted] = useState(false);
    const [requiredFields, setRequiredFields] = useState({});
  

  // Ref for hidden file input
  const hiddenFileInput = useRef(null);

  // Fetch article data when editing an existing article
  useEffect(() => {
    if (articleId !== NEW_ARTICLE_ID) {
      setIsEditing(false); // Initially view preview when editing an existing article

      const token = localStorage.getItem("token");

      axios
        .get(API_URL + `articles/${articleId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        .then((response) => {
          const article = response.data;
          setTitle(article.title || "");
          setMainContent(article.content || "");
          setAuthor(article.author || "");
          setDescription(article.description || "");
          if (article.main_image) {
            setUploadedFiles([article.main_image]);
          }
          setErrorMessage("");
        })
        .catch((error) => {
          console.error("Error fetching article:", error);
          setErrorMessage("Failed to fetch article data. Please try again.");
        });
    }
  }, [articleId]);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const newRequiredFields = {};

    if (!title) newRequiredFields.title = true;
    if (!mainContent) newRequiredFields.mainContent = true;
    if (!author) newRequiredFields.author = true;
    if (!description) newRequiredFields.description = true;

    setRequiredFields(newRequiredFields);

    if (Object.keys(newRequiredFields).length > 0) {
      alert("Please fill in all necessary fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", mainContent);
    formData.append("author", author);
    formData.append("description", description);

    if (uploadedFiles.length > 0 && typeof uploadedFiles[0] !== "string") {
      formData.append("main_image", uploadedFiles[0]); // Append new image
    }

    try {
      if (articleId !== NEW_ARTICLE_ID) {
        // PUT operation for updating an existing article
        const token = localStorage.getItem("token");

        axios.put(API_URL + `articles/${articleId}/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Article updated successfully!");
      } else {
        // POST operation for creating a new article
        await axios.post(API_URL + "articles/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Article saved successfully!");
      }
      setErrorMessage("");
    } catch (error) {
      console.error("Error saving or updating article:", error);
      setErrorMessage("Error saving or updating article. Please try again.");
    }
  };

  const handleFilesUploaded = (acceptedFiles) => {
    if (acceptedFiles.length > 1) {
      alert("Only one image can be uploaded.");
      return;
    }
    setUploadedFiles([acceptedFiles[0]]);
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
      const response = await fetch(`${API_URL}/api/upload/article/`, {
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
    if (quillRefDescription.current) {
      quillRefDescription.current.setContents([{ insert: data.description || "" }]);
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

  const isFieldRequired = (fieldName) => requiredFields[fieldName];

  return (
    <div className="h-[calc(100vh-146px)] w-full">
      <Header />
      <div className="pt-20"></div>
      <div className="flex justify-between px-5">
        <button
          onClick={() => setIsEditing((prev) => !prev)}
          className="bg-blue-500 text-white justify-center font-bold rounded-lg hover:bg-blue-400 active:bg-blue-300 transition active:duration-100 duration-300 px-4 py-2 mr-4"
          aria-label="Toggle edit/preview mode"
        >
          {isEditing ? "Switch to Preview" : "Switch to Edit"}
        </button>
        <button
          onClick={handleSave}
          className="bg-green-500 text-white justify-center font-bold rounded-lg hover:bg-green-400 active:bg-green-300 transition active:duration-100 duration-300 px-4 py-2 mr-4"
          aria-label="Save article"
        >
          Save
        </button>
        <button
          onClick={handleExtractFromPDFClick}
          className="bg-purple-500 text-white justify-center font-bold rounded-lg hover:bg-purple-400 active:bg-purple-300 transition active:duration-100 duration-300 px-4 py-2"
          aria-label="Extract from PDF"
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
            } text-white justify-center font-bold rounded-lg hover:${
              isDataExtracted ? "bg-green-400" : "bg-orange-400"
            } active:${
              isDataExtracted ? "bg-green-300" : "bg-orange-300"
            } transition active:duration-100 duration-300 px-4 py-2`}
          >
            {isUploading
              ? "Uploading..."
              : isDataExtracted
              ? "Data successfully extracted!"
              : "Upload PDF"}
          </button>
        </div>
      )}
  
      {errorMessage && (
        <div className="bg-red-500 text-white p-2 rounded mt-4">
          {errorMessage}
        </div>
      )}
  
      <div className="h-full flex justify-center items-center overflow-auto relative">
        {isEditing ? (
          <div className="w-screen h-full flex relative">
            <div className="h-full w-1/6 border-0"/>
            <div className="w-3/6 pt-4">
            <div className={ ` ${isFieldRequired("title") ? "border-red-500 border-2": null}`}>
              <TitleEditor
                ref={quillRefTitle}
                placeholderText="Title"
                fontSize="60px"
                defaultValue={title}
                onTextChange={setTitle}
              />
              </div>
              <div className={`flex flex-col h-full overflow-y-auto ${isFieldRequired("mainContent") ? "border-red-500 border-2" : "border-gray-300}"}`}>
              <MainEditor
                ref={quillRefMain}
                placeholderText="Main Content"
                fontSize="16px"
                defaultValue={mainContent}
                onTextChange={setMainContent}
              />
              </div>
            </div>
            <div className="h-full w-1/6" />
            <div className="w-2/6 px-3 pb-64 flex flex-col justify-center overflow-hidden pr-8">
            <div className={ `${isFieldRequired("author") ? "border-red-500 border-2" : "border-gray-300}"}`}>
              <NoToolbarEditor
                ref={quillRefAuthor}
                placeholderText="Author"
                fontSize="16px"
                defaultValue={author}
                onTextChange={setAuthor}
              />
              </div>
              <div className={ `${isFieldRequired("description") ? "border-red-500 border-2" : "border-gray-300}"}`}>
              <NoToolbarEditor
                ref={quillRefDescription}
                placeholderText="Description"
                fontSize="16px"
                defaultValue={description}
                onTextChange={setDescription}
              />
              </div>
              <MainImage onFilesUploaded={handleFilesUploaded} />
            </div>
          </div>
        ) : (
          <div className="w-screen h-full flex justify-center items-start overflow-auto p-6 bg-gray-100 rounded-lg shadow-lg">
            <div className="max-w-3xl w-full bg-white p-6 rounded-md shadow-md">
              <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold text-gray-800 text-center flex-1">
                  {title}
                </h1>
                <p className="text-lg text-gray-500 ml-4">{author}</p>
              </div>
              <div className="mt-4">
                {uploadedFiles.length > 0 && uploadedFiles[0] && (
                  <img
                    src={
                      typeof uploadedFiles[0] === "string"
                        ? uploadedFiles[0]
                        : URL.createObjectURL(uploadedFiles[0])
                    }
                    alt="Main"
                    className="w-full h-64 object-cover rounded-md shadow-md"
                  />
                )}
              </div>
              <p className="text-lg mt-6 text-gray-600 italic text-center">
                {description}
              </p>
              <p
                className="text-lg mt-4 text-gray-700 text-center"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {mainContent}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedArticlePage;
