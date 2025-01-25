import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/home/HomePage";
import EventsPage from "./pages/events/EventsPage";
import ContentManagementSystem from './pages/contentmanagementsystem/ContentManagementSystem';
import DetailedArticlePage from "./pages/contentmanagementsystem/DetailedArticlePage"
import DetailedEventPage from "./pages/contentmanagementsystem/DetailedEventPage"
import ReportsPage from "./pages/reporting/ReportsPage"

const App = () => {

  
  return (
    <div>
      <Router>
        <div className="bg-gray-100 text-black min-h-screen">
          <Header />
          <div className="pt-20">
            {/* Routing */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/contentmanagementsystem" element={<ContentManagementSystem />} />
              <Route path="/contentmanagementsystem/details/articles/:index" element={<DetailedArticlePage />} />
              <Route path="/contentmanagementsystem/details/events/:index" element={<DetailedEventPage />} />
              <Route path="/reporting" element={<ReportsPage></ReportsPage>} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
};
export default App;
