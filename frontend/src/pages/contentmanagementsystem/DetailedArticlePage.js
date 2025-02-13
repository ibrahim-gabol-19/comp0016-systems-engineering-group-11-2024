import React, { useState, useRef, useEffect } from "react";
import TitleEditor from "../../components/contentmanagementsystem/detailed/TitleEditor";
import MainEditor from "../../components/contentmanagementsystem/detailed/MainEditor";
import NoToolbarEditor from "../../components/contentmanagementsystem/detailed/NoToolbarEditor";
import MainImage from "../../components/contentmanagementsystem/detailed/MainImage";
import axios from "axios";
import { useParams } from "react-router-dom";
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

  // Fetch article data when editing an existing article
  useEffect(() => {
    if (articleId !== NEW_ARTICLE_ID) {
      setIsEditing(false); // Initially view preview when editing an existing article

      axios
        .get(API_URL + `articles/${articleId}/`)
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
          API_URL + `articles/${articleId}/`,
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
        await axios.post(API_URL + "articles/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
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

  return (
    <div className="h-[calc(100vh-146px)] w-full">
      <Header />
      <div className="pt-20"></div>
      <div className="flex justify-between px-5">
        <button
          onClick={() => setIsEditing((prev) => !prev)}
          className="bg-blue-500 text-white justify-cetner font-bold rounded-lg  hover:bg-blue-400 active:bg-blue-300 transition active:duration-100 duration-300 px-4 py-2  mr-4"
          aria-label="Toggle edit/preview mode"
        >
          {isEditing ? "Switch to Preview" : "Switch to Edit"}
        </button>
        <button
          onClick={handleSave}
          className="bg-green-500 text-white justify-cetner font-bold rounded-lg  hover:bg-green-400 active:bg-green-300 transition active:duration-100 duration-300 px-4 py-2  mr-4"
          aria-label="Save article"
        >
          Save
        </button>
      </div>

      {errorMessage && (
        <div className="bg-red-500 text-white p-2 rounded mt-4">
          {errorMessage}
        </div>
      )}

      <div className="h-full flex justify-center items-center overflow-auto relative">
        {isEditing ? (
          <div className="w-screen h-full flex relative">
            <div className="h-full w-1/6 "/>
            <div className="w-3/6 flex flex-col h-full py-2 px-3 overflow-y-auto">
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
            <div className="h-full w-1/6"/>
            <div className="w-2/6  px-3 pb-64 flex flex-col justify-center  overflow-hidden">
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
