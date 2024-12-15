import React from "react";
import { useParams } from "react-router-dom";

const DetailedPage = () => {
  const { category, index } = useParams(); // Extract category and index
  const sampleData = {
    Forum: [
      {
        title: "Big Ben",
        openTimes: "9:00 AM - 6:00 PM",
        description: "Iconic clock tower located in London.",
        image: "https://via.placeholder.com/150",
      },
      {
        title: "Tower of London",
        openTimes: "10:00 AM - 5:30 PM",
        description: "Historic castle on the River Thames.",
        image: "https://via.placeholder.com/150",
      },
      {
        title: "London Eye",
        openTimes: "10:00 AM - 8:00 PM",
        description: "Famous observation wheel offering panoramic views.",
        image: "https://via.placeholder.com/150",
      },
      {
        title: "The Shard",
        openTimes: "9:00 AM - 10:00 PM",
        description: "Tallest building in London with an observation deck.",
        image: "https://via.placeholder.com/150",
      },
    ],
    Reporting: [
      {
        title: "British Museum",
        openTimes: "10:00 AM - 6:00 PM",
        description: "Explore world history and culture.",
        image: "https://via.placeholder.com/150",
      },
    ],
    Events: [
      {
        title: "Hyde Park",
        openTimes: "Open 24 hours",
        description: "Relax in one of London's largest parks.",
        image: "https://via.placeholder.com/150",
      },
    ],
    News: [
      {
        title: "Camden Market",
        openTimes: "10:00 AM - 7:00 PM",
        description: "Browse eclectic shops and food stalls.",
        image: "https://via.placeholder.com/150",
      },
    ],
  };


  const cardData = sampleData[category]?.[index];

  if (!cardData) {
    return <div>Card not found</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{cardData.title}</h1>
      <p className="text-gray-600">{cardData.openTimes}</p>
      <p className="mt-4">{cardData.description}</p>
      {cardData.image && <img src={cardData.image} alt={cardData.title} />}
    </div>
  );
};

export default DetailedPage;
