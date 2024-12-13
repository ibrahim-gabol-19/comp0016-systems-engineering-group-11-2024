import React from "react";
import Logo from "../assets/earth.png";

const navList = [
  {
    id: 1,
    data: "Home",
  },
  {
    id: 2,
    data: "Forum",
  },
  {
    id: 3,
    data: "Reporting",
  },
  {
    id: 4,
    data: "Events",
  },
  {
    id: 5,
    data: "News",
  },
];

const Header = () => {
  return (
    <header className=" w-[1080px]  md:w-full flex justify-between items-center p-4 z-50 bg-transparent z-10">
      <a
        href="#"
        className="text-3xl font-extrabold text-green-500  hover:scale-110 transition duration-500 flex items-center "
      >
        {" "}
        <img src={Logo} className="w-8 h-8 mr-2 " />
        <span>
          Green{" "}
          <a href="#" className="text-sm text-green">
            Inc
          </a>
        </span>
      </a>
      <nav className=" md:flex ">
        {navList.map((item) => (
          <a
            key={item.id}
            href="#"
            className="  ml-8 text-lg text-black hover:text-green-500  hover:scale-110 transition duration-300"
          >
            {item.data}
          </a>
        ))}
      </nav>
    </header>
  );
};

export default Header;
