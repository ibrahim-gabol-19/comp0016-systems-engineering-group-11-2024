import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "../../components/home/SearchBar";
import ForYouCard from "../../components/home/ForYouCard";
import MapFilter from "../../components/home/MapFilter";
import MapComponent from "../../components/home/MapComponent";
import Header from "../../components/Header";

const HomePage = () => {
  // Existing state for MapFilter.
  const [filters, setFilters] = useState({
    volunteering: true,
    events: true,
    news: true,
    issues: true,
  });
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const [dates, setDates] = useState({ from: today, to: "" });
  const [reports, setReports] = useState([]);
  const [events, setEvents] = useState([]);

  // Fetch reports and events.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [reportsResponse, eventsResponse] = await Promise.all([
          axios.get(process.env.REACT_APP_API_URL + "reports/", { headers }),
          axios.get(process.env.REACT_APP_API_URL + "events/", { headers }),
        ]);

        if (reportsResponse.status === 200) {
          setReports(reportsResponse.data);
        }
        if (eventsResponse.status === 200) {
          setEvents(eventsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleDateChange = (newDates) => {
    setDates(newDates);
  };

  return (
    <div>
      <Header />
      <div className="pt-20"></div>
      {/* Search Bar */}
      <div className="container mx-auto px-4 py-4">
        <SearchBar />
      </div>
      <div className="container mx-auto px-0 py-8">
        {/* Map and MapFilter */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="w-full md:w-3/4">
            <MapComponent
              filters={filters}
              dates={dates}
              reports={reports}
              events={events}
            />
          </div>
          <div className="w-full md:w-1/4 flex justify-center">
            <MapFilter
              onFilterChange={handleFilterChange}
              onDateChange={handleDateChange}
            />
          </div>
        </div>
        {/* For You Cards (with integrated Filter and Create Post buttons) */}
        <ForYouCard />
      </div>
    </div>
  );
};

export default HomePage;
