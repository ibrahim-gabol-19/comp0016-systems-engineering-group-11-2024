import React, { useState, useEffect } from "react";
import aiLogo from "../../assets/ai_icon.png";
import { CreateWebWorkerMLCEngine } from "@mlc-ai/web-llm";
import ReactMarkdown from "react-markdown";

const SearchBar = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [modelReply, setModelReply] = useState("");
  const [engine, setEngine] = useState(null);
  const [userQuery, setUserQuery] = useState("");
  const [fullUserQuery, setFullUserQuery] = useState("");
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
    } else {
      setModelReply("Here is what I found.");
    }

    setFullUserQuery(userQuery);
    setUserQuery("");
  };

  useEffect(() => {
    const initModel = async () => {

      try {
        // Create the engine and load the model
        const createdEngine = await CreateWebWorkerMLCEngine(
          new Worker(new URL("../.././workers/worker.js", import.meta.url), {
            type: "module",
          }),
          "Llama-3.2-1B-Instruct-q4f16_1-MLC"
        );

        setEngine(createdEngine); // Store the engine in the state
      } catch (error) {
        console.error("Error while loading model:", error);
        setModelReply("Error while loading model:", error);
      } finally {
      }
    };

    initModel();
  }, []);

  const getReply = async (userQuery, searchResult) => {
    // Because Search has not been implemented yet, I am using template JSON
    setSearchResult(JSON.stringify(templateSearchResult))

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

      }

      const fullReply = await engine.getMessage();


      setModelReply(fullReply);
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

      {/*Large Chat Box*/}
      {fullUserQuery !== "" && (
        <div
          className={` w-full rounded-3xl bg-white border border-gray-300 flex flex-col transition-all duration-200  ${
            fullUserQuery === ""
              ? "max-h-0 opacity-0 pointer-events-none select-none"
              : "h-[650px] max-h-[650px] opacity-100 pointer-events-auto select-auto"
          }  `}
        >
          {/*User message*/}
          <div className=" w-3/4 max-h-1/6 ml-auto my-2 justify-end flex items-center">
            <div className="max-w-5/6 max-h-20 px-3  text-wrap truncate rounded-full bg-green-100 ">
              <p class="text-right text-sm  py-4 "> {fullUserQuery}</p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 w-10 h-10 ml-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </div>
          {/*Cards*/}
          <div className="w-3/4 h-2/6 my-4 mx-4 flex ">
            {templateSearchResult.news.map((newsItem, index) => (
              <div
                key={index}
                className="w-1/3  h-full mx-4 px-2 py-2 rounded-3xl shadow-md bg-gray-50 overflow-hidden"
              >
                <p className="font-bold">{newsItem.title}</p>
                <span className="text-sm text-gray-500">
                  {newsItem.published}
                </span>
                <p className="text-sm">{newsItem.description}</p>
              </div>
            ))}

            {/* Loop over events */}
            {templateSearchResult.events.map((eventItem, index) => (
              <div
                key={index}
                className="w-1/3  h-full mx-4 px-2 py-2 rounded-3xl shadow-md bg-gray-50 overflow-hidden"
              >
                <h3 className="font-bold">{eventItem.title}</h3>
                <p className="text-sm text-gray-500 ">
                  {eventItem.date} | {eventItem.time}
                </p>
                <p className="text-sm text-gray-500">{eventItem.location}</p>
                <p className="text-sm">{eventItem.description}</p>
              </div>
            ))}
          </div>
          {/*AI Response*/}
          <div
            className={`w-3/4 max-h-2/6 justify-start items-center max-h-4/6 my-2  ml-1 flex`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 min-w-10 min-h-10 w-10 h-10 mr-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
              />
            </svg>
            <div className="max-w-5/6  px-3  text-wrap font-sm text-sm truncate rounded-3xl bg-blue-100 ">
              {/* <p class="py-4">{modelReply}</p> */}
              <ReactMarkdown className="font-sm py-4">{modelReply}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
      <div
        className={`flex transition-all h-12 duration-300 ease-in-out rounded-full bg-white text-black border border-gray-300 items-center ${
          isFocused ? "w-8/12 outline-none ring-2 ring-blue-500" : "w-5/12"
        }`}
      >
        <div className="w-1/12 ml-1 flex justify-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19a7 7 0 117-7 7 7 0 01-7 7zm0 0l-6 6"
            />
          </svg>
        </div>
        <div className="w-full h-full">
          <form
            onSubmit={handleSubmit}
            className="w-full h-full flex outline-none bg-transparent text-black transition-all"
          >
            <input
              type="text"
              placeholder={
                isFocused ? "" : "When is the next volunteering event?"
              }
              className="w-full h-full outline-none bg-transparent text-black transition-all"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              aria-label="Search for volunteering events"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
