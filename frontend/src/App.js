import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/home/HomePage";
// import NewsPage from "./pages/news/NewsPage";
import EventsPage from "./pages/events/EventsPage";
import ContentManagementSystem from './pages/contentmanagementsystem/ContentManagementSystem';
import DetailedPage from "./pages/contentmanagementsystem/DetailedPage"
import DetailedArticlePage from "./pages/contentmanagementsystem/DetailedArticlePage"
import DetailedEventPage from "./pages/contentmanagementsystem/DetailedEventPage"


const App = () => {
  return (
    <div>
      <Router>
        <div className="bg-gray-100 text-black min-h-screen"> {/* Updated background color to gray-100 */}
          <Header />
          <div className="pt-20">
            <Routes>
              <Route path="/" element={<HomePage />} />
              {/* <Route path="/news" element={<NewsPage />} /> */}
              <Route path="/events" element={<EventsPage />} />
              <Route path="/contentmanagementsystem" element={<ContentManagementSystem />} />
              <Route path="/contentmanagementsystem/details/articles/:articleId" element={<DetailedArticlePage />} />
              <Route path="/contentmanagementsystem/details/events/:eventId" element={<DetailedEventPage />} />

            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
};
export default App;
