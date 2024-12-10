import React, { useState } from "react";
import "./MapFilter.css";

const MapFilter = () => {
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

  const handleCheckboxChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.checked,
    });
  };

  const handleDateChange = (e) => {
    setDates({
      ...dates,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="map-filter">
      {/* Search Map with Icon */}
      <div className="search-map-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-bar"
          placeholder="Search Map"
        />
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <h3 className="filter-title">Filter By</h3>
        <label>
          <input
            type="checkbox"
            name="volunteering"
            checked={filters.volunteering}
            onChange={handleCheckboxChange}
          />
          Volunteering 🙌
        </label>
        <label>
          <input
            type="checkbox"
            name="events"
            checked={filters.events}
            onChange={handleCheckboxChange}
          />
          Events 📍
        </label>
        <label>
          <input
            type="checkbox"
            name="news"
            checked={filters.news}
            onChange={handleCheckboxChange}
          />
          News 📰
        </label>
        <label>
          <input
            type="checkbox"
            name="issues"
            checked={filters.issues}
            onChange={handleCheckboxChange}
          />
          Issues ⚠️
        </label>
      </div>

      {/* Dates Section */}
      <div className="dates-section">
        <h3 className="dates-title">Dates</h3>
        <label>
          From:{" "}
          <input
            type="date"
            name="from"
            value={dates.from}
            onChange={handleDateChange}
            className="calendar-input"
          />
        </label>
        <label>
          To:{" "}
          <input
            type="date"
            name="to"
            value={dates.to}
            onChange={handleDateChange}
            className="calendar-input"
          />
        </label>
      </div>
    </div>
  );
};

export default MapFilter;





