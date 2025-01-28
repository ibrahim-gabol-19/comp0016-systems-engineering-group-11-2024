import React, { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import SelectTopBar from "../../components/contentmanagementsystem/SelectTopBar";
import DefaultTopBar from "../../components/contentmanagementsystem/DefaultTopBar";


const ContentManagementSystem = () => {
  const [selectedCategory, setSelectedCategory] = useState("Articles");
  const [selectedCards, setSelectedCards] = useState([]);
  const [starredCards, setStarredCards] = useState([]);

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const categories = ["Articles", "Events", "Forum", "Reporting"];

  const navigate = useNavigate();

  const sampleData = {
    Forum: [
      {
        title: "Big Ben",
        openTimes: "9:00 AM - 6:00 PM",
        description:
          "Iconic clock tower located in London lorem ipdsum and this becomes that beckend frontend hahahah yes it does.. and this is even more.",
        image: "https://picsum.photos/150",
      },
      {
        title: "Big Ben",
        openTimes: "9:00 AM - 6:00 PM",
        description: "Iconic clock tower located in London.",
        image: "https://picsum.photos/150",
      },
      {
        title: "Big Ben",
        openTimes: "9:00 AM - 6:00 PM",
        description: "Iconic clock tower located in London.",
        image: "https://picsum.photos/10",
      },
      {
        title: "Big Ben",
        openTimes: "9:00 AM - 6:00 PM",
        description: "Iconic clock tower located in London.",
        image: "https://picsum.photos/200",
      },
      {
        title: "Big Ben",
        openTimes: "9:00 AM - 6:00 PM",
        description: "Iconic clock tower located in London.",
        image: "https://picsum.photos/150",
      },
      {
        title: "Big Ben",
        openTimes: "9:00 AM - 6:00 PM",
        description: "Iconic clock tower located in London.",
        image: "https://picsum.photos/150",
      },
      {
        title: "Big Ben",
        openTimes: "9:00 AM - 6:00 PM",
        description: "Iconic clock tower located in London.",
        image: "https://picsum.photos/150",
      },
      {
        title: "Big Ben",
        openTimes: "9:00 AM - 6:00 PM",
        description: "Iconic clock tower located in London.",
        image: "https://picsum.photos/150",
      },
      {
        title: "Big Ben",
        openTimes: "9:00 AM - 6:00 PM",
        description: "Iconic clock tower located in London.",
        image: "https://picsum.photos/150",
      },
      {
        title: "Big Ben",
        openTimes: "9:00 AM - 6:00 PM",
        description: "Iconic clock tower located in London.",
        image: "https://picsum.photos/150",
      },
      {
        title: "Big Ben",
        openTimes: "9:00 AM - 6:00 PM",
        description: "Iconic clock tower located in London.",
        image: "https://picsum.photos/150",
      },
      {
        title: "Big Ben",
        openTimes: "9:00 AM - 6:00 PM",
        description: "Iconic clock tower located in London.",
        image: "https://picsum.photos/150",
      },
      {
        title: "Big Ben",
        openTimes: "9:00 AM - 6:00 PM",
        description: "Iconic clock tower located in London.",
        image: "https://picsum.photos/150",
      },
      {
        title: "Big Ben",
        openTimes: "9:00 AM - 6:00 PM",
        description: "Iconic clock tower located in London.",
        image: "https://picsum.photos/150",
      },
      {
        title: "Big Ben",
        openTimes: "9:00 AM - 6:00 PM",
        description: "Iconic clock tower located in London.",
        image: "https://picsum.photos/150",
      },

      {
        title: "Tower of London",
        openTimes: "10:00 AM - 5:30 PM",
        description: "Historic castle on the River Thames.",
        image: "https://picsum.photos/150",
      },
      {
        title: "London Eye",
        openTimes: "10:00 AM - 8:00 PM",
        description: "Famous observation wheel offering panoramic views.",
        image: "https://picsum.photos/150",
      },
      {
        title: "The Shard",
        openTimes: "9:00 AM - 10:00 PM",
        description: "Tallest building in London with an observation deck.",
        image: "https://picsum.photos/150",
      },
    ],
    Reporting: [
      {
        title: "British Museum",
        openTimes: "10:00 AM - 6:00 PM",
        description: "Explore world history and culture.",
        image: "https://picsum.photos/150",
      },
    ],
    Events: [
      {
        title: "Hyde Park",
        openTimes: "Open 24 hours",
        description: "Relax in one of London's largest parks.",
        image: "https://picsum.photos/150",
      },
    ],
    Articles: [
      {
        title: "Camden Market",
        openTimes: "10:00 AM - 7:00 PM",
        description: "Browse eclectic shops and food stalls.",
        image: "https://picsum.photos/150",
      },
    ],
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedCards([]);
    setStarredCards([]);
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
  const toggleStarSelection = (index) => {
    setStarredCards((prevStarred) =>
      prevStarred.includes(index)
        ? prevStarred.filter((i) => i !== index)
        : [...prevStarred, index]
    );
  };

  const handleManualClicked = () => {
    navigate(
      `/contentmanagementsystem/details/${selectedCategory.toLowerCase()}/${
        sampleData[selectedCategory].length + 1
      }`
    );
  };

  const fileUploaded = () => {
    console.log(uploadedFiles)
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
      setIsDragging(false); // Reset dragging state
      fileUploaded();
      alert(`Uploaded ${acceptedFiles.length} file(s) successfully!`);
    },
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    fileUploaded();
  };

  // Define the functions that will be passed to TopBar as props
  const handleDelete = () => {
    alert("Delete action triggered");
    handleCancel();
  };

  const handleStar = () => {
    const allCards = selectedCards?.map((_, index) => index);
    allCards.forEach((cardIndex) => toggleStarSelection(cardIndex));
    handleCancel();
  };

  const handleSelectAll = () => {
    const allCards = sampleData[selectedCategory]?.map((_, index) => index);
    setSelectedCards(allCards);
  };

  const handleCancel = () => {
    setSelectedCards([]); // Deselect all cards
  };

  return (
    <div className="h-[calc(100vh-146px)]">
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
      <div
        {...getRootProps()}
        className="w-screen h-full flex overflow-hidden relative"
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
        {/* <div className="h-[530px] w-[300px] mt-6 p-5 bg-[#f9f9f9] rounded-lg font-sans flex flex-col gap-5 shadow-md"> */}
        <div className="w-1/6 bg-[#f9f9f9]  flex flex-col text-black shadow-lg">
          <ul className="space-y-2 py-4">
            {categories.map((category) => (
              <li
                key={category}
                className={`p-4 text-center font-semibold cursor-pointer transition-colors ${
                  selectedCategory === category
                    ? "bg-gray-200 text-green-600 border-r-4 border-green-500 "
                    : " text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="w-5/6 bg-white pl-6 overflow-auto  ">
          <div
            className="grid grid-cols-4 gap-8 overflow-y-auto "
            style={{
              alignContent: "start",
            }}
          >
            {/* Existing Cards */}
            {sampleData[selectedCategory]?.map((event, index) => (
              <div
                key={index}
                className={`relative rounded-lg overflow-visible shadow-lg cursor-pointer transition-all duration-100 group ${
                  selectedCards.includes(index)
                    ? "bg-green-100 border border-transparent border-8"
                    : "bg-white "
                }`}
                style={{ height: "300px" }}
                onClick={() => {
                  if (selectedCards.length === 0) {
                    handleCardClick(event.id);
                    console.log('Event id clicked is', event.id);
                  } else {
                    toggleCardSelection(index);
                  }
                }}
              >
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-1/2 object-cover rounded-lg  "
                  />
                )}
                <div className="p-2 flex flex-col h-1/2 text-center">
                  <h1 className="font-bold text-2xl text-gray-800 truncate">
                    {event.title}
                  </h1>
                  <p className="text-sm text-gray-500 truncate">
                    {event.openTimes}
                  </p>
                  <p className="text-base text-gray-700 mt-2 overflow-hidden text-ellipsis line-clamp-3">
                    {event.description}
                  </p>
                </div>

                {/* Checkmark Button */}
                <button
                  className={`absolute top-2 left-2 w-7 h-7 bg-gray-200 text-black rounded-full flex opacity-80 items-center justify-center ${
                    selectedCards.includes(index)
                      ? "opacity-100 bg-gray-600 font-bold text-white "
                      : "opacity-60"
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
                  className={`absolute -top-1 -right-2 w-8 h-8 bg-white shadow-lg text-red-400 text-xl font-bold rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the click event from triggering the card click
                    handleDelete();
                  }}
                >
                  X
                </button>
                {/* Star Button */}
                <button
                  className={`absolute top-24 left-2 text-4xl font-bold text-white rounded-full flex items-center justify-center ${
                    starredCards.includes(index)
                      ? "opacity-100 text-yellow-300"
                      : "opacity-0"
                  } group-hover:opacity-100 transition-opacity`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the click event from triggering the card click
                    toggleStarSelection(index);
                  }}
                >
                  ★
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManagementSystem;
