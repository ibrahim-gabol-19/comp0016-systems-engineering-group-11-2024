import React, { useState, useEffect } from "react";
import aiLogo from "../../assets/ai_icon.png";
import { CreateMLCEngine, MLCEngine } from "@mlc-ai/web-llm";

const SearchBar = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [modelReply, setModelReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [engine, setEngine] = useState(null);
  const templateSearchResult = `{
    "news": [
      {
        "title": "New Recycling Initiative Launched",
        "description": "GreenEarth Inc. has introduced a new citywide recycling initiative aimed at reducing waste and promoting sustainability.",
        "published": "24 Dec 2024"
      },
     ],
    "events": [
      {
        "title": "Community Trash Pickup",
        "description": "Join us for a local trash pickup event to help clean up our neighborhood. All supplies will be provided.",
        "date": "30 Dec 2024",
        "time": "9:00 AM",
        "location": "Central Park, GreenEarth City",
        "contact": "volunteer@greenearthinc.com"
      },
      {
        "title": "GreenEarth Social Gathering",
        "description": "A casual get-together for employees and local residents to discuss sustainability efforts and enjoy a fun evening of eco-friendly activities.",
        "date": "26 Dec 2024",
        "time": "6:00 PM",
        "location": "GreenEarth HQ, 123 Sustainability Road",
        "contact": "events@greenearthinc.com"
      },
    ]
  }`;

  const handleSubmit = (userQuery, searchResult) => {
    if (engine) {
      getReply(userQuery, searchResult);
    }
  };

  useEffect(() => {
    const initModel = async () => {
      setLoading(true);

      const initProgressCallback = (progress) => {
        console.log("Model Loading Progress:", progress);
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
      } finally {
        setLoading(false);
      }
    };

    initModel();
  }, []);

  const getReply = async (userQuery, searchResult) => {
    // Because Search has not been implemented yet, I am using template JSON
    searchResult = templateSearchResult;
    
    if (!engine) {
      console.log("Model is still loading...");
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

        Provide up to three bullet points, one for each search result.
        
        Here are the search results:
        ${searchResult}`,
      },
      { role: "user", content: userQuery },
    ];

    try {
      const reply = await engine.chat.completions.create({
        messages,
      });

      setModelReply(reply.choices[0].message);
      console.log(reply.choices[0].message);
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
        <p>Reply: {modelReply.content}</p>
      </div>
      {/* Search Bar */}
      <div className="relative w-full max-w-4xl">
        <input
          type="text"
          placeholder={isFocused ? "" : "When is the next volunteering event?"}
          className={`transition-all duration-300 ease-in-out p-4 pl-12 rounded-full bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isFocused ? "h-36" : "h-12"
          } w-full`}
          onFocus={() => {setIsFocused(true); handleSubmit("THis month's news?")}}
          onBlur={() => setIsFocused(false)}
        />
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
    </div>
  );
};

export default SearchBar;
