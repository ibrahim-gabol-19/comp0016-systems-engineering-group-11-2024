import React, { useState, useEffect } from "react";
import aiLogo from "../../assets/ai_icon.png";
import { CreateMLCEngine, MLCEngine } from "@mlc-ai/web-llm";

const SearchBar = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [modelReply, setModelReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [engine, setEngine] = useState(null);
  const [userQuery, setUserQuery] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [messages, setMessages] = useState([]);

  const templateSearchResult = {
    news: [
      {
        title: "New Recycling Initiative Launched",
        description:
          "GreenEarth Inc. has introduced a new citywide recycling initiative aimed at reducing waste and promoting sustainability.",
        published: "24 Dec 2024",
      },
    ],
    events: [
      {
        title: "Community Trash Pickup",
        description:
          "Join us for a local trash pickup event to help clean up our neighborhood. All supplies will be provided.",
        date: "30 Dec 2024",
        time: "9:00 AM",
        location: "Central Park, GreenEarth City",
        contact: "volunteer@greenearthinc.com",
      },
      {
        title: "GreenEarth Social Gathering",
        description:
          "A casual get-together for employees and local residents to discuss sustainability efforts and enjoy a fun evening of eco-friendly activities.",
        date: "26 Dec 2024",
        time: "6:00 PM",
        location: "GreenEarth HQ, 123 Sustainability Road",
        contact: "events@greenearthinc.com",
      },
    ],
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (engine) {
      getReply(userQuery, searchResult);
      setMessages([...messages, { text: userQuery, sender: "user" }]);
      setUserQuery("");
    } else {
      setModelReply("Here is what I found.");
    }
  };

  useEffect(() => {
    const initModel = async () => {
      setLoading(true);

      const initProgressCallback = (progress) => {
        console.log("Model Loading Progress:", progress);
        setModelReply("Model Loading Progress:" + progress.text);
      };

      try {
        // Create the engine and load the model
        const createdEngine = await CreateMLCEngine(
          "Llama-3.2-1B-Instruct-q4f16_1-MLC",
          {
            initProgressCallback,
          }
        );

        setEngine(createdEngine); // Store the engine in the state
      } catch (error) {
        console.error("Error while loading model:", error);
        setModelReply("Error while loading model:", error);
      } finally {
        setLoading(false);
      }
    };

    initModel();
  }, []);

  const getReply = async (userQuery, searchResult) => {
    // Because Search has not been implemented yet, I am using template JSON
    searchResult = JSON.stringify(templateSearchResult);
    console.log(searchResult);

    if (!engine) {
      console.log("Model is still loading...");
      setModelReply("Here is what I found:");
      return; // Exit if the engine is not ready
    }

    await engine.resetChat();

    // Define the messages for the chat
    const messages = [
      {
        role: "system",
        content: `You are an AI assistant chatbot for GreenEarth Inc., a company focused on sustainability and environmental conservation.
    
        Your role is to provide visitors with quick, accurate, and helpful responses related to the company's events, news, and initiatives. 
        
        Be polite, professional, and ensure responses are concise and user-friendly. 

        
        Here are the search results:
        ${searchResult}`,
      },
      { role: "user", content: userQuery },
    ];

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
        console.log(reply);

        if (chunk.usage) {
          console.log(chunk.usage);
        }
      }

      const fullReply = await engine.getMessage();

      console.log(fullReply); // Log the complete message if necessary

      setModelReply(fullReply);
      console.log(fullReply);
    } catch (error) {
      console.error("Error during chat completion:", error);
    }
  };

  return (
    <div className="flex flex-col items-center w-full mt-8">
      {/* Header with AI Logo and Title */}
      <div className="flex items-center justify-center mb-4">
        <img src={aiLogo} alt="AI Logo" className="w-10 h-10 mr-3" />
        <h1 className="text-3xl font-bold text-gray-800">Ask AI</h1>
      </div>
      <div>
        <p>Reply: {modelReply}</p>
      </div>

      <div className=" h-96 w-full rounded-3xl bg-white border border-gray-300 flex flex-col ">
        <div className="bg-green-500 w-3/4 h-1/6 ml-auto justify-end flex">
          <div className="w-5/6 h-full text-wrap truncate ">
            <p>{userQuery}</p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 w-1/6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </div>
        <div className="h-5/6">
          <div className="w-3/4 h-1/2 bg-green-100 flex ">
            {templateSearchResult.news.map((newsItem, index) => (
              <div key={index} className="w-1/3 h-full bg-yellow-300">
                <h3 className="font-bold">{newsItem.title}</h3>
                <p>{newsItem.description}</p>
                <span className="text-sm">{newsItem.published}</span>
              </div>
            ))}

            {/* Loop over events */}
            {templateSearchResult.events.map((eventItem, index) => (
              <div key={index} className="w-1/3 h-full bg-yellow-300">
                <h3 className="font-bold">{eventItem.title}</h3>
                <p>{eventItem.description}</p>
                <div className="text-sm">
                  <p>{eventItem.date}</p>
                  <p>{eventItem.time}</p>
                  <p>{eventItem.location}</p>
                  <p>{eventItem.contact}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="w-3/4 h-1/2 bg-blue-500 flex ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 w-1/6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
              />
            </svg>
            <div className="w-5/6 h-full text-wrap truncate ">
              <p>{modelReply}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search / Chat Input */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={isFocused ? "" : "When is the next volunteering event?"}
          className={`transition-all duration-300 ease-in-out p-4 pl-12 rounded-full bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isFocused ? "h-36" : "h-12"
          } w-full`}
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </form>

      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 19a7 7 0 117-7 7 7 0 01-7 7zm0 0l-6 6"
          />
        </svg>
      </div>
    </div>
  );
};

export default SearchBar;
