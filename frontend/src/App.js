import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import HomePage from "./pages/home/HomePage";
import EventsPage from "./pages/events/EventsPage";
import ContentManagementSystem from "./pages/contentmanagementsystem/ContentManagementSystem";
import DetailedArticlePage from "./pages/contentmanagementsystem/DetailedArticlePage";
import DetailedEventPage from "./pages/contentmanagementsystem/DetailedEventPage";
import ReportsPage from "./pages/reporting/ReportsPage";
import SignUp from "./components/account/SignUp";
import Login from "./components/account/Login";
import ProtectedRoute from "./components/account/ProtectedRoute";

const App = () => {
  return (
    <div>
      <AuthProvider>
        <Router>
          <div className="bg-gray-100 text-black min-h-screen">
            <Header />
            <div className="pt-20">
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
          </div>
        </Router>
      </AuthProvider>
    </div>
  );
};

export default App;
