import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import ForYouCard from "../components/Home/ForYouCard";
import NewsPage from "../components/News/NewsPage";
import EventsPage from "../components/Events/EventsPage";
import Home from "../components/Home";
import MapFilter from "../components/Home/MapFilter"; // MapFilter only for filters and dates
import MapComponent from "../components/Home/MapComponent"; // MapComponent outside of MapFilter

const App = () => {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({
    volunteering: false,
    events: false,
    news: false,
    issues: false,
  });
  const [dates, setDates] = useState({
    from: "",
    to: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/items/") // Your API endpoint
      .then((response) => {
        console.log("Fetched Items:", response.data);
        setItems(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the items!", error);
      });
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleDateChange = (newDates) => {
    setDates(newDates);
  };

  return (
    <div>
      <Router>
        <div className="bg-rose-100 text-black min-h-screen">
          <Header />
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-2/3">
                {/* Pass filters and dates as props to MapComponent */}
                <MapComponent filters={filters} dates={dates} />
              </div>

              <div className="w-full md:w-1/3 md:ml-4">
                {/* Pass filter changes and dates changes to MapFilter */}
                <MapFilter
                  onFilterChange={handleFilterChange}
                  onDateChange={handleDateChange}
                />
              </div>
            </div>

            {/* Display list of items */}
            <h1 className="text-2xl font-bold mb-4">Items List</h1>
            <ul className="list-disc list-inside">
              {items.map((item) => (
                <li key={item.id} className="mb-2">
                  <span className="font-semibold">{item.name}</span> -{" "}
                  {item.description}
                </li>
              ))}
            </ul>
          </div>

          <Routes>
            <Route path="/" element={<ForYouCard />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/event" element={<EventsPage />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
