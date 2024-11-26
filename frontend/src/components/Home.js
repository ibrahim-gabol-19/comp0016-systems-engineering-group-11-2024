import React from "react";
import NewsCard from "./NewsCard";

const newsData = [
  {
    image: "image1.jpg",
    title: "News Title 1",
    description: "Lorem ipsum dolor sit amet...",
    link: "/news/1",
  },
  {
    image: "image1.jpg",
    title: "News Title 1",
    description: "Lorem ipsum dolor sit amet...",
    link: "/news/1",
  },
  {
    image: "image1.jpg",
    title: "News Title 1",
    description: "Lorem ipsum dolor sit amet...",
    link: "/news/1",
  },
  {
    image: "image1.jpg",
    title: "News Title 1",
    description: "Lorem ipsum dolor sit amet...",
    link: "/news/1",
  },
  {
    image: "image1.jpg",
    title: "News Title 1",
    description: "Lorem ipsum dolor sit amet...",
    link: "/news/1",
  },
  {
    image: "image1.jpg",
    title: "News Title 1",
    description: "Lorem ipsum dolor sit amet...",
    link: "/news/1",
  },
];

const Home = () => {
  return (
    <div className="news-grid pt-20 flex flex-wrap gap-4 justify-center">
      {newsData.map((item, index) => (
        <NewsCard key={index} {...item} />
      ))}
    </div>
  );
};

export default Home;

