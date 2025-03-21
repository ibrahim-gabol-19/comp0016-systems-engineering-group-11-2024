import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";

const API_URL = import.meta.env.VITE_API_URL;

const DetailedArticlePageView = () => {
  const { articleId } = useParams();
  console.log("Article ID from URL:", articleId);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(API_URL+`articles/${articleId}/`)
      .then((response) => {
        setArticle(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching article:", error);
        setError("Failed to load article. It may not exist.");
        setLoading(false);
      });
  }, [articleId]);

  if (loading) return <p className="text-center text-lg">Loading article details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!article) return <p className="text-center text-red-500">Article not found.</p>;

  const { title, content, author, description, main_image } = article;

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
    <Header />
    <div className="pt-20"></div>
    <div className="w-screen h-full flex justify-center items-start overflow-auto p-6 bg-gray-100 rounded-lg">
      <div className="max-w-3xl w-full bg-white p-6 rounded-md shadow-md">
        
        {/* Back Button */}
        <button
            onClick={handleBack}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                </svg>
            </button>

        {/* Title & Author */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-gray-900 text-center flex-1">{title}</h1>
          <p className="text-lg text-gray-600 ml-4">{author}</p>
        </div>

        {/* Image Section */}
        {main_image && (
          <div className="mt-4">
            <img
              src={main_image}
              alt="Main"
              className="w-full h-64 object-cover rounded-md shadow-md"
              loading="lazy"
            />
          </div>
        )}

         {/* Description Section */}
         <p className="text-lg mt-6 text-gray-900 text-center break-words overflow-hidden">
            {description}
        </p>

        {/* Main Content */}
        <p className="text-lg mt-6 text-gray-800 text-center" style={{ whiteSpace: "pre-wrap" }}>
          {content}
        </p>
      </div>
    </div>
    </div>
  );
};

export default DetailedArticlePageView;
