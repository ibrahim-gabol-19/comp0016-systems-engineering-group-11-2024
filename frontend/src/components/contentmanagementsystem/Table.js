import React, { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import SelectTopBar from "./SelectTopBar";
import DefaultTopBar from "./DefaultTopBar";

const Table = () => {
  const [selectedCategory, setSelectedCategory] = useState("Articles");
  const [selectedCards, setSelectedCards] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const fileInputRef = useRef(null);

  const categories = ["Articles", "Events", "Forum", "Reporting"];

  const navigate = useNavigate();

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
    Articles: [
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
    setSelectedCards([]);
  };

  const handleCardClick = (index) => {
    navigate(
      `/contentmanagementsystem/details/${selectedCategory.toLowerCase()}/${index}`
    );
  };

  const toggleCardSelection = (index) => {
    setSelectedCards((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : [...prevSelected, index]
    );
  };

  const handleAddCardClicked = () => {
    setIsAddingCard(!isAddingCard);
  };

  const handleManualClicked = () => {
    navigate(
      `/contentmanagementsystem/details/${selectedCategory.toLowerCase()}/${
        sampleData[selectedCategory].length + 1
      }`
    );
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

  // Define the functions that will be passed to TopBar as props
  const handleDelete = () => {
    alert("Delete action triggered");
  };

  const handleStar = () => {
    alert("Star action triggered");
  };

  const handleSelectAll = () => {
    const allCards = sampleData[selectedCategory]?.map((_, index) => index);
    setSelectedCards(allCards);
  };

  const handleCancel = () => {
    setSelectedCards([]); // Deselect all cards
  };

  return (
    <div
      {...getRootProps()}
      className="w-screen h-screen flex overflow-hidden relative"
    >
      {/* Selection Top Bar */}
      {selectedCards.length > 0 ? (
        <SelectTopBar
          selectedCards={selectedCards}
          onDelete={handleDelete}
          onStar={handleStar}
          onSelectAll={handleSelectAll}
          onCancel={handleCancel}
        />
      ) : (
        <DefaultTopBar
          onManual={handleManualClicked}
          onUpload={handleFileUploadClick}
        />
      )}

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
                  ? "bg-green-200 border-r-4 "
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
      <div className="w-5/6 bg-gray pl-6 overflow-auto">
        <div
          className="grid grid-cols-3 gap-8 overflow-y-auto"
          style={{
            height: "700px",
            alignContent: "start",
          }}
        >
          {/* Add New Card */}
          <div
            className="flex items-center justify-center rounded-3xl bg-green-100 cursor-pointer group"
            onClick={handleAddCardClicked}
            style={{ height: "300px" }}
          >
            <div
              className={`text-gray-600 text-4xl font-bold ${
                isAddingCard ? "opacity-0" : "opacity-100"
              }`}
            >
              +
            </div>

            {/* Manual Button */}
            <button
              className={`mt-6 px-6 py-2 font-bold cursor-pointer rounded-half transition-opacity text-center ${
                isAddingCard ? "opacity-100" : "opacity-0"
              } ${
                selectedCategory === "Upload"
                  ? "bg-white text-gray-600"
                  : "bg-green-200 text-gray-600 hover:bg-green-300"
              }`}
              onClick={(e) => {
                e.stopPropagation(); // Prevent the click event from triggering the card click
                handleManualClicked();
              }}
              disabled={!isAddingCard} // Disable the button if isAddingCard is false
              style={{
                pointerEvents: isAddingCard ? "auto" : "none", // Prevent interaction when not adding
                opacity: isAddingCard ? 1 : 0, // Make the button appear disabled
              }}
            >
              Manual
            </button>

            {/* Upload Button */}
            <button
              className={`mt-6 px-6 py-2 font-bold cursor-pointer rounded-half transition-opacity text-center ${
                isAddingCard ? "opacity-100" : "opacity-0"
              } ${
                selectedCategory === "Upload"
                  ? "bg-white text-gray-600"
                  : "bg-green-200 text-gray-600 hover:bg-green-300"
              }`}
              onClick={(e) => {
                e.stopPropagation(); // Prevent the click event from triggering the card click
                handleFileUploadClick();
              }}
              disabled={!isAddingCard} // Disable the button if isAddingCard is false
              style={{
                pointerEvents: isAddingCard ? "auto" : "none", // Prevent interaction when not adding
                opacity: isAddingCard ? 1 : 0, // Make the button appear disabled
              }}
            >
              Upload Files
            </button>
          </div>

          {/* Existing Cards */}
          {sampleData[selectedCategory]?.map((event, index) => (
            <div
              key={index}
              className={`relative rounded-3xl overflow-hidden shadow-md cursor-pointer transition-transform group ${
                selectedCards.includes(index)
                  ? "border-4 border-green-500 bg-gray-100 "
                  : "bg-gray-100 "
              }`}
              style={{ height: "300px" }}
              onClick={() => {
                if (selectedCards.length == 0) {
                  handleCardClick(index);
                } else toggleCardSelection(index);
              }}
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

              {/* Checkmark Button */}
              <button
                className={`absolute top-2 left-2 w-6 h-6 bg-gray-700 text-white rounded-full flex items-center justify-center ${
                  selectedCards.includes(index) ? "opacity-100" : "opacity-0"
                } group-hover:opacity-100 transition-opacity`}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the click event from triggering the card click
                  toggleCardSelection(index);
                }}
              >
                ✓
              </button>

              {/* Cross Button */}
              <button
                className={`absolute top-2 right-2 w-6 h-6 bg-gray-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the click event from triggering the card click
                }}
              >
                X
              </button>
              {/* Star Button */}
              <button
                className={`absolute bottom-2 left-2 w-6 h-6 bg-gray-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the click event from triggering the card click
                }}
              >
                ★
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Table;
