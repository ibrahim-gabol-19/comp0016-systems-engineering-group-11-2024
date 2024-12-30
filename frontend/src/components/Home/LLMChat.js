import { useEffect, useState } from "react";
import { CreateMLCEngine, MLCEngine } from "@mlc-ai/web-llm";

// Initialize the model and handle the chat completion
const LLMChat = () => {
  const [modelReply, setModelReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [engine, setEngine] = useState(null); // State to store the engine
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
        setLoading(false); // Set loading to false once the request is complete
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

    await engine.resetChat()

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

  const handleClick = (userQuery, searchResult) => {
    if (engine) {
      getReply(userQuery, searchResult);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading model...</p>
      ) : (
        <div>
          <p>Reply: {modelReply.content}</p>
          <button onClick={handleClick}> Button </button>
          {/* You can trigger getReply() based on user input */}
        </div>
      )}
    </div>
  );
};

export default LLMChat;
