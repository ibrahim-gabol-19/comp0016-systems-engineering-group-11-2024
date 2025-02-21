import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Assuming the AuthContext is in this path
import { CompanyContext } from "../context/CompanyContext";
const API_URL = process.env.REACT_APP_API_URL;

const navList = [
  {
    id: 1,
    data: "Home",
    path: "/",
  },
  {
    id: 3,
    data: "Reporting",
    path: "/reporting", // Link to Reporting
  },
  {
    id: 4,
    data: "Events",
    path: "/events",
  },
  {
    id: 6,
    data: "Manage",
    path: "/contentmanagementsystem",
  },
];

const Header = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const { main_color, logo, name } = useContext(CompanyContext);
  // Fetch the company logo from the API
  const handleLogout = () => {
    logout(); // Log the user out
    navigate("/login"); // Redirect to login page
  };

  return (
    <header className="fixed w-full md:w-full flex justify-between items-center p-4 z-50 bg-gray-100 z-10">
      <a
        href="/"
        style={{ color: main_color }}
        className="text-3xl font-extrabold hover:scale-110 transition duration-500 flex items-center"
      >
        {/* Use the dynamically fetched logo */}
        {logo ? (
          <img alt="Logo" src={logo} className="w-8 h-8 mr-2" />
        ) : (
          <span className="w-8 h-8 mr-2 bg-gray-300 rounded-full"></span> // Fallback if logo is not available
        )}
        <span>{name}</span>
      </a>
      <nav className="md:flex">
        {navList.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            style={{
              color: "black", // Default color
              transition: "color 0.3s, transform 0.3s",
            }}
            className="ml-8 text-lg hover:scale-110"
            onMouseEnter={(e) => (e.target.style.color = main_color)} // Set hover color
            onMouseLeave={(e) => (e.target.style.color = "black")} // Reset to default
          >
            {item.data}
          </Link>
        ))}
        {auth.isAuthenticated && (
          <button
            onClick={handleLogout}
            style={{
              color: "red", // Default color
              transition: "color 0.3s",
            }}
            className="ml-8 text-lg"
            onMouseEnter={(e) => (e.target.style.color = "red")} // Set hover color
            onMouseLeave={(e) => (e.target.style.color = "red")} // Reset to default
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
