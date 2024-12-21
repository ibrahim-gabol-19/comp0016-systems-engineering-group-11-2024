import React, { useRef, useState } from "react";

import CompulsoryOneLineEditor from "../../components/contentmanagementsystem/detailed/CompulsoryOneLineEditor";
import Date from "../../components/contentmanagementsystem/detailed/Date";
import MainImage from "../../components/contentmanagementsystem/detailed/MainImage";
import Description from "../../components/contentmanagementsystem/detailed/Description";

import { useParams } from "react-router-dom";
import Editor from "../../components/contentmanagementsystem/detailed/Editor";
import Quill, { Delta } from "quill";

const DetailedArticlePage = () => {
  const quillRef = useRef(); // Ref for the Quill container
  const quillRefTitle = useRef();
  const quillRefAuthor = useRef();
  const quillRefDescription = useRef();
  const quillRefMain = useRef();

  const category = "Articles";
  const [isEditing, setIsEditing] = useState(true); 

  //     - News: Title, Main Image, Author, Date, Description, How long to read, Table of Contents
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

  return (
    <div>
      <div>
        <h1>ArticlePage</h1>

        <CompulsoryOneLineEditor
        ref={quillRefTitle} />
        <MainImage />
        <CompulsoryOneLineEditor 
        ref={quillRefAuthor}/>
        <Date/>
        <Description />
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
      <div className="w-screen h-screen flex justify-center items-center overflow-hidden relative">
        {/* Conditionally render either editor or preview */}
        {isEditing ? (
          <div>
            <div className="">
              <Editor
                ref={quillRef}
                defaultValue={defaultValue}
                style={{
                  width: "100%", // Ensure the editor takes up the full width of its container
                  height: "100%", // Ensure the editor takes up the full height of its container
                }}
              />
            </div>
            <div className=" ">
              <Editor
                ref={quillRefTitle}
                style={{
                  width: "100%", // Ensure the editor takes up the full width of its container
                  height: "100%", // Ensure the editor takes up the full height of its container
                }}
              />
            </div>
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

export default DetailedArticlePage;
