import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/home/HomePage";
import NewsPage from "./components/News/NewsPage";
import EventsPage from "./components/Events/EventsPage";
const App = () => {
  return (
    <div>
      <Router>
        <div className="bg-gray-100 text-black min-h-screen"> {/* Updated background color to gray-100 */}
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/event" element={<EventsPage />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};
export default App;
