import React, { useRef, useState, useEffect } from "react";
import TitleEditor from "../../components/contentmanagementsystem/detailed/TitleEditor";
import MainEditor from "../../components/contentmanagementsystem/detailed/MainEditor";
import NoToolbarEditor from "../../components/contentmanagementsystem/detailed/NoToolbarEditor";
import MainImage from "../../components/contentmanagementsystem/detailed/MainImage";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";

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

  // Ref for hidden file input
  const hiddenFileInput = useRef(null);

  // Fetch article data when editing an existing article
  useEffect(() => {
    if (articleId !== NEW_ARTICLE_ID) {
      setIsEditing(false); // Initially view preview when editing an existing article

      axios
        .get(`http://127.0.0.1:8000/articles/${articleId}/`)
        .then((response) => {
          const article = response.data;
          setTitle(article.title || "");
          setMainContent(article.content || "");
          setAuthor(article.author || "");
          setDescription(article.description || "");
          if (article.main_image) {
            setUploadedFiles([article.main_image]);
          }
        })
        .catch((error) => {
          console.error("Error fetching article:", error);
          setErrorMessage("Failed to fetch article data. Please try again.");
        });
    }
  }, [articleId]);

  const handleSave = async () => {
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
        await axios.put(
          `http://127.0.0.1:8000/articles/${articleId}/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Article updated successfully!");
      } else {
        // POST operation for creating a new article
        await axios.post("http://127.0.0.1:8000/articles/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Article saved successfully!");
      }
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

  return (
    <div>
            <Header />            
            <div className="pt-20"></div>
      <div className="pl-6">
        <button
          onClick={() => setIsEditing((prev) => !prev)}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
          aria-label="Toggle edit/preview mode"
        >
          {isEditing ? "Switch to Preview" : "Switch to Edit"}
        </button>
        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-4 py-2 rounded"
          aria-label="Save article"
        >
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

      {errorMessage && (
        <div className="bg-red-500 text-white p-2 rounded mt-4">
          {errorMessage}
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
                defaultValue={title}
                onTextChange={setTitle}
              />
              <MainEditor
                ref={quillRefMain}
                placeholderText="Main Content"
                fontSize="16px"
                defaultValue={mainContent}
                onTextChange={setMainContent}
              />
            </div>
            <div className="w-1/6 px-16 overflow-hidden">
              <NoToolbarEditor
                ref={quillRefAuthor}
                placeholderText="Author"
                fontSize="16px"
                defaultValue={author}
                onTextChange={setAuthor}
              />
              <NoToolbarEditor
                ref={quillRefDescription}
                placeholderText="Description"
                fontSize="16px"
                defaultValue={description}
                onTextChange={setDescription}
              />
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
              <p className="text-lg mt-4 text-gray-700 text-center">
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
