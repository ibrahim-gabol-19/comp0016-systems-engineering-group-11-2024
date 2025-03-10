import React from "react";
import EventButton from "./EventButton";
import NewsButton from "./NewsButton";

import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const ForYouCard = () => {
  const cards = [
      {
      name: "Liam Green",
      tag: "News",
      content: "The City Council has approved a new green energy initiative to reduce carbon emissions by 20% by 2027.",
      comment: "That's a bold move for a greener London!",
      media: "https://picsum.photos/600",
    },
    {
      name: "Sophie Carter",
      tag: "Event",
      content: "Walk with us! Join the 'London Heritage Walk' on Sunday to explore the rich history of our city. 🏙️",
      comment: "Sounds like a lovely day out!",
      media: "https://picsum.photos/500",
    },
    {
      name: "James Smith",
      tag: "News",
      content: "New solar panel installations will be implemented across London council buildings to improve energy efficiency.",
      comment: "Excited to see this change!",
      media: "https://picsum.photos/550",
    },
    {
      name: "Olivia Johnson",
      tag: "Event",
      content: "Help plant new trees in Regent’s Park as part of the 'Greening London' initiative this weekend! 🌳",
      comment: "A great way to contribute to the environment!",
      media: "https://picsum.photos/650",
    },
    {
      name: "Daniel Lee",
      tag: "Event",
      content: "Looking for volunteers to assist with the London Soup Kitchen project. Every little bit helps!",
      comment: "Great cause, count me in!",
      media: "https://picsum.photos/700",
    },
    {
      name: "Maya Patel",
      tag: "News",
      content: "London City Council will be offering free composting workshops for residents to reduce food waste. 🥕",
      comment: "This is a fantastic idea!",
      media: "https://picsum.photos/450",
    },
  ];


  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">For You</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="group bg-gray-100 shadow-lg rounded-lg overflow-hidden flex flex-col sm:flex-row transform transition-transform duration-300 hover:scale-105"
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

              {/* Reply and Thumbs-Up/Down in the Same Line */}
              <div className="flex items-center justify-between mt-3">
                {/* Reply Button */}
                <button className="bg-blue-500 text-white text-sm font-semibold py-1 px-3 rounded-full hover:bg-blue-600 transform transition-all duration-300 hover:scale-105">
                  Reply
                </button>

                {/* Thumbs-Up and Thumbs-Down */}
                <div className="flex space-x-2">
                  <button className="text-gray-600 hover:text-gray-700 transform transition-all duration-300 hover:scale-110 p-1 rounded-full">
                    <FaThumbsUp className="text-xl" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-700 transform transition-all duration-300 hover:scale-110 p-1 rounded-full">
                    <FaThumbsDown className="text-xl" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForYouCard;

