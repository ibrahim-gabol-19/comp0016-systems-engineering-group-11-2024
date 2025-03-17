// src/components/NewsCard.js
import React from "react";
import { Link } from "react-router-dom";

const NewsCard = ({ image, title, description, link }) => {
  return (
    <div className="w-80 h-80 group relative cursor-pointer overflow-hidden rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <Link to={link}>
        {/* Image */}
        <img src={image} alt={title} className="w-full h-56 object-cover" />
        {/* Text overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-60 text-white rounded-b-lg">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm">{description}</p>
        </div>
      </Link>
    </div>
  );
};

export default NewsCard;
