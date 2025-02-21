import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/home/HomePage";
import EventsPage from "./pages/events/EventsPage";
import ContentManagementSystem from "./pages/contentmanagementsystem/ContentManagementSystem";
import DetailedArticlePage from "./pages/contentmanagementsystem/DetailedArticlePage";
import DetailedEventPage from "./pages/contentmanagementsystem/DetailedEventPage";
import ReportsPage from "./pages/reporting/ReportsPage";
import SignUp from "./pages/account/SignUp";
import Login from "./pages/account/Login";
import ProtectedRoute from "./pages/account/ProtectedRoute";

const API_URL = process.env.REACT_APP_API_URL;

const App = () => {
  const [companyName, setCompanyName] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}companyinformation/1/`)
      .then((response) => response.json())
      .then((data) => {
        setCompanyName(data.name);
        setCompanyLogo(data.logo); // Assume 'data.logo' contains the URL to the logo image

        // Update the tab title dynamically
        document.title = data.name || "Default Title";

        // Update the favicon dynamically (if the logo URL exists)
        if (data.logo) {
          const faviconLink = document.querySelector("link[rel='icon']");
          if (faviconLink) {
            faviconLink.href = `${data.logo}?${new Date().getTime()}`; // Add a timestamp to bust the cache
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching company info:", error);
        document.title = "Default Title"; // Set a default title in case of an error

        // Optionally, set a fallback favicon in case of an error
        const faviconLink = document.querySelector("link[rel='icon']");
        if (faviconLink) {
          faviconLink.href = "%PUBLIC_URL%/favicon.ico"; // Fallback to a default favicon
        }
      });
  }, []);

  return (
    <div>
      <AuthProvider>
        <Router>
          <div className="bg-gray-100 text-black min-h-screen">
            <Routes>
              {/* Public Routes */}
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route
                  path="/contentmanagementsystem"
                  element={<ContentManagementSystem />}
                />
                <Route
                  path="/contentmanagementsystem/details/articles/:articleId"
                  element={<DetailedArticlePage />}
                />
                <Route
                  path="/contentmanagementsystem/details/events/:eventId"
                  element={<DetailedEventPage />}
                />
                <Route path="/reporting" element={<ReportsPage />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </div>
  );
};

export default App;
