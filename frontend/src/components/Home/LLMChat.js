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
      {
        "title": "Tree Planting Campaign Success",
        "description": "Over 500 trees were planted in the local park as part of our green initiative to combat deforestation.",
        "published": "20 Dec 2024"
      }
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
        "date": "5 Jan 2025",
        "time": "6:00 PM",
        "location": "GreenEarth HQ, 123 Sustainability Road",
        "contact": "events@greenearthinc.com"
      },
      {
        "title": "Eco-Friendly DIY Workshop",
        "description": "A hands-on workshop where you can learn how to create eco-friendly products at home using sustainable materials.",
        "date": "10 Jan 2025",
        "time": "2:00 PM",
        "location": "GreenEarth Community Center",
        "contact": "workshops@greenearthinc.com"
      }
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
    engine.resetChat()
    searchResult = templateSearchResult;
    if (!engine) {
      console.log("Model is still loading...");
      return; // Exit if the engine is not ready
    }

    // Define the messages for the chat
    const messages = [
      {
        role: "system",
        content: `You are an AI assistant for GreenEarth Inc., a company dedicated to sustainability and environmental preservation. Your task is to assist visitors on the website by providing relevant information quickly and accurately. When someone asks a question, tell them about the relevant information.. Be polite, informative, and helpful. Answer questions related to GreenEarth Inc.'s events, news, atmosphere.

        Remember to keep your responses concise, user-friendly, and relevant to their needs.
        
        Please ensure you are polite and helpful at all times.
        
        This is the search result:
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
      console.log(messages)
    } catch (error) {
      console.error("Error during chat completion:", error);
    }
  };

  const handleClick = () => {
    if (engine) {
      getReply("What's coming up? And how many messages have I sent?");
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
