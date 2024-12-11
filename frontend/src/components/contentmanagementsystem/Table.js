import React, { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";

const Table = () => {
  const [selectedCategory, setSelectedCategory] = useState("Forum");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const categories = ["Forum", "Reporting", "Events", "News"];

  const sampleData = {
    Forum: [
      {
        title: "Big Ben",
        openTimes: "9:00 AM - 6:00 PM",
        description: "Iconic clock tower located in London.",
        image: "https://via.placeholder.com/150",
      },
      {
        title: "Tower of London",
        openTimes: "10:00 AM - 5:30 PM",
        description: "Historic castle on the River Thames.",
        image: "https://via.placeholder.com/150",
      },
      {
        title: "London Eye",
        openTimes: "10:00 AM - 8:00 PM",
        description: "Famous observation wheel offering panoramic views.",
        image: "https://via.placeholder.com/150",
      },
      {
        title: "The Shard",
        openTimes: "9:00 AM - 10:00 PM",
        description: "Tallest building in London with an observation deck.",
        image: "https://via.placeholder.com/150",
      },
    ],
    Reporting: [
      {
        title: "British Museum",
        openTimes: "10:00 AM - 6:00 PM",
        description: "Explore world history and culture.",
        image: "https://via.placeholder.com/150",
      },
    ],
    Events: [
      {
        title: "Hyde Park",
        openTimes: "Open 24 hours",
        description: "Relax in one of London's largest parks.",
        image: "https://via.placeholder.com/150",
      },
    ],
    News: [
      {
        title: "Camden Market",
        openTimes: "10:00 AM - 7:00 PM",
        description: "Browse eclectic shops and food stalls.",
        image: "https://via.placeholder.com/150",
      },
    ],
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedCardIndex(null);
  };

  const handleCardClick = (index, event) => {
    setSelectedCardIndex(index);
    setSelectedEvent(event);
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  const handleAddCard = () => {
    alert("Add new card functionality triggered!");
  };

  const onDrop = (acceptedFiles) => {
    setUploadedFiles([...uploadedFiles, ...acceptedFiles]);
    alert(`Uploaded ${acceptedFiles.length} file(s) successfully!`);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
      setIsDragging(false); // Reset dragging state
      alert(`Uploaded ${acceptedFiles.length} file(s) successfully!`);
    },
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      {...getRootProps()}
      className="w-screen h-screen flex overflow-hidden"
    >
      <input {...getInputProps()} ref={fileInputRef} />
      {/* Drag-and-drop overlay */}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 pointer-events-none transition-opacity ${
          isDragging ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="text-gray-500 font-semibold text-center">
          Drag and drop files here to upload
        </p>
      </div>

      {/* Sidebar */}
      <div className="w-1/6 bg-gray-200 flex flex-col text-black shadow-lg">
        <ul className="space-y-2 py-4">
          {categories.map((category) => (
            <li
              key={category}
              className={`p-4 text-center font-semibold cursor-pointer transition-colors ${
                selectedCategory === category
                  ? "bg-white border-r-4 "
                  : "bg-gray-200 hover:bg-gray-300"
              } rounded-r-3xl`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-5/6 bg-gray p-6 overflow-auto">
        <h3 className="text-3xl font-bold mb-4 text-gray-800">
          {selectedCategory}
        </h3>
        <div
          className="grid grid-cols-3 gap-8 overflow-y-auto"
          style={{
            height: "700px",
            alignContent: "start",
          }}
        >
          {/* Add New Card */}
          <div
            className="flex items-center justify-center rounded-3xl bg-gray-200 cursor-pointer"
            onClick={handleAddCard}
            style={{ height: "300px" }}
          >
            <div className="text-gray-600 text-4xl font-bold">+</div>
          </div>

          {/* Existing Cards */}
          {sampleData[selectedCategory]?.map((event, index) => (
            <div
              key={index}
              className={`rounded-3xl overflow-hidden shadow-md cursor-pointer transition-transform ${
                selectedCardIndex === index
                  ? "bg-white border-2 border-gray-600"
                  : "bg-gray-50"
              }`}
              onClick={() => handleCardClick(index, event)}
              style={{ height: "300px" }}
            >
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-1/2 object-cover rounded-t-3xl"
                />
              )}
              <div className="p-4 flex flex-col justify-between h-1/2">
                <h4 className="font-bold text-lg text-gray-800 truncate">
                  {event.title}
                </h4>
                <p className="text-sm text-gray-600 truncate">
                  {event.openTimes}
                </p>
                <p className="text-sm text-gray-500 mt-2 overflow-hidden text-ellipsis line-clamp-2">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Upload Button */}
        <button
          className={`mt-6 px-6 py-2 font-semibold cursor-pointer rounded-half transition-colors text-center ${
            selectedCategory === "Upload"
              ? "bg-white text-gray-600  "
              : "bg-white text-gray-600  hover:text-green-4lib00"
          }`}
          onClick={handleFileUploadClick}
        >
          Upload Files
        </button>
      </div>

      {/* Event Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              {selectedEvent.title}
            </h3>
            <img
              src={selectedEvent.image}
              alt={selectedEvent.title}
              className="w-full h-48 object-cover rounded-3xl mb-4"
            />
            <p className="text-gray-700">
              <strong>Open Times:</strong> {selectedEvent.openTimes}
            </p>
            <p className="text-gray-700 mt-2">
              <strong>Description:</strong> {selectedEvent.description}
            </p>
            <div className="mt-4 text-right">
              <button
                className="px-6 py-2 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition"
                onClick={closeEventDetails}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
