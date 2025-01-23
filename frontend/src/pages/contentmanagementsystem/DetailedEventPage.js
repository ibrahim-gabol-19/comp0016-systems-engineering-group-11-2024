import React, { useRef, useState } from "react";

import NoToolbarEditor from "../../components/contentmanagementsystem/detailed/NoToolbarEditor.js";
import DateTime from "../../components/contentmanagementsystem/detailed/DateTime.js";
import MainImage from "../../components/contentmanagementsystem/detailed/MainImage";

import  { Delta } from "quill";

const DetailedEventPage = () => {
  const quillRefTitle = useRef();
  const quillRefAuthor = useRef();
  const quillRefDescription = useRef();

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const category = "Articles";
  const [isEditing, setIsEditing] = useState(true);

  //     - Events: Title, Main Image, Location, Map embedding, About, Date, Time, Contact
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
    console.log(uploadedFiles);
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
      </div>

      {/* Full-screen container */}
      <div className=" flex justify-center items-center overflow-hidden relative">
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
