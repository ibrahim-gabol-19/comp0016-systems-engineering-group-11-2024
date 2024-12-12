import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import Routes and Route
import Header from "../components/Header";
import ForYouCard from "../components/Home/ForYouCard";
import NewsPage from "../components/News/NewsPage"; 
import EventsPage from "../components/Events/EventsPage";

const App = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/items/")
      .then((response) => {
        console.log("Fetched Items:", response.data); // Log API response
        setItems(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the items!", error);
      });
  }, []);

  return (
    <Router>
      <div className="bg-rose-100 text-black min-h-screen">
        <Header />
        <div className="p-6">
          <Routes>
            {/* Define Routes */}
            <Route path="/" element={<ForYouCard />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/event" element={<EventsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
