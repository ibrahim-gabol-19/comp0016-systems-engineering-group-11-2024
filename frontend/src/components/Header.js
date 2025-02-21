import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/earth.png";
import { useAuth } from "../context/AuthContext"; // Ensure AuthContext provides isSuperuser

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

  const handleLogout = () => {
    logout(); // Log the user out
    navigate("/login"); // Redirect to login page
  };

  return (
    <header className="fixed w-full md:w-full flex justify-between items-center p-4 z-50 bg-gray-100">
      <a
        href="/"
        className="text-3xl font-extrabold text-green-500 hover:scale-110 transition duration-500 flex items-center "
      >
        <img alt="Logo" src={Logo} className="w-8 h-8 mr-2 " />
        <span>
          Green{" "}
          <a href="/" className="text-sm text-green">
            Inc
          </a>
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

        {/* Only show "Manage" if user is superuser */}
        {auth.user?.is_superuser && (
          <Link
            to="/contentmanagementsystem"
            className="ml-8 text-lg text-black hover:text-green-500 hover:scale-110 transition duration-300"
          >
            Manage
          </Link>
        )}

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
