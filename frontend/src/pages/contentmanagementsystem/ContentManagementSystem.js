import React, { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import SelectTopBar from "../../components/contentmanagementsystem/SelectTopBar";
import DefaultTopBar from "../../components/contentmanagementsystem/DefaultTopBar";
import Header from "../../components/Header";
// import ReportsSection from "../../components/contentmanagementsystem/detailed/reporting/ReportsSection";
import axios from 'axios';
const API_URL = "http://127.0.0.1:8000/";


const ContentManagementSystem = () => {
  const [selectedCategory, setSelectedCategory] = useState("Articles");
  const [selectedCards, setSelectedCards] = useState([]);
  const [starredCards, setStarredCards] = useState([]);
  const [articles, setArticles] = useState([]);
  const [events, setEvents] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  //const [isAddingCard, setIsAddingCard] = useState(false);
  const fileInputRef = useRef(null);
  const [userQuery, setUserQuery] = useState("");


  const categories = ["Articles", "Events", "Reporting"];
  const navigate = useNavigate();

  const sampleData = {
    Forum: [
      {
        title: "Big Ben",
        openTimes: "9:00 AM - 6:00 PM",
        description:
          "Iconic clock tower located in London lorem ipdsum and this becomes that beckend frontend hahahah yes it does.. and this is even more.",
        main_image: "https://picsum.photos/150",
      },
      // more sample data...
    ],
    Reporting: [
      {
        title: "British Museum",
        openTimes: "10:00 AM - 6:00 PM",
        description: "Explore world history and culture.",
        main_image: "https://picsum.photos/150",
      },
    ],
    Events: [
      {
        title: "Hyde Park",
        openTimes: "Open 24 hours",
        description: "Relax in one of London's largest parks.",
        main_image: "https://picsum.photos/150",
      },
    ],
    Articles: [
      {
        title: "Camden Market",
        openTimes: "10:00 AM - 7:00 PM",
        description: "Browse eclectic shops and food stalls.",
        main_image: "https://picsum.photos/150",
      }
    ],
  };
  const refreshData = async () => {
    if (selectedCategory === "Articles") {
      fetch(API_URL + "articles/")
        .then((response) => response.json())
        .then((data) => setArticles(data))
        .catch((error) => console.error("Error fetching articles:", error));
    }
    if (selectedCategory === "Events") {
      fetch(API_URL + "events/")
        .then((response) => response.json())
        .then((data) => {
          setEvents(data);
          setStarredCards(data.filter(event => event.is_featured).map(event => event.id));
        })
      .catch((error) => console.error("Error fetching events:", error));
    }
  }

  // Fetch articles from the API when the component is mounted
  useEffect(() => {
    refreshData();
    // eslint-disable-next-line
  }, [selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedCards([]);
    // setStarredCards([]);
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

  const toggleStarSelection = async (eventId) => {
    const isCurrentlyStarred = starredCards.includes(eventId);
 
    if (!isCurrentlyStarred && starredCards.length >= 3) {
      alert("You can only star up to 3 events.");
      return;
    }
 
    const updatedStarredCards = isCurrentlyStarred
      ? starredCards.filter((id) => id !== eventId)
      : [...starredCards, eventId];


    setStarredCards(updatedStarredCards);
 
    try {
      const response = await fetch(API_URL+`events/${eventId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_featured: !isCurrentlyStarred }),
      });
      console.log("Backend response:", await response.json());


        // Update the event in the state
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId ? { ...event, is_featured: !isCurrentlyStarred } : event
        )
      );


    } catch (error) {
      console.error("Error updating star status:", error);
    }
  };


  /*
  const handleAddCardClicked = () => {
    setIsAddingCard(!isAddingCard);
  };*/

  const handleManualClicked = () => {
    if (selectedCategory === "Reporting")
    {
      navigate(
        `/reporting/`
      );
    }
    else
    {
      navigate(
        `/contentmanagementsystem/details/${selectedCategory.toLowerCase()}/${sampleData[selectedCategory].length - 1
        }`
      );
    }
  };

  /*
  const onDrop = (acceptedFiles) => {
    setUploadedFiles([...uploadedFiles, ...acceptedFiles]);
    alert(`Uploaded ${acceptedFiles.length} file(s) successfully!`);
  };*/

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
      setIsDragging(false); // Reset dragging state
      alert(`Uploaded ${acceptedFiles.length} file(s) successfully!`);
      console.log(uploadedFiles);
    },
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleDeleteMultiple = async () => {
    // Ask the user for confirmation
    const isConfirmed = window.confirm(`Are you sure you want to delete selected items?`);

    if (isConfirmed) {
      try {
        // Iterate over each selected card
        for (const item of selectedCards) {
          // Send the delete request for each selected item
          const response = await axios.delete(
            `${API_URL}${selectedCategory.toLowerCase()}/${item.id}/`
          );

          if (response.status === 204) {
          }
        }

        // After all deletes are completed, refresh the data
        refreshData();
      } catch (err) {
        console.log("Error occurred while deleting items:", err.message);
      }
    } else {
      console.log("Delete action cancelled.");
    }

    // Reset or close the modal (or handle cancel logic)
    handleCancel();
  };



  const handleDeleteSingular = async (item) => {
    // Ask the user for confirmation
    const isConfirmed = window.confirm(`Are you sure you want to delete ${item.title}?`);

    if (isConfirmed) {
      try {
        const response = await axios.delete(
          `${API_URL}${selectedCategory.toLowerCase()}/${item.id}/`,
        );

        if (response.status === 204) {
          console.log(`${selectedCategory} deleted successfully`);
          refreshData();
        }
      } catch (err) {
        console.log(err.message);
      }
    } else {
      console.log("Delete action cancelled.");
    }
  };

  const handleStarMultiple = () => {

    const allCards = selectedCards?.map((_, index) => index);
    allCards.forEach((cardIndex) => toggleStarSelection(cardIndex));
    handleCancel();
  };

  const handleSelectAll = () => {
    const allCards = (
      selectedCategory === "Articles" ? articles : sampleData[selectedCategory]
    )?.map((_, index) => _);
    setSelectedCards(allCards);
  };

  const handleCancel = () => {
    setSelectedCards([]); // Deselect all cards
  };

  const filterItems = (items, userQuery, itemFields = ['title', 'description']) => {
    const query = userQuery.toLowerCase();
    return (items || []).filter((item) => {
      return itemFields.some(field =>
        item[field]?.toLowerCase().includes(query)
      );
    });
  };


  return (
    <div className="h-[calc(100vh-146px)] w-full">
      <Header />
      <div className="pt-20"></div>
      {selectedCards.length > 0 ? (
        <SelectTopBar
          selectedCards={selectedCards}
          onDelete={handleDeleteMultiple}
          onStar={handleStarMultiple}
          onSelectAll={handleSelectAll}
          onCancel={handleCancel}
        />
      ) : (
        <DefaultTopBar
          onManual={handleManualClicked}
          onUpload={handleFileUploadClick}
          setUserQuery={setUserQuery}
        />
      )}
      <div
        {...getRootProps()}
        className="w-screen h-full flex overflow-hidden relative"
      >
        <input {...getInputProps()} ref={fileInputRef} />
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 pointer-events-none transition-opacity ${isDragging ? "opacity-100" : "opacity-0"
            }`}
        >
          <p className="text-gray-500 font-semibold text-center">
            Drag and drop files here to upload
          </p>
        </div>

        <div className="w-1/6 bg-[#f9f9f9] flex flex-col text-black shadow-lg">
          <ul className="space-y-2 py-4">
            {categories.map((category) => (
              <li
                key={category}
                className={`p-4 text-center font-semibold cursor-pointer transition-colors ${selectedCategory === category
                  ? "bg-gray-200 text-green-600 border-r-4 border-green-500"
                  : "text-gray-600 hover:bg-gray-200"
                  }`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>

        <div className="w-5/6 h-full bg-white overflow-auto">
          {/* {selectedCategory === "Reporting" && <ReportsSection userQuery={userQuery} />} */}
          {selectedCategory !== "Reporting" && (
            <div className="grid grid-cols-4 gap-8 p-4">
              {(selectedCategory === "Articles"
                ? filterItems(articles, userQuery)
                : selectedCategory === "Events"
                  ? filterItems(events, userQuery)
                  : sampleData[selectedCategory]
              )?.map((event, index) => (
                <div
                  key={index}
                  className={`relative rounded-lg overflow-visible shadow-lg cursor-pointer transition-all duration-100 group ${selectedCards.includes(event)
                    ? "bg-green-100 border border-transparent border-8"
                    : "bg-white"
                    }`}
                  style={{ minHeight: "300px" }}
                  onClick={() => {
                    if (selectedCards.length === 0) {
                      handleCardClick(event.id);
                      console.log('Event id clicked is', event.id);
                    } else {
                      toggleCardSelection(event);
                    }
                  }}
                >
                  {event.main_image && (
                    <img
                      src={event.main_image}
                      alt={event.title}
                      className="w-full h-1/2 object-cover rounded-lg"
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

                  <button
                    className={`absolute top-2 left-2 w-9 h-9 bg-gray-200 text-black rounded-full flex opacity-80 items-center justify-center ${selectedCards.includes(event)
                      ? "opacity-100 bg-gray-600 font-bold text-white"
                      : "opacity-60"
                      } group-hover:opacity-100 transition-opacity`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the click event from triggering the card click
                      toggleCardSelection(event);
                    }}
                  >
                    ✓
                  </button>

                  {/* Conditional Star Button */}
                  {selectedCategory === "Events" && (
                    <button
                      className={`absolute top-2 right-2 w-7 h-7 bg-gray-200 text-black rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity ${event.is_featured //starredCards.includes(index)
                        ? "bg-yellow-500 text-white"
                        : "opacity-60"
                        }`}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the click event from triggering the card click
                        toggleStarSelection(event);
                      }}
                    >
                      ★
                    </button>
                  )}

                  {/* Delete Button */}
                  <button
                    className="absolute top-2 right-10 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the click event from triggering the card click
                      handleDeleteSingular(event);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentManagementSystem;