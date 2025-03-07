import React, { useState, useEffect } from "react";
import aiLogo from "../../assets/ai_icon.png";
import { CreateWebWorkerMLCEngine } from "@mlc-ai/web-llm";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL;

const SearchBar = () => {
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const [modelReply, setModelReply] = useState("");
  const [engine, setEngine] = useState(null);
  const [userQuery, setUserQuery] = useState("");
  const [fullUserQuery, setFullUserQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [messages, setMessages] = useState([]);
  const [fadeIn, setFadeIn] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    getReply(userQuery);
    setMessages([...messages, { text: userQuery, sender: "user" }]);
    setModelReply("Here is what I found.");
    setFullUserQuery(userQuery);

    setUserQuery("");
  };

  const handleRedirect = (item) => {
    console.log("Item clicked was", item);
    if (item.source === "report") {
      navigate("/reporting", { state: { selectedIssue: item } });
    } else if (item.source === "event") {
      navigate(`/events/${item.id}`);
    } else if (item.source === "article") {
      navigate(`/articles/${item.id}`);
    } else {
      console.log("Did not match any source");
    }
  };

  useEffect(() => {
    const initModel = async () => {
      try {
        const createdEngine = await CreateWebWorkerMLCEngine(
          new Worker(new URL("../.././workers/worker.js", import.meta.url), {
            type: "module",
          }),
          "Llama-3.2-1B-Instruct-q4f16_1-MLC"
        );
        setEngine(createdEngine);
      } catch (error) {
        console.error("Error while loading model:", error);
        setModelReply("Error while loading model:", error);
      }
    };

    initModel();
  }, []);

  // When new search results arrive, trigger the fade effect
  useEffect(() => {
    if (Array.isArray(searchResult) && searchResult.length > 0) {
      setFadeIn(false);
      setTimeout(() => setFadeIn(true), 10);
    }
  }, [searchResult]);

  const getReply = async (userQuery) => {
    if (userQuery === "") {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_URL + `search/`, {
        params: { query: userQuery },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.data && response.data.results) {
        setSearchResult(response.data.results);

        await engine.resetChat();
        const messages = [
          {
            role: "system",
            content: `You are an AI assistant chatbot for GreenEarth Inc., a company focused on sustainability and environmental conservation.
            
            Your role is to provide visitors with quick, accurate, and helpful responses related to the company's events, news, and initiatives. 
            Be polite, professional, and ensure responses are concise and user-friendly. 
            
            --- 
            **IMPORTANT**: When responding to event-related queries, follow these rules:
            - Identify which results are events by checking if they have a "date" field.
            - Convert the date string into a comparable format.
            - Compare each event's date to today's date.
            - **Only return upcoming events (dates after today).**
            - If multiple upcoming events exist, sort them from soonest to latest
            
            Today's date: ${new Date().toISOString().split("T")[0]}
            
            ---
            **Event Data (JSON Format)**
            ${JSON.stringify(response.data.results, null, 2)}
            
            Based on this data, answer the user's question appropriately.
            `,
          },
          { role: "user", content: userQuery },
        ];

        console.log(JSON.stringify(response.data.results, null, 2) + " The bees knees")
        try {
          const chunks = await engine.chat.completions.create({
            messages,
            temperature: 1,
            stream: true,
          });

          let reply = "";
          for await (const chunk of chunks) {
            reply += chunk.choices[0]?.delta.content || "";
            setModelReply(reply);
          }

          const fullReply = await engine.getMessage();
          setModelReply(fullReply);
        } catch (error) {
          console.error("Error during chat completion:", error);
        }
      } else {
        setSearchResult([]);
      }
    } catch (error) {
      console.error("Error while fetching search results:", error);
    }

    if (!engine) {
      console.log("Model is still loading...");
      setModelReply("Here is what I found:");
      return;
    }

  };

  return (
    <div className="flex flex-col items-center w-full mt-8">
      {/* Header with AI Logo and Title */}
      <div className="flex items-center justify-center mb-6">
        <img
          src={aiLogo}
          alt="AI Logo"
          className="w-12 h-12 mr-3 drop-shadow-md animate-[spin_5s_linear_infinite] motion-safe:animate-[bounceSpin_3s_ease-in-out_infinite]"
          style={{
            animation: "spin 5s linear infinite, bounceSpin 3s ease-in-out infinite",
          }}
        />
        <h1 className="text-4xl font-extrabold text-gray-900">Ask AI</h1>
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
        <form onSubmit={handleSubmit} className="w-full h-full flex items-center">
          <input
            type="text"
            placeholder={isFocused ? "" : "When is the next volunteering event?"}
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
