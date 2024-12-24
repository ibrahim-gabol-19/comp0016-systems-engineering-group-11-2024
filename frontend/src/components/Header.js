import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import Logo from "../assets/earth.png";

const navList = [
  {
    id: 1,
    data: "Home",
    path: "/",
  },
  {
    id: 2,
    data: "Forum",
    path: "/forum",
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
    id: 5,
    data: "News",
    path: "/news", 
  },
];

const Header = () => {
  return (
    <header className="fixed w-full md:w-full flex justify-between items-center p-4 z-50 bg-gray-100 z-10">
      <a
        href="#"
        className="text-3xl font-extrabold text-green-500 hover:scale-110 transition duration-500 flex items-center "
      >
        <img src={Logo} className="w-8 h-8 mr-2 " />
        <span>
          Green{" "}
          <a href="#" className="text-sm text-green">
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
      </nav>
    </header>
  );
};

export default Header;