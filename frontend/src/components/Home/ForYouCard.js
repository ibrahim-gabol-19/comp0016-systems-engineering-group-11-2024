import React from "react";
import EventButton from "./EventButton";
import NewsButton from "./NewsButton";
import VolunteeringButton from "./VolunteeringButton"; // Import the new VolunteeringButton
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa"; // Import FontAwesome icons

const ForYouCard = () => {
  const cards = [
    {
      name: "Jane Doe",
      tag: "News",
      content: "Lorem ipsum dolor sit amet, sapien commodo?",
      comment: "Ajurn hal!",
      media: "https://via.placeholder.com/150",
    },
    {
      name: "John Doe",
      tag: "Event",
      content: "Lorem ipsum dolor sit amet, sapien commodo?",
      comment: "Ajurn hal!",
      media: "https://via.placeholder.com/150",
    },
    {
      name: "Emily Smith",
      tag: "Volunteering",
      content: "Join us in making a difference in the community! 🌍",
      comment: "It's a rewarding experience!",
      media: "https://via.placeholder.com/150",
    },
  ];

  return (
    <div className="p-6 font-sans flex justify-center">
      <div className="w-full max-w-6xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">For You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white shadow-xl rounded-lg p-6 transition-transform transform hover:scale-105 hover:shadow-2xl"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-4xl font-semibold text-gray-700">
                      {card.name[0]}
                    </span>
                  </div>
                  <span className="ml-4 font-semibold text-gray-800 text-xl">
                    {card.name}
                  </span>
                </div>
                <div>
                  {card.tag === "News" ? (
                    <NewsButton />
                  ) : card.tag === "Event" ? (
                    <EventButton />
                  ) : (
                    <VolunteeringButton />
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="mb-6">
                <p className="text-gray-700 text-lg">{card.content}</p>
                <p className="text-gray-500 text-sm mt-2 italic">{card.comment}</p>
                {card.media && (
                  <img
                    src={card.media}
                    alt="Media content"
                    className="mt-4 w-full h-48 object-cover rounded-lg"
                  />
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center text-sm">
                <button className="text-blue-600 hover:text-blue-700 font-medium transform transition-all duration-200 hover:scale-110 py-2 px-4 rounded-lg">
                  Reply
                </button>
                <div className="flex space-x-4 text-gray-500">
                  <button className="text-gray-600 hover:text-gray-700 transform transition-all duration-300 hover:scale-110 p-2 rounded-full hover:bg-gray-100">
                    <FaThumbsUp className="text-xl" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-700 transform transition-all duration-300 hover:scale-110 p-2 rounded-full hover:bg-gray-100">
                    <FaThumbsDown className="text-xl" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForYouCard;



