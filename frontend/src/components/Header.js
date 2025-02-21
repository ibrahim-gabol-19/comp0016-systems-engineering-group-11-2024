import React, {useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Assuming the AuthContext is in this path

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
  const [logo, setLogo] = useState(null);
  const [name, setName] = useState(null);

  // Fetch the company logo from the API
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch(`${API_URL}companyinformation/1/`);
        const data = await response.json();
        setLogo(data.logo); // Set the logo URL from the API response
        setName(data.name);
      } catch (error) {
        console.error("Error fetching company logo:", error);
      }
    };

    fetchLogo();
  }, []);  const handleLogout = () => {
    logout(); // Log the user out
    navigate("/login"); // Redirect to login page
  };

  return (
    <header className="fixed w-full md:w-full flex justify-between items-center p-4 z-50 bg-gray-100 z-10">
      <a
        href="/"
        className="text-3xl font-extrabold text-green-500 hover:scale-110 transition duration-500 flex items-center"
      >
        {/* Use the dynamically fetched logo */}
        {logo ? (
          <img alt="Logo" src={logo} className="w-8 h-8 mr-2" />
        ) : (
          <span className="w-8 h-8 mr-2 bg-gray-300 rounded-full"></span> // Fallback if logo is not available
        )}
        <span>
         {name}
        </span>
      </a>

      <nav className="md:flex">
        {navList.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className="ml-8 text-lg text-black hover:text-green-500 hover:scale-110 transition duration-300"
          >
            {item.data}
          </Link>
        ))}
        {auth.isAuthenticated && (
          <button
            onClick={handleLogout}
            className="ml-8 text-lg text-red-500 hover:text-red-700 transition duration-300"
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
