import React, { useState, useEffect } from "react";
import EventButton from "./EventButton";
import NewsButton from "./NewsButton";

import { FaThumbsUp, FaComment } from "react-icons/fa";
import CreatePostModal from "./CreatePostModal";
import CommentsPopup from "./CommentsPopup";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const ForYouCard = () => {
  const [cards, setCards] = useState([]); // Forum posts state
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null); // Which post's comments to show

  // Fetch forum posts and, for each post, fetch its comment count.
  const fetchForumPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const forumRes = await axios.get(`${API_URL}forums/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const posts = forumRes.data;
      
      // For each post, fetch its comment count.
      const postsWithExtraInfo = await Promise.all(
        posts.map(async (post) => {
          try {
            const commentRes = await axios.get(`${API_URL}comments/`, {
              params: {
                content_type: "forums.forumpost",
                object_id: post.id,
              },
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            // Assume each post has likeCount and liked properties; if not, default them.
            return { 
              ...post, 
              commentCount: commentRes.data.length, 
              likeCount: post.likeCount !== undefined ? post.likeCount : 0, 
              liked: post.liked !== undefined ? post.liked : false 
            };
          } catch (error) {
            console.error("Error fetching extra info for post", post.id, error);
            return { ...post, commentCount: 0, likeCount: 0, liked: false };
          }
        })
      );
      setCards(postsWithExtraInfo);
    } catch (error) {
      console.error("Error fetching forum posts:", error);
    }
  };

  useEffect(() => {
    fetchForumPosts();
  }, []);

  // Handle post creation.
  const handleCreatePost = async (postData) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", postData.title);
      formData.append("content", postData.content);
      formData.append("tags", postData.tags); // Save tags here.
      if (postData.media) formData.append("media", postData.media);

      await axios.post(`${API_URL}forums/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      fetchForumPosts();
    } catch (error) {
      console.error("Error creating forum post:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleOpenComments = (postId) => {
    setSelectedPostId(postId);
  };

  const handleCloseComments = () => {
    setSelectedPostId(null);
  };

  // When a comment is added, update the comment count for that post locally.
  const handleCommentAdded = () => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === selectedPostId
          ? { ...card, commentCount: (card.commentCount || 0) + 1 }
          : card
      )
    );
  };

  // Toggle like status for a post (frontend only).
  const handleToggleLike = (postId) => {
    setCards((prevCards) =>
      prevCards.map((card) => {
        if (card.id === postId) {
          if (card.liked) {
            // Unlike: set liked false, decrement likeCount.
            return { ...card, liked: false, likeCount: (card.likeCount || 0) - 1 };
          } else {
            // Like: set liked true, increment likeCount.
            return { ...card, liked: true, likeCount: (card.likeCount || 0) + 1 };
          }
        }
        return card;
      })
    );
  };

  return (
    <div className="p-6 font-sans">
      {/* "For You" Section Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">For You</h2>
        <button
          onClick={() => setIsCreatePostModalOpen(true)}
          className="bg-blue-500 text-white text-sm font-semibold py-2 px-4 rounded-full hover:bg-blue-600 transform transition-all duration-300 hover:scale-105 flex items-center gap-1"
        >
          <span>+</span> Create Post
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className="group bg-gray-100 shadow-lg rounded-lg overflow-hidden flex flex-col sm:flex-row transform transition-transform duration-300 hover:scale-105"
          >
            {card.media && (
              <img
                src={card.media}
                alt="Media content"
                className="sm:w-1/3 w-full h-48 sm:h-auto object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}
            <div className="p-4 flex-1">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold text-white mr-3">
                    {card.author[0]}
                  </div>
                  <p className="font-semibold text-lg text-gray-800">
                    {card.author}
                  </p>
                </div>
                {card.tags === "News" ? (
                  <NewsButton />
                ) : card.tags === "Event" ? (
                  <EventButton />
                ) : null}
              </div>
              <p className="text-gray-700">{card.content}</p>
              <p className="text-gray-500 text-sm mt-1 italic">
                Tags: {card.tags}
              </p>
              <p className="text-gray-500 text-sm mt-2 italic">
                {formatDate(card.created_at)}
              </p>
              <div className="flex items-center justify-between mt-3">
                <button
                  onClick={() => handleOpenComments(card.id)}
                  className="text-gray-600 hover:text-gray-700 transform transition-all duration-300 hover:scale-110 p-1 rounded-full flex items-center gap-1"
                >
                  <FaComment className="text-xl" />
                  <span className="text-sm">{card.commentCount || 0}</span>
                </button>
                <button
                  onClick={() => handleToggleLike(card.id)}
                  className={`p-1 rounded-full flex items-center gap-1 transition-all duration-300 hover:scale-110 ${
                    card.liked ? "text-blue-500" : "text-gray-600 hover:text-gray-700"
                  }`}
                >
                  <FaThumbsUp className="text-xl" />
                  <span className="text-sm">{card.likeCount || 0}</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Dummy posts for testing (make sure to use "tags" here) */}
        {[
          {
            id: 997,
            name: "Jane Doe",
            tags: "News",
            content: "Green Inc are proud to launch their first prototype! 😁",
            comment: "Awesome news!",
            media: "https://via.placeholder.com/300x200",
          },
          {
            id: 998,
            name: "John Doe",
            tags: "Event",
            content: "Green Inc are hosting their annual conference at the Excel Centre in London!",
            comment: "Sounds interesting!",
            media: "https://via.placeholder.com/300x200",
          },
          {
            id: 999,
            name: "Emily Smith",
            tags: "Volunteering",
            content: "Join us in making a difference in the community! 🌍",
            comment: "It's a rewarding experience!",
            media: "https://via.placeholder.com/300x200",
          },
        ].map((card, index) => (
          <div
            key={`existing-${index}`}
            className="group bg-gray-100 shadow-lg rounded-lg overflow-hidden flex flex-col sm:flex-row transform transition-transform duration-300 hover:scale-105"
          >
            {card.media && (
              <img
                src={card.media}
                alt="Media content"
                className="sm:w-1/3 w-full h-48 sm:h-auto object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}
            <div className="p-4 flex-1">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold text-white mr-3">
                    {card.name[0]}
                  </div>
                  <p className="font-semibold text-lg text-gray-800">
                    {card.name}
                  </p>
                </div>
                {card.tags === "News" ? (
                  <NewsButton />
                ) : card.tags === "Event" ? (
                  <EventButton />

                ) : null}
              </div>
              <p className="text-gray-700">{card.content}</p>
              <p className="text-gray-500 text-sm mt-2 italic">
                {card.comment}
              </p>
              <div className="flex items-center justify-between mt-3">
                <button
                  onClick={() => handleOpenComments(card.id)}
                  className="text-gray-600 hover:text-gray-700 transform transition-all duration-300 hover:scale-110 p-1 rounded-full flex items-center gap-1"
                >
                  <FaComment className="text-xl" />
                  <span className="text-sm">{card.comments?.length || 0}</span>
                </button>
                <div className="flex space-x-2">
                  <button
                    className="text-gray-600 hover:text-gray-700 transform transition-all duration-300 hover:scale-110 p-1 rounded-full"
                  >
                    <FaThumbsUp className="text-xl" />
                  </button>
                  {/* Dislike button removed */} 
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onSubmit={handleCreatePost}
      />

      {selectedPostId && (
        <CommentsPopup
          postId={selectedPostId}
          onClose={handleCloseComments}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </div>
  );
};

export default ForYouCard;

