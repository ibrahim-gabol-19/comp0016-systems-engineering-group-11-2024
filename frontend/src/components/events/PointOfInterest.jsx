import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CompanyContext } from "../../context/CompanyContext";


const PointOfInterest = () => {
  const [selectedCategory, setSelectedCategory] = useState("landmarks");
  const categories = ["landmarks", "museums", "parks", "other"];
  const [poiEvents, setPoiEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { main_color } = useContext(CompanyContext);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(API_URL + `events/pois/`)
      .then((response) => {
        const event = response.data;
        setPoiEvents(event);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching event:", error);
        setError("Failed to load POI events.");
        setLoading(false);
      });
    // eslint-disable-next-line
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleCardClick = (id) => {
    navigate(
      `/events/${id}`
    );
  };

  return (
    <div className="max-w-6xxl mx-auto mt-14">
      <h2 className="text-2xl font-bold px-6 mb-8 flex justify-center">Points of Interest</h2>
      {/* Category Tabs (Mobile Only) */}
      <div className="bg-white h-1/6 md:hidden flex flex-wrap justify-center gap-4 px-4">
        {categories.map((category) => (
          <button
            key={category}
            className="p-4 text-center font-bold cursor-pointer flex-grow"
            style={
              selectedCategory === category
                ? {
                  backgroundColor: "#e5e7eb",
                  color: main_color,
                  borderBottom: "4px solid " + main_color
                }
                : {
                  backgroundColor: "white",
                  color: "gray",

                }
            }
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#e5e7eb";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "white"; // Reset background on mouse leave
            }}

            onMouseUp={(e) => {
              e.currentTarget.style.backgroundColor = "white"
            }}


            onClick={() => handleCategoryClick(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex">
        {/* Sidebar (Hidden on Mobile) */}
        <div className="w-1/6 bg-white flex flex-col justify-top md:flex md:w-1/6 hidden">
          <ul className="">
            {categories.map((category) => (
              <li
                key={category}
                className="p-4 text-center font-bold cursor-pointer"
                style={
                  selectedCategory === category
                    ? {
                      backgroundColor: "#e5e7eb",
                      color: main_color,
                      borderBottom: "4px solid " + main_color
                    }
                    : {
                      backgroundColor: "white",
                      color: "gray",

                    }
                }
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#e5e7eb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white"; // Reset background on mouse leave
                }}

                onMouseUp={(e) => {
                  e.currentTarget.style.backgroundColor = "white"
                }}
                onClick={() => handleCategoryClick(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="w-5/6 bg-white p-6 md:pl-6" style={{ width: "100%" }}>
          <h3 className="text-xl font-bold mb-4 md:block hidden">
            {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
          </h3>
          <div className="mt-8" style={{ minHeight: "525px" }}>
            <div className="flex flex-col md:flex-row flex-wrap gap-6 w-full px-6 sm:px-8">
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-red-500">Error: {error}</p>
              ) : poiEvents[selectedCategory] && poiEvents[selectedCategory].length > 0 ? (
                poiEvents[selectedCategory].map((event, index) => (
                  <div
                    key={index}
                    className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl cursor-pointer w-full lg:w-[24%] "
                    onClick={() => handleCardClick(event.id)}
                    style={{

                      backgroundColor: main_color, // Default background color
                    }}
                  >
                    <div className="w-full">
                      {event.main_image && (
                        <img
                          src={event.main_image}
                          alt={event.title}
                          className="w-full h-32 object-cover"
                        />
                      )}
                      <div className="p-4 text-center">
                        <h4 className="font-bold text-lg overflow-hidden break-words line-clamp-2 min-h-[3.5rem]">
                          {event.title}
                        </h4>
                        <p className="text-sm text-gray-600 overflow-hidden break-words line-clamp-1">
                          {event.openTimes}
                        </p>
                        <p className="text-sm text-gray-500 mt-2 overflow-hidden break-words line-clamp-3 ml-6 mr-6">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400">No events.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointOfInterest;
