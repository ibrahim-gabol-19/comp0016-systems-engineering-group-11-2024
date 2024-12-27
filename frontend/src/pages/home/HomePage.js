import React, { useEffect, useState } from "react";
import { CreateMLCEngine, MLCEngine } from "@mlc-ai/web-llm";
import axios from "axios";
import SearchBar from "../../components/Home/SearchBar"; // Import the SearchBar component
import ForYouCard from "../../components/Home/ForYouCard";
import MapFilter from "../../components/Home/MapFilter";
import MapComponent from "../../components/Home/MapComponent";

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({
    volunteering: true,
    events: true,
    news: true,
    issues: true,
  });
  const [dates, setDates] = useState({
    from: "",
    to: "",
  });

  // Initialize the model and handle the chat completion
  const [modelReply, setModelReply] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/items/")
      .then((response) => {
        console.log("Fetched Items:", response.data);
        setItems(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the items!", error);
      });
  }, []);

  useEffect(() => {
    // Function to handle model initialization and chat completion
    const initModelAndGetReply = async () => {
      setLoading(true); // Set loading to true when model is being initialized

      // Initialize with a progress callback
      const initProgressCallback = (progress) => {
        console.log("Model loading progress:", progress);
      };

      try {
        // Create the engine and load the model
        const engine = await CreateMLCEngine(
          "Llama-3.2-1B-Instruct-q4f16_1-MLC",
          {
            initProgressCallback,
          }
        );

        // Define the messages for the chat
        const messages = [
          { role: "system", content: "You are a helpful AI assistant." },
          { role: "user", content: "Hello!" },
        ];

        // Request a response from the model
        const reply = await engine.chat.completions.create({ messages });

        // Store the model's response
        setModelReply(reply.choices[0].message);
        console.log(messages);
        console.log(reply.choices[0].message);
      } catch (error) {
        console.error("Error while getting model reply:", error);
      } finally {
        setLoading(false); // Set loading to false once the request is complete
      }
    };

    // Call the function to initialize the model and get the response
    initModelAndGetReply();
  }, []); // Empty dependency array means it runs once when the component mounts

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  const handleDateChange = (newDates) => {
    setDates(newDates);
  };
  return (
    <div>
      {/* Add SearchBar component below the Header */}

      <div className="container mx-auto px-4 py-4">
        <SearchBar />
      </div>
      <div className="container mx-auto px-0 py-8">
        {" "}
        {/* Removed max-width */}
        <div className="flex flex-col md:flex-row gap-6">
          {" "}
          {/* Flex layout for full width */}
          <div className="w-full md:w-4/5">
            {" "}
            {/* MapComponent takes 4/5th of the width */}
            <MapComponent filters={filters} dates={dates} />
          </div>
          <div className="w-full md:w-1/5">
            {" "}
            {/* MapFilter takes 1/5th */}
            <MapFilter
              onFilterChange={handleFilterChange}
              onDateChange={handleDateChange}
            />
          </div>
        </div>
        <ForYouCard />
      </div>
    </div>
  );
};
export default HomePage;
