import React, { useRef, useState, useEffect, useContext } from "react";
import TitleEditor from "../../components/contentmanagementsystem/detailed/TitleEditor";
import MainEditor from "../../components/contentmanagementsystem/detailed/MainEditor";
import NoToolbarEditor from "../../components/contentmanagementsystem/detailed/NoToolbarEditor";
import MainImage from "../../components/contentmanagementsystem/detailed/MainImage";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
import { AIContext } from "../../context/AIContext";

const API_URL = process.env.REACT_APP_API_URL;
const NEW_ARTICLE_ID = "0";

const DetailedArticlePage = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();

  // Editor refs
  const quillRefTitle = useRef();
  const quillRefMain = useRef();
  const quillRefAuthor = useRef();
  const quillRefDescription = useRef();

  // Article fields state
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isEditing, setIsEditing] = useState(true);
  const [title, setTitle] = useState("");
  const [mainContent, setMainContent] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Loading states for AI buttons
  const [isLoadingTitle, setIsLoadingTitle] = useState(false);
  const [isLoadingMainContent, setIsLoadingMainContent] = useState(false);
  const [isLoadingDescription, setIsLoadingDescription] = useState(false);
  const [isLoadingSummariseDescription, setIsLoadingSummariseDescription] = useState(false);

  // AI Context
  const { engine } = useContext(AIContext);
  

  // PDF extraction states
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
      setIsEditing(false);
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

  // Function to suggest an alternative, more appealing title
  const handleSuggestAlternativeTitle = async () => {
    if (!title) {
      alert("Please enter a title first.");
      return;
    }
    if (!engine) {
      alert("AI model is still loading. Please wait.");
      return;
    }
    setIsLoadingTitle(true);
    try {
      await engine.resetChat();
      const messages = [
        {
          role: "system",
          content:
            "Suggest an alternative title that is more appealing for the following title: , dont add any commentary , just generate one title maximum",
        },
        {
          role: "user",
          content: title,
        },
      ];
      let alternativeTitle = "";
      const stream = await engine.chat.completions.create({
        messages,
        temperature: 0.7,
        stream: true,
      });
      for await (const chunk of stream) {
        alternativeTitle += chunk.choices[0]?.delta.content || "";
      }
      setTitle(alternativeTitle);
      if (quillRefTitle.current) {
        quillRefTitle.current.setContents([{ insert: alternativeTitle }]);
      }
    } catch (error) {
      console.error("Error suggesting alternative title:", error);
    }
    setIsLoadingTitle(false);
  };

  // Function to generate detailed main content from a brief description/draft
  const handleGenerateMainContent = async () => {
    if (!mainContent) {
      alert("Please enter a brief description or draft for the main content first.");
      return;
    }
    if (!engine) {
      alert("AI model is still loading. Please wait.");
      return;
    }
    setIsLoadingMainContent(true);
    try {
      await engine.resetChat();
      const messages = [
        {
          role: "system",
          content:
            "You are a creative content assistant. Based on the following description of what the main content should include, generate a detailed and engaging article content of maximum 50 words: **IMPORTANT**Output only the main content, without any additional commentary or questions.**",
        },
        {
          role: "user",
          content: mainContent,
        },
      ];
      let generatedContent = "";
      const stream = await engine.chat.completions.create({
        messages,
        temperature: 0.7,
        stream: true,
      });
      for await (const chunk of stream) {
        generatedContent += chunk.choices[0]?.delta.content || "";
      }
      setMainContent(generatedContent);
      if (quillRefMain.current) {
        quillRefMain.current.setContents([{ insert: generatedContent }]);
      }
    } catch (error) {
      console.error("Error generating main content:", error);
    }
    setIsLoadingMainContent(false);
  };

  // Function to expand a short description into a longer one
  const handleExpandDescription = async () => {
    if (!description) {
      alert("Please enter a short description first.");
      return;
    }
    if (!engine) {
      alert("AI model is still loading. Please wait.");
      return;
    }
    setIsLoadingDescription(true);
    try {
      await engine.resetChat();
      const messages = [
        {
          role: "system",
          content:
            " Expand the following short description into a detailed, engaging, and informative description. Max 30 words: ",
        },
        {
          role: "user",
          content: description,
        },
      ];
      let expandedDescription = "";
      const stream = await engine.chat.completions.create({
        messages,
        temperature: 0.7,
        stream: true,
      });
      for await (const chunk of stream) {
        expandedDescription += chunk.choices[0]?.delta.content || "";
      }
      setDescription(expandedDescription);
      if (quillRefDescription.current) {
        quillRefDescription.current.setContents([{ insert: expandedDescription }]);
      }
    } catch (error) {
      console.error("Error expanding description:", error);
    }
    setIsLoadingDescription(false);
  };

  // Function to summarise an existing long description into a concise summary
  const handleSummariseDescription = async () => {
    if (!description) {
      alert("Please enter a description first.");
      return;
    }
    // Existing description must be at least 30 words 
    if (description.trim().split(/\s+/).length < 30) {
      alert("Description is too short to summarise. Please add more details.");
      return;
    }
    if (!engine) {
      alert("AI model is still loading. Please wait.");
      return;
    }
    setIsLoadingSummariseDescription(true);
    try {
      await engine.resetChat();
      const messages = [
        {
          role: "system",
          content:
            "Summarise the following description into a concise summary paragraph with a maximum of 30 words. Output only the summary without any additional commentary or questions.",
        },
        {
          role: "user",
          content: description,
        },
      ];
      let summarisedDescription = "";
      const stream = await engine.chat.completions.create({
        messages,
        temperature: 0.7,
        stream: true,
      });
      for await (const chunk of stream) {
        summarisedDescription += chunk.choices[0]?.delta.content || "";
      }
      setDescription(summarisedDescription);
      if (quillRefDescription.current) {
        quillRefDescription.current.setContents([{ insert: summarisedDescription }]);
      }
    } catch (error) {
      console.error("Error summarising description:", error);
    }
    setIsLoadingSummariseDescription(false);
  };

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
      formData.append("main_image", uploadedFiles[0]);
    }
    try {
      if (articleId !== NEW_ARTICLE_ID) {
        axios.put(API_URL + `articles/${articleId}/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Article updated successfully!");
      } else {
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

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="w-full overflow-auto">
      <Header />
      <div className="pt-20"></div>
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mb-4 ml-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </button>
      <div className="flex justify-between px-5">
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
        <div>
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
        </div>
      </div>
      {pdfFile && (
        <div className="pl-6 mt-6">
          <p className="mb-2">
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
      <div className="flex justify-center items-center h-full w-full p-8">
        {isEditing ? (
          <div className="w-screen h-full flex justify-center items-start">
            <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
              <div className="flex flex-col items-center">
                <div className="w-3/4 pt-4">
                  <div
                    className={`max-h-[10rem] overflow-y-auto ${
                      isFieldRequired("title")
                        ? "border-red-500 border-2"
                        : ""
                    }`}
                  >
                    <TitleEditor
                      ref={quillRefTitle}
                      placeholderText="Title"
                      fontSize="60px"
                      defaultValue={title}
                      onTextChange={setTitle}
                    />
                  </div>
                  {/* AI Suggest Alternative Title Button */}
                  <div className="mt-2 flex justify-center">
                    <button
                      onClick={handleSuggestAlternativeTitle}
                      className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center"
                    >
                      {isLoadingTitle && (
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          ></path>
                        </svg>
                      )}
                      {isLoadingTitle ? "Loading..." : "Suggest Alternative Title"}
                    </button>
                  </div>
                  <div
                    className={`flex flex-col h-[300px] overflow-y-auto mt-4 ${
                      isFieldRequired("mainContent")
                        ? "border-red-500 border-2"
                        : "border-gray-300"
                    }`}
                  >
                    <MainEditor
                      ref={quillRefMain}
                      placeholderText="Add Main Content or enter a brief description to generate content"
                      defaultValue={mainContent}
                      onTextChange={setMainContent}
                    />
                  </div>
                  {/* AI Generate Main Content Button */}
                  <div className="mt-2 flex justify-center">
                    <button
                      onClick={handleGenerateMainContent}
                      className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center"
                    >
                      {isLoadingMainContent && (
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          ></path>
                        </svg>
                      )}
                      {isLoadingMainContent ? "Loading..." : "Generate Main Content"}
                    </button>
                  </div>
                </div>
                <div className="w-1/2 flex flex-col justify-center overflow-hidden mt-4 space-y-4">
                  <div
                    className={`max-h-[4rem] overflow-y-auto ${
                      isFieldRequired("author")
                        ? "border-red-500 border-2"
                        : "border-gray-300"
                    }`}
                  >
                    <NoToolbarEditor
                      ref={quillRefAuthor}
                      placeholderText="Author"
                      fontSize="16px"
                      defaultValue={author}
                      onTextChange={setAuthor}
                    />
                  </div>
                  <div
                    className={`max-h-[4rem] overflow-y-auto ${
                      isFieldRequired("description")
                        ? "border-red-500 border-2"
                        : "border-gray-300"
                    }`}
                  >
                    <NoToolbarEditor
                      ref={quillRefDescription}
                      placeholderText="Description"
                      fontSize="16px"
                      defaultValue={description}
                      onTextChange={setDescription}
                    />
                  </div>
                  {/* AI Expand and Summarise Description Buttons */}
                  <div className="mt-2 flex justify-center space-x-4">
                    <button
                      onClick={handleExpandDescription}
                      className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center"
                    >
                      {isLoadingDescription && (
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          ></path>
                        </svg>
                      )}
                      {isLoadingDescription ? "Loading..." : "Expand Description"}
                    </button>
                    <button
                      onClick={handleSummariseDescription}
                      className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center"
                    >
                      {isLoadingSummariseDescription && (
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          ></path>
                        </svg>
                      )}
                      {isLoadingSummariseDescription ? "Loading..." : "Summarise Description"}
                    </button>
                  </div>
                  <MainImage onFilesUploaded={handleFilesUploaded} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-screen h-full flex justify-center items-start overflow-auto">
            <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md flex-1">
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
