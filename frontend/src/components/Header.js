import React, { useContext } from "react";
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
  // Fetch the company logo from the API
  const handleLogout = () => {
    logout(); // Log the user out
    navigate("/login"); // Redirect to login page
  };

  return (
    <header className="fixed w-full md:w-full flex justify-between items-center p-4 z-50 bg-gray-100">
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

        {/* Only show "Manage" if user is superuser */}
        {auth.user?.is_superuser && (
          <div className="flex">
            <Link
              to="/contentmanagementsystem"
              style={{
                color: "black", // Default color
                transition: "color 0.3s, transform 0.3s",
              }}
              className="ml-8 text-lg hover:scale-110"
              onMouseEnter={(e) => (e.target.style.color = main_color)} // Set hover color
              onMouseLeave={(e) => (e.target.style.color = "black")} // Reset to default
            >
              Manage
            </Link>
            <Link
              to="/miscellaneous"
              style={{
                color: "black", // Default color
                transition: "color 0.3s, transform 0.3s",
              }}
              className="ml-8 text-lg hover:scale-110"
              onMouseEnter={(e) => (e.target.style.color = main_color)} // Set hover color
              onMouseLeave={(e) => (e.target.style.color = "black")} // Reset to default
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="black"
                className="size-6 inline-block mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </Link>

          </div>
        )}

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
    </header >
  );
};

export default Header;
