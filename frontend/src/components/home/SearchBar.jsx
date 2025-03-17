import React, { useState, useEffect, useContext } from "react";
import aiLogo from "../../assets/ai_icon.png";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CompanyContext } from "../../context/CompanyContext";
import { AIContext } from "../../context/AIContext";
import L from "leaflet";


const API_URL = import.meta.env.VITE_API_URL;

const SearchBar = () => {
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const [modelReply, setModelReply] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [fullUserQuery, setFullUserQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [generatedReport, setGeneratedReport] = useState(null);
  const [messages, setMessages] = useState([]);
  const [fadeIn, setFadeIn] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const { name, sw_lat, sw_lon, ne_lat, ne_lon } = useContext(CompanyContext);
  const { getReply, engine, progressModelLoaded, modelDisabled } = useContext(AIContext);
  const [showTooltip, setShowTooltip] = useState(false);
  const [toolTipText, setToolTipText] = useState("AI Model is loading");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // LLM decides whether to initiate new report or search query
    setMessages([...messages, { text: userQuery, sender: "user" }]);
    // setModelReply("Here is what I found.");
    setFullUserQuery(userQuery);
    setUserQuery("");
    const choice = await determineUserQuery(userQuery);
    setSearchResult([]);
    setGeneratedReport(null);
    switch (choice) {
      case "0":
        getSearchReply(userQuery);
        break;
      case "1":
        getReportReply(userQuery);
        break;
      default:
        getSearchReply(userQuery);
        break;
    }


  };

  const createGeneratedReportWithLocation = (generatedReport) => {
    const center = L.latLng(
      (parseFloat(sw_lat) + parseFloat(ne_lat)) / 2,
      (parseFloat(sw_lon) + parseFloat(ne_lon)) / 2
    );
    const generatedReportWithLocation = generatedReport;
    generatedReportWithLocation.latlng = center;
    return generatedReportWithLocation;
  }
  const handleRedirect = (item) => {
    if (item.source === "report") {
      navigate("/reporting", { state: { selectedIssue: item } });
    } else if (item.source === "event") {
      navigate(`/events/${item.id}`);
    } else if (item.source === "article") {
      navigate(`/articles/${item.id}`);
    } else if (item === "generatedReport") {
      const generatedReportWithLocation = createGeneratedReportWithLocation(generatedReport);
      navigate(`/reporting`, { state: { newIssue: generatedReportWithLocation } });
    }
    else {
      console.log("Did not match any source");
    }
  };

  // When new search results arrive, trigger the fade effect
  useEffect(() => {
    if (Array.isArray(searchResult) && searchResult.length > 0) {
      setFadeIn(false);
      setTimeout(() => setFadeIn(true), 10);
    }
    if (generatedReport) {
      setFadeIn(false);
      setTimeout(() => setFadeIn(true), 10);
    }
  }, [searchResult, generatedReport]);


  useEffect(() => {
    if (!progressModelLoaded) return;

    if (progressModelLoaded.progress === 1) {
      setToolTipText("AI Model Ready!");
    } else if (modelDisabled) {
      // No tooltip for model disabled case
      return;
    } else {
      setToolTipText(`AI Model is loading: ${progressModelLoaded.text}`);
    }

    console.log(progressModelLoaded);
  }, [progressModelLoaded, modelDisabled]);


  const extractEventDetails = (responseData) => {
    return responseData.map((event) => ({
      title: event.title,
      date: event.date,
      description: event.description,
      event_type: event.event_type,
    }));
  };


  const determineUserQuery = async (userQuery) => {
    if (userQuery === "" || isStreaming) {
      return;
    }
    const systemPrompt = `
    Determine whether the following is a new report request or a search query.
    - Respond with 1 (new report request) if the input:
      * Asks to create a new report.
      * Describes an issue or problem that needs to be reported.
      * Uses phrases like "report," "create a report," or "make a new report."
    - Respond with 0 (search query) if the input:
      * Asks for information or looks up existing data.
      * Uses phrases like "find," "search," or "information about."
    Examples:
    - "Can you make a new report? I noticed some overflowing bins on my road." → 1
    - "Find information about overflowing bins in my area." → 0
    - "I want to report a pothole on Main Street." → 1
    - "What are the rules for waste disposal?" → 0
    Respond with 1 for new report requests and 0 for search queries.
  `;
    const modelReply = await getReply(userQuery, systemPrompt, () => { }, setIsStreaming);

    if (!engine) {
      console.log("Model is still loading...");
      setModelReply("Here is what I found:");
      return;
    }
    return modelReply;
  };

  const getReportReply = async (userQuery) => {
    if (userQuery === "" || isStreaming) {
      return;
    }

    const systemPrompt = `You are a local resident near ${name}, a company.
              
              Create a report from the following userQuery.
              Output in JSON according to this structure:

              "title": "",
                                         
              "description": "",
                                   
              `;
    setModelReply("Hi, let me make that report for you now...")
    try {
      const reportJSON = JSON.parse(await getReply(userQuery, systemPrompt, () => { }, setIsStreaming));
      setGeneratedReport(reportJSON);

    }
    catch (error) {
      console.error("Error:", error);
      setModelReply("Sorry, please try again or try a different request");
    }

  };

  const getSearchResult = async (userQuery) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_URL + `search/`, {
        params: { query: userQuery },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.data && response.data.results) {
        setSearchResult(response.data.results);
        return response.data.results; // Return the results directly
      } else {
        setSearchResult([]);
        return []; // Return an empty array if no results
      }
    } catch (error) {
      console.error("Error while fetching search results:", error);
      return []; // Return an empty array in case of error
    }
  };

  const getSearchReply = async (userQuery) => {
    if (userQuery === "" || isStreaming) {
      return;
    }

    // Await the search results directly
    const searchResult = await getSearchResult(userQuery);

    const systemPrompt = `You are an AI assistant chatbot for ${name}, a company.
              
              Your role is to provide visitors with quick, accurate, and helpful responses related to the company's events, news, articles, and initiatives. 
              Be polite, professional, and ensure responses are concise and user-friendly. 
              
              --- 
              
              Today's date: ${new Date().toISOString().split("T")[0]}
              
              ---
              **Data (JSON Format)**
              ${JSON.stringify(extractEventDetails(searchResult), null, 2)}
              
              Based on this data, answer the user's question appropriately.
              `;

    await getReply(userQuery, systemPrompt, setModelReply, setIsStreaming);

    if (!engine) {
      console.log("Model is still loading...");
      setModelReply("Here is what I found:");
      return;
    }
  };
  return (
    <div className="flex flex-col items-center w-full mt-8">
      {/* Header with AI Logo and Title */}
      <div className="flex items-center justify-center mb-8 relative group">
  {/* Logo with enhanced animations */}
  <img
    src={aiLogo}
    alt="AI Logo"
    className="w-14 h-14 mr-4 drop-shadow-lg animate-[spin_8s_linear_infinite] hover:animate-[bounceSpin_3s_ease-in-out_infinite] transition-all duration-500"
    style={{
      animation: "spin 8s linear infinite",
    }}
    onMouseEnter={() => setShowTooltip(true)}
    onMouseLeave={() => setShowTooltip(false)}
  />

  {/* Heading with gradient text */}
  <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
    Ask AI
  </h1>

  {/* Tooltip with wider width */}
  <div
    className={`absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-gray-700/90 text-white text-sm rounded-lg shadow-xl transition-opacity duration-300 ease-in-out ${
      showTooltip ? 'opacity-100 visible' : 'opacity-0 invisible'
    }`}
    style={{
      width: '300px', // Set a specific width for the tooltip
      maxWidth: '90vw', // Ensure it doesn't exceed the viewport width
      whiteSpace: 'pre-wrap', // Allow text to wrap
      wordBreak: 'break-word', // Break long words if necessary
    }}
  >
    {toolTipText}
  </div>
</div>

      {/* Chat Box */}
      {fullUserQuery && (
        <div className="w-full max-w-3xl rounded-3xl bg-white border border-gray-200 shadow-lg transition-all duration-300">
          {/* User Message */}
          <div className="flex justify-end my-3 px-6">
            <div className="max-w-full px-4 py-3 bg-green-100 rounded-2xl shadow-md">
              <p className="text-right text-gray-800">{fullUserQuery}</p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 ml-4 text-gray-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </div>

          <div
            className={`grid gap-6 p-6 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 w-full max-w-5xl transition-opacity duration-1000 ease-in-out ${fadeIn ? "opacity-100" : "opacity-0"
              }`}
          >
            {Array.isArray(searchResult)
              ? searchResult.map((item, index) => (
                <div
                  key={index}
                  className="w-full h-[250px] p-5 bg-blue-50 rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all flex flex-col justify-between overflow-hidden"
                  onClick={() => handleRedirect(item)}
                >
                  {/* Title */}
                  <p className="font-bold text-lg text-gray-900 tracking-wide break-words">
                    {item.title}
                  </p>
                  {/* Source */}
                  <span className="text-xs font-medium text-gray-500 uppercase">
                    {item.source}
                  </span>
                  {/* Score */}
                  <p className="text-sm text-gray-600 mt-1">
                    🔢 Score:{" "}
                    <span className="font-medium">
                      {item.similarity_score.toFixed(3)}
                    </span>
                  </p>
                  {/* Conditional Content */}
                  <div className="overflow-hidden text-ellipsis flex-grow">
                    {item.source === "event" && (
                      <>
                        <p className="text-sm text-gray-700 mt-2">
                          📅 <span className="font-medium">Date:</span>{" "}
                          {item.date}
                        </p>
                        <p className="text-sm text-gray-700">
                          ⏰ <span className="font-medium">Time:</span>{" "}
                          {item.time}
                        </p>
                        <p className="text-sm text-gray-700">
                          📍 <span className="font-medium">Location:</span>{" "}
                          {item.location}
                        </p>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          📖 <span className="font-medium">Description:</span>{" "}
                          {item.description}
                        </p>
                      </>
                    )}
                    {item.source === "article" && (
                      <>
                        <p className="text-sm text-gray-700 mt-2">
                          ✍️ <span className="font-medium">Author:</span>{" "}
                          {item.author}
                        </p>
                        <p className="text-sm text-gray-700">
                          📅 <span className="font-medium">Published:</span>{" "}
                          {item.published_date}
                        </p>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          📖 <span className="font-medium">Description:</span>{" "}
                          {item.description}
                        </p>
                      </>
                    )}
                    {item.source === "report" && (
                      <>
                        <p className="text-sm text-gray-700 mt-2">
                          📅 <span className="font-medium">Date:</span>{" "}
                          {item.published_date}
                        </p>
                        <p className="text-sm text-gray-700">
                          🏷️ <span className="font-medium">Tag:</span>{" "}
                          {item.tags}
                        </p>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          📖 <span className="font-medium">Description:</span>{" "}
                          {item.description}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ))
              : null}
            {/* AI-Generated Report box */}
            {generatedReport ? (
              <div
                className="w-full h-[250px] p-5 bg-blue-50 rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all flex flex-col justify-between overflow-hidden"
                onClick={() => handleRedirect("generatedReport")}
              >
                <h3 className="text-xl font-semibold text-gray-800">{generatedReport.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {generatedReport.tags}</div>
                <p className="text-gray-600">{generatedReport.description}</p>
              </div>
            ) : null}
          </div>

          {/* AI Response */}
          <div className="flex my-4 px-6 items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 mr-4 text-gray-600 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
            </svg>
            <div className="max-w-full px-4 py-3 bg-blue-100 rounded-2xl shadow-md">
              <ReactMarkdown className="text-gray-800">
                {modelReply}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {/* Input Box */}
      <div
        className={`mt-3 flex h-14 w-full max-w-xl items-center bg-white border border-gray-300 rounded-full px-4 shadow-md transition-all ${isFocused ? "ring-2 ring-blue-500" : ""
          }`}
      >
        <form
          onSubmit={handleSubmit}
          className="w-full h-full flex items-center"
        >
          <input
            type="text"
            placeholder={
              isFocused ? "" : "When is the next volunteering event?"
            }
            className="w-full h-full outline-none bg-transparent text-gray-900 px-3"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-label="Search for volunteering events"
          />
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
