import React, { useState, useRef, useEffect, useContext } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import SelectTopBar from "../../components/contentmanagementsystem/SelectTopBar";
import DefaultTopBar from "../../components/contentmanagementsystem/DefaultTopBar";
import Header from "../../components/Header";
import ReportsSection from "../../components/contentmanagementsystem/detailed/reporting/ReportsSection";
import axios from "axios";
import { CompanyContext } from "../../context/CompanyContext";

const API_URL = import.meta.env.VITE_API_URL;

const ContentManagementSystem = () => {
  const [selectedCategory, setSelectedCategory] = useState("Articles");
  const [selectedCards, setSelectedCards] = useState([]);
  const [starredCards, setStarredCards] = useState([]);
  const [articles, setArticles] = useState([]);
  const [events, setEvents] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [userQuery, setUserQuery] = useState("");
  const { main_color } = useContext(CompanyContext);
  const token = localStorage.getItem("token");
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
      },
    ],
  };

  const refreshData = async () => {
    if (selectedCategory === "Articles") {
      axios
        .get(API_URL + "articles/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setArticles(Array.isArray(response.data) ? response.data : []);
        })
        .catch((error) => {
          console.error("Error fetching articles:", error.response?.data);
          setArticles([]);
        });
    }
    if (selectedCategory === "Events") {
      axios
        .get(API_URL + "events/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setEvents(response.data);
          updateStarredCards(response.data);
        })
        .catch((error) => {
          console.error("Error fetching events:", error.response?.data);
          setEvents([]);
        });
    }
  };

  useEffect(() => {
    refreshData();
    // eslint-disable-next-line
  }, [selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedCards([]);
  };

  const updateStarredCards = (events) => {
    const starredEventIds = events
      .filter((event) => event.is_featured)
      .map((event) => event.id);
    setStarredCards(starredEventIds);
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

    try {
      await fetch(API_URL + `events/${eventId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_featured: !isCurrentlyStarred }),
      });

      setStarredCards(updatedStarredCards);
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId ? { ...event, is_featured: !isCurrentlyStarred } : event
        )
      );
    } catch (error) {
      console.error("Error updating star status:", error);
    }
  };

  const handleManualClicked = () => {
    if (selectedCategory === "Reporting") {
      navigate(`/reporting/`);
    } else {
      navigate(
        `/contentmanagementsystem/details/${selectedCategory.toLowerCase()}/${sampleData[selectedCategory].length - 1
        }`
      );
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setIsDragging(false);
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

  const handleDeleteMultiple = async () => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete selected items?`
    );
    if (isConfirmed) {
      try {
        for (const item of selectedCards) {
          await axios.delete(
            `${API_URL}${selectedCategory.toLowerCase()}/${item.id}/`
          );
        }
        refreshData();
      } catch (err) {
        console.log("Error occurred while deleting items:", err.message);
      }
    } else {
      console.log("Delete action cancelled.");
    }
    handleCancel();
  };

  const handleDeleteSingular = async (item) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${item.title}?`
    );
    if (isConfirmed) {
      try {
        const response = await axios.delete(
          `${API_URL}${selectedCategory.toLowerCase()}/${item.id}/`
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

  const handleSelectAll = () => {
    const allCards = (
      selectedCategory === "Articles" ? articles : sampleData[selectedCategory]
    )?.map((_) => _);
    setSelectedCards(allCards);
  };

  const handleCancel = () => {
    setSelectedCards([]);
  };

  const filterItems = (items, userQuery, itemFields = ["title", "description"]) => {
    const query = userQuery.toLowerCase();
    return (items || []).filter((item) =>
      itemFields.some((field) => item[field]?.toLowerCase().includes(query))
    );
  };

  const lightenColor = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  };

  return (
    <div className="h-[calc(100vh-146px)] w-full">
      <Header />
      <div className="pt-20"></div>
      {selectedCards.length > 0 ? (
        <SelectTopBar
          selectedCards={selectedCards}
          onDelete={handleDeleteMultiple}
          onSelectAll={handleSelectAll}
          onCancel={handleCancel}
        />
      ) : selectedCategory === "Miscellaneous" ? (
        <div className="h-14 pb-2 text-white border-b-2 flex flex-row justify-center items-center z-10 relative"></div>
      ) : (
        <DefaultTopBar
          onManual={handleManualClicked}
          onUpload={handleFileUploadClick}
          setUserQuery={setUserQuery}
          selectedCategory={selectedCategory}
        />
      )}

      {/* Main Layout */}
      <div
        {...getRootProps()}
        className="w-full h-full flex flex-col md:flex-row overflow-hidden relative"
      >
        <input {...getInputProps()} ref={fileInputRef} />

        {/* Drag Overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 pointer-events-none transition-opacity ${
            isDragging ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-gray-500 font-semibold text-center">
            Drag and drop files here to upload
          </p>
        </div>

       
        {/* Mobile Categories Navigation */}
        <div className="block md:hidden w-full bg-[#f9f9f9] flex overflow-x-auto py-2 px-4 shadow-lg">
          {categories.map((category) => (
            <div
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`flex-shrink-0 px-4 py-2 mx-1 rounded cursor-pointer transition-colors ${
                selectedCategory === category ? "bg-gray-200 border-b-4" : "text-gray-600 hover:bg-gray-200"
              }`}
              style={{
                color: selectedCategory === category ? main_color : "inherit",
                borderColor: selectedCategory === category ? main_color : "transparent",
              }}
            >
              {category}
            </div>
          ))}
        </div>

        {/* Desktop Sidebar Navigation */}
        <div className="hidden md:block w-1/6 bg-[#f9f9f9] flex flex-col text-black shadow-lg">
          <ul className="space-y-2 py-4 flex flex-col h-full ">
            {categories.map((category) => (
              <li
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`p-4 text-center font-semibold cursor-pointer transition-colors ${
                  selectedCategory === category
                    ? "bg-gray-200 border-r-4"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
                style={{
                  color: selectedCategory === category ? main_color : "inherit",
                  borderColor:
                    selectedCategory === category ? main_color : "transparent",
                  marginTop: category === "Miscellaneous" ? "auto" : "0",
                }}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className={`w-full md:w-5/6 h-full bg-white ${selectedCategory !== "Reporting" ? "overflow-auto" : ""}`}>
          {selectedCategory === "Reporting" && (
            <div style={{ maxHeight: 'calc(100vh - 8000px)' }}>
              <ReportsSection userQuery={userQuery} />
            </div>
          )}
          {selectedCategory !== "Reporting" &&
            selectedCategory !== "Miscellaneous" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 pl-8 pr-8 pt-8 pb-8 max-h-[50vh]" style={{ gridAutoRows: '80%' }}>
                {(selectedCategory === "Articles"
                  ? filterItems(articles, userQuery)
                  : selectedCategory === "Events"
                  ? filterItems(events, userQuery)
                  : sampleData[selectedCategory]
                )?.map((event, index) => (
                  <div
                    key={index}
                    className={`relative rounded-lg overflow-visible shadow-lg cursor-pointer transition-all duration-100 group ${
                      selectedCards.includes(event)
                        ? "border border-transparent border-8"
                        : "bg-white"
                    }`}
                    style={{
                      minHeight: "300px",
                      backgroundColor: selectedCards.includes(event)
                        ? lightenColor(main_color, 80)
                        : "white",
                      transition: "background-color 0.3s, transform 0.3s",
                    }}
                    onClick={() => {
                      if (selectedCards.length === 0) {
                        handleCardClick(event.id);
                      } else {
                        toggleCardSelection(event);
                      }
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.02)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    {event.main_image && (
                      <img
                        src={event.main_image}
                        alt={event.title}
                        className="w-full h-1/2 object-cover rounded-lg"
                      />
                    )}
                    <div className="p-4 text-center flex flex-col justify-center">
                        <h4 className="font-bold text-lg overflow-hidden break-words line-clamp-2 min-h-[3.5rem]">{event.title}</h4>
                        {event.event_type === "point_of_interest" ? (
                          <p className="text-sm text-gray-600 overflow-hidden break-words line-clamp-1">
                            {event.opening_times}
                          </p>
                        ) : event.event_type === "scheduled" ? (
                          <p className="text-sm text-gray-600 overflow-hidden break-words line-clamp-1">
                                {new Date(event.date + 'T' + event.time).toLocaleDateString(undefined, {
                                  weekday: 'short', // e.g., "Mon"
                                  month: 'short',   // e.g., "Jan"
                                  day: 'numeric',   // e.g., "15"
                                  year: 'numeric'  // e.g., "2024"
                              })} at {new Date(event.date + 'T' + event.time).toLocaleTimeString(undefined, {
                                  hour: 'numeric',    // e.g., "3"
                                  minute: 'numeric',  // e.g., "30"
                                  hour12: true       // e.g., "AM/PM"
                              })}
                          </p>
                        ): null}
                        <p className="text-sm text-gray-500 mt-2 overflow-hidden break-words line-clamp-3 flex-1 ml-6 mr-6">
                          {event.description}
                        </p>
                      </div>

                    {/* Conditional Checkmark Button */}
                    <button 
                      className={`absolute top-2 left-2 w-9 h-9 bg-gray-200 text-black rounded-full flex opacity-80 items-center justify-center ${
                        selectedCards.includes(event)
                          ? "opacity-100 bg-gray-600 font-bold text-white"
                          : "opacity-60"
                      } group-hover:opacity-100 transition-opacity`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCardSelection(event);
                      }}
                    >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5" // Adjust size as needed
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </button>
                    {selectedCategory === "Events" && (
                      <button
                        className={`absolute top-2 right-10 w-9 h-9 mr-2 bg-gray-200 text-black rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity ${
                          starredCards.includes(event.id)
                            ? "bg-yellow-500 text-white"
                            : "opacity-60"
                        }`}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the click event from triggering the card click
                        toggleStarSelection(event.id);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 18.03 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                  )}

                  {/* Delete Button */}
                  <button
                    className="absolute top-2 right-2 w-9 h-9 bg-red-500 text-white rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the click event from triggering the card click
                      handleDeleteSingular(event);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>

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
