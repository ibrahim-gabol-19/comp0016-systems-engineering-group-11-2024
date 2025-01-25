import React, { useRef, useState } from "react";
import NoToolbarEditor from "../../components/contentmanagementsystem/detailed/NoToolbarEditor.js";
import MainImage from "../../components/contentmanagementsystem/detailed/MainImage";
import { Delta } from "quill";
import MainEditor from "../../components/contentmanagementsystem/detailed/MainEditor";
import TitleEditor from "../../components/contentmanagementsystem/detailed/TitleEditor";

const DetailedArticlePage = () => {
  const quillRefTitle = useRef();
  const quillRefAuthor = useRef();
  const quillRefMain = useRef();

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const category = "Articles";
  const [isEditing, setIsEditing] = useState(true);

  //     - News: Title, Main Image, Author, Date, Description, How long to read, Table of Contents
  const sampleData = {
    Articles: [
      {
        title: "Big Ben: What is it?",
        main_image: "Image goes here",
        author: "Bartholomew Arthur",
        date: "10/10/2001",
        description: "Iconic clock tower located in London.",
        time_to_read: "3 minutes",
        content: `        
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget erat in ante congue iaculis. Morbi vitae consectetur sem, ac lobortis ex. Etiam dapibus neque varius sapien interdum venenatis a id mauris. Integer nec ornare lorem. Nam ultrices mi dui, ac maximus turpis vulputate et. Ut at lectus pulvinar, tristique lorem a, euismod urna. Maecenas turpis augue, sagittis et diam sit amet, ullamcorper molestie nunc. Morbi a dignissim tellus, nec tristique lorem. Aenean tincidunt mi et dui accumsan venenatis. Quisque placerat libero sed dictum finibus.

        Aliquam nec enim non felis accumsan egestas. Aliquam tincidunt blandit augue, non accumsan ipsum efficitur at. Donec maximus mi non est maximus, nec ultrices dolor dictum. Morbi pharetra ac magna eget elementum. Mauris ullamcorper felis in pretium sodales. Nam laoreet orci et erat malesuada tempor. Vestibulum blandit sapien diam, in dictum lectus dapibus quis. Phasellus aliquet, ligula ut tempor blandit, leo diam molestie purus, vel dignissim eros massa non libero. Donec interdum erat at dolor dictum, id accumsan augue scelerisque. Nam pellentesque nisi eget velit fringilla, eu malesuada lectus vulputate.

        Donec luctus blandit felis. Mauris sed gravida ex, eget rutrum massa. Vivamus mattis eget arcu quis posuere. Integer velit neque, bibendum ac ultrices convallis, malesuada at diam. Vivamus risus arcu, luctus ut dui commodo, mattis varius nisi. Morbi efficitur libero eget aliquet blandit. Vestibulum sit amet nisi ultrices urna dignissim malesuada sit amet in mauris. Mauris tincidunt ullamcorper massa et consectetur. Aliquam erat volutpat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.

        Mauris commodo odio eget consectetur finibus. Pellentesque et turpis semper neque consequat consectetur. Donec ac lectus at dolor scelerisque ultricies. Sed imperdiet mauris eget metus hendrerit, vel vulputate lorem ultricies. Phasellus sit amet ipsum nunc. Curabitur diam mi, pharetra sed orci nec, pretium convallis ex. Vivamus non pretium ligula. Fusce ac turpis sit amet quam feugiat pretium. Curabitur tincidunt massa eget orci euismod lobortis. Ut porta, nunc non dapibus dapibus, orci nulla euismod velit, vel tristique tellus lorem vitae eros. Nullam tellus leo, semper at vestibulum id, viverra ac velit. Curabitur id convallis arcu, facilisis faucibus odio. Maecenas nec massa nec massa tempus auctor sed ut nunc. Integer luctus nunc finibus ligula porttitor, vitae volutpat velit fringilla. Proin quis mattis sem.

        Pellentesque eu est eu lectus cursus ullamcorper nec vitae augue. Sed a ex ligula. Integer sodales mi sed gravida congue. Aenean in arcu augue. Cras placerat diam vel urna sagittis consectetur. Cras ornare posuere nibh a lobortis. Fusce quis leo dui. Nam ac efficitur urna. Etiam felis erat, elementum eget mi nec, convallis placerat nisi. Integer varius, dolor eget vestibulum congue, eros quam vulputate massa, congue lacinia diam nibh id diam. In sollicitudin eget nunc nec finibus. Sed ultrices sit amet nisi sit amet venenatis. Phasellus id facilisis justo, sed tristique sem. 
        `,
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
      {/* Toggle between edit and preview */}
      <div className="pl-6">
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
      <div className=" flex justify-center items-center overflow-auto relative">
        {/* Conditionally render either editor or preview */}
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
            <div className="w-1/6 px-16 overflow-hidden ">
              <NoToolbarEditor
                ref={quillRefAuthor}
                placeholderText="Author"
                fontSize="16px"
              />
              <NoToolbarEditor
                ref={quillRefAuthor}
                placeholderText="Location"
                fontSize="16px"
              />
              {/* File Upload */}
              <MainImage onFilesUploaded={handleFilesUploaded} />
            </div>
          </div>
        ) : (
          <div className="w-screen h-full justify-center overflow-auto p-4 bg-gray-100 rounded">
            {/* Card Details (Preview Mode) */}
            <h1 className="text-6xl flex justify-center text-center font-bold">
              {cardData.title}
            </h1>
            <div className="flex justify-center py-6">
              <img src="https://picsum.photos/300" alt={cardData.title} />
            </div>

            <p className="justify-center text-center text-gray-500 font-semibold text-lg ">
              {cardData.author} | {cardData.date}
            </p>
            <p className="mt-4 flex px-64 ">{cardData.content}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedArticlePage;
