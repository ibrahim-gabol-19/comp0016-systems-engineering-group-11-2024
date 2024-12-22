import React from "react";
import EventButton from "./EventButton";
import NewsButton from "./NewsButton";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const ForYouCard = () => {
  const cards = [
    {
      name: "Jane Doe",
      tag: "News",
      content: "Lorem ipsum dolor sit amet, sapien commodo?",
      comment: "Ajurn hal!",
      media: "https://via.placeholder.com/300x200", // Media image URL
    },
    {
      name: "John Doe",
      tag: "Event",
      content: "Lorem ipsum dolor sit amet, sapien commodo?",
      comment: "Ajurn hal!",
      media: "https://via.placeholder.com/300x200",
    },
    {
      name: "Emily Smith",
      tag: "Event",
      content: "Join us in making a difference in the community! 🌍",
      comment: "It's a rewarding experience!",
      media: "https://via.placeholder.com/300x200",
    },
  ];

  return (
    <div className="p-6 font-sans">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">For You</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="group bg-gray-100 shadow-lg rounded-lg overflow-hidden flex flex-col sm:flex-row transform transition-transform duration-300 hover:scale-105 relative"
          >
            {/* Media Section */}
            {card.media && (
              <img
                src={card.media}
                alt="Media content"
                className="sm:w-1/3 w-full h-48 sm:h-auto object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}

            {/* Content Section */}
            <div className="p-4 flex-1">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold text-white mr-3 group-hover:bg-gray-500 transition-colors duration-300">
                    {card.name[0]}
                  </div>
                  <p className="font-semibold text-lg text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                    {card.name}
                  </p>
                </div>
                {card.tag === "News" ? (
                  <NewsButton />
                ) : card.tag === "Event" ? (
                  <EventButton />
                ) : null}
              </div>
              <p className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                {card.content}
              </p>
              <p className="text-gray-500 text-sm mt-2 italic group-hover:text-gray-700 transition-colors duration-300">
                {card.comment}
              </p>

              {/* Thumbs-up and Thumbs-down positioned at bottom right */}
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button className="text-gray-600 hover:text-gray-700 transform transition-all duration-300 hover:scale-110 p-1 rounded-full">
                  <FaThumbsUp className="text-xl" />
                </button>
                <button className="text-gray-600 hover:text-gray-700 transform transition-all duration-300 hover:scale-110 p-1 rounded-full">
                  <FaThumbsDown className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForYouCard;
