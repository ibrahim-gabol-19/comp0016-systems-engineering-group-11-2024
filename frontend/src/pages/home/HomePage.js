import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../../components/home/SearchBar"; // Import the SearchBar component
import ForYouCard from "../../components/home/ForYouCard";
import MapFilter from "../../components/home/MapFilter";
import MapComponent from "../../components/home/MapComponent";
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
      <div className="container mx-auto px-0 py-8"> {/* Removed max-width */}
        <div className="flex flex-col md:flex-row gap-6"> {/* Flex layout for full width */}
          <div className="w-full md:w-4/5"> {/* MapComponent takes 4/5th of the width */}
            <MapComponent filters={filters} dates={dates} />
          </div>
          <div className="w-full md:w-1/5"> {/* MapFilter takes 1/5th */}
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