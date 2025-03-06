import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Assuming the AuthContext is in this path
import { CompanyContext } from "../context/CompanyContext";

const navList = [
  {
    id: 1,
    data: "Home",
    path: "/",
  },
  {
    id: 3,
    data: "Reporting",
    path: "/reporting",
  },
  {
    id: 4,
    data: "Events",
    path: "/events",
  },
];

const Header = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const { main_color, logo, name } = useContext(CompanyContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout(); // Log the user out
    navigate("/login"); // Redirect to login page
    setIsMenuOpen(false); // Close the mobile menu if open
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="fixed w-full flex justify-between items-center p-4 z-50 bg-gray-100">
      <a
        href="/"
        style={{ color: main_color }}
        className=" text-xl md:text-3xl font-extrabold hover:scale-110 transition duration-500 flex items-center"
      >
        {logo ? (
          <img alt="Logo" src={logo} className="w-8 h-8 mr-2" />
        ) : (
          <span className="w-8 h-8 mr-2 bg-gray-300 rounded-full"></span>
        )}
        <span>{name}</span>
      </a>
      <div className="flex items-center">
        {/* Desktop Navigation */}
        <nav className="hidden md:flex">
          {navList.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              style={{
                color: "black",
                transition: "color 0.3s, transform 0.3s",
              }}
              className="ml-8 text-lg hover:scale-110"
              onMouseEnter={(e) => (e.target.style.color = main_color)}
              onMouseLeave={(e) => (e.target.style.color = "black")}
            >
              {item.data}
            </Link>
          ))}
          {auth.user?.is_superuser && (
            <Link
              to="/contentmanagementsystem"
              style={{
                color: "black",
                transition: "color 0.3s, transform 0.3s",
              }}
              className="ml-8 text-lg hover:scale-110"
              onMouseEnter={(e) => (e.target.style.color = main_color)}
              onMouseLeave={(e) => (e.target.style.color = "black")}
            >
              Manage
            </Link>
          )}
          {auth.isAuthenticated && (
            <button
              onClick={handleLogout}
              style={{
                color: "red",
                transition: "color 0.3s",
              }}
              className="ml-8 text-lg"
              onMouseEnter={(e) => (e.target.style.color = "red")}
              onMouseLeave={(e) => (e.target.style.color = "red")}
            >
              Logout
            </button>
          )}
        </nav>
        {/* Hamburger Icon for Mobile */}
        <button
          className="md:hidden ml-4 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="absolute top-full left-0 right-0 bg-gray-100 flex flex-col items-center py-4 md:hidden">
          {navList.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              style={{
                color: "black",
                transition: "color 0.3s, transform 0.3s",
              }}
              className="my-2 text-lg hover:scale-110"
              onClick={closeMenu}
              onMouseEnter={(e) => (e.target.style.color = main_color)}
              onMouseLeave={(e) => (e.target.style.color = "black")}
            >
              {item.data}
            </Link>
          ))}
          {auth.user?.is_superuser && (
            <Link
              to="/contentmanagementsystem"
              style={{
                color: "black",
                transition: "color 0.3s, transform 0.3s",
              }}
              className="my-2 text-lg hover:scale-110"
              onClick={closeMenu}
              onMouseEnter={(e) => (e.target.style.color = main_color)}
              onMouseLeave={(e) => (e.target.style.color = "black")}
            >
              Manage
            </Link>
          )}
          {auth.isAuthenticated && (
            <button
              onClick={handleLogout}
              style={{
                color: "red",
                transition: "color 0.3s",
              }}
              className="my-2 text-lg"
              onMouseEnter={(e) => (e.target.style.color = "red")}
              onMouseLeave={(e) => (e.target.style.color = "red")}
            >
              Logout
            </button>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
