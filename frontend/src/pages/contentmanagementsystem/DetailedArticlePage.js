import React, { useRef, useState, useEffect } from "react";
import TitleEditor from "../../components/contentmanagementsystem/detailed/TitleEditor";
import MainEditor from "../../components/contentmanagementsystem/detailed/MainEditor";
import NoToolbarEditor from "../../components/contentmanagementsystem/detailed/NoToolbarEditor";
import MainImage from "../../components/contentmanagementsystem/detailed/MainImage";
import axios from "axios";

const DetailedArticlePage = () => {
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

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", mainContent);
    formData.append("author", author);
    formData.append("description", description);

    if (uploadedFiles.length > 0) {
      formData.append("main_image", uploadedFiles[0]);
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/articles/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Article saved successfully!");
    } catch (error) {
      alert("Error saving article. Please try again.");
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
    {/* Title and Author Section */}
    <div className="flex items-center justify-between">
      <h1 className="text-4xl font-bold text-gray-800 text-center flex-1">{title}</h1>
      <p className="text-lg text-gray-500 ml-4">{author}</p>
    </div>

    {/* Image Section*/}
    <div className="mt-4">
      {uploadedFiles.length > 0 && uploadedFiles[0] && (
        <img
          src={URL.createObjectURL(uploadedFiles[0])}
          alt="Main Image"
          className="w-full h-64 object-cover rounded-md shadow-md"
        />
      )}
    </div>

    {/* Description Section */}
    <p className="text-lg mt-6 text-gray-600 italic text-center">{description}</p>

    {/* Main Content Section */}
    <p className="text-lg mt-4 text-gray-700 text-center">{mainContent}</p>

    {/* Images */}
    <div className="mt-6 flex justify-center flex-wrap gap-6">
      {uploadedFiles.length > 1 &&
        uploadedFiles.slice(1).map((file, index) => (
          <div key={index} className="text-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
            <p className="text-sm text-gray-700">{file.name}</p>
            <img
              src={URL.createObjectURL(file)}
              alt="Uploaded File"
              className="w-full h-48 object-cover rounded-md mt-2"
            />
          </div>
        ))}
    </div>
  </div>
</div>


        )}
      </div>
    </div>
  );
};

export default DetailedArticlePage;
