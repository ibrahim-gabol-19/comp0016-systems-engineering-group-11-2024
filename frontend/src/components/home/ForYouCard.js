import React, { useState, useEffect } from "react";
import EventButton from "./EventButton";
import NewsButton from "./NewsButton";
import { FaThumbsUp, FaComment } from "react-icons/fa";
import CreatePostModal from "./CreatePostModal";
import CommentsPopup from "./CommentsPopup";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Helper function to truncate text to a specified limit.
const truncateText = (text, limit) => {
  if (!text) return "";
  return text.length > limit ? text.slice(0, limit) + "..." : text;
};

// Transformation functions for each type of post.
// Each transformation adds a uniqueId property.
const transformForumPost = (post) => ({
  id: post.id,
  uniqueId: `forum-${post.id}`,
  type: "forum",
  title: post.title || post.name,
  content: post.content,
  image: post.media,
  author: post.author,
  created_at: post.created_at,
  commentCount: post.commentCount || 0,
  likeCount: post.likeCount !== undefined ? post.likeCount : 0,
  liked: post.liked !== undefined ? post.liked : false,
  tags: post.tags
});

const transformArticle = (article) => ({
  id: article.id,
  uniqueId: `article-${article.id}`,
  type: "article",
  title: article.title,
  content: article.description,
  image: article.main_image,
  author: article.author,
  created_at: article.published_date,
  commentCount: 0,
  likeCount: 0,
  liked: false,
  tags: "News"
});

const transformEvent = (event) => ({
  id: event.id,
  uniqueId: `event-${event.id}`,
  type: "event",
  title: event.title,
  content: event.description,
  image: event.main_image,
  author: "",
  created_at: event.date,
  commentCount: 0,
  likeCount: 0,
  liked: false,
  tags: "Event"
});

// Helper function to determine the content type string for likes.
const getLikeContentType = (type) => {
  if (type === "forum") return "forums.forumpost";
  if (type === "article") return "articles.article";
  if (type === "event") return "events.event";
  return "forums.forumpost";
};

const ForYouCard = () => {
  const [cards, setCards] = useState([]);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedPostType, setSelectedPostType] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch current user details from the accounts endpoint.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${API_URL}accounts/user/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setCurrentUser(res.data))
        .catch((err) =>
          console.error("Error fetching current user (ensure the URL is correct):", err)
        );
    }
  }, []);

  // Unified fetch function: fetch forums, articles, events and merge them.
  const fetchAllPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
      
      // Fetch forum posts.
      const forumRes = await axios.get(`${API_URL}forums/`, { headers: authHeader });
      const forumPostsRaw = forumRes.data;
      const forumPosts = await Promise.all(
        forumPostsRaw.map(async (post) => {
          try {
            const commentRes = await axios.get(`${API_URL}comments/`, {
              params: { content_type: "forums.forumpost", object_id: post.id },
              headers: authHeader,
            });
            return transformForumPost({ ...post, commentCount: commentRes.data.length });
          } catch (error) {
            console.error("Error fetching extra info for forum post", post.id, error);
            return transformForumPost({ ...post, commentCount: 0 });
          }
        })
      );

      // Fetch articles.
      const articlesRes = await axios.get(`${API_URL}articles/`, { headers: authHeader });
      const articles = articlesRes.data.map((article) => transformArticle(article));

      // Fetch events.
      const eventsRes = await axios.get(`${API_URL}events/`, { headers: authHeader });
      const events = eventsRes.data.map((event) => transformEvent(event));

      // Merge all posts.
      let allPosts = [...forumPosts, ...articles, ...events];
      // Sort by created_at descending.
      allPosts.sort((a, b) => {
        if (!a.created_at) return 1;
        if (!b.created_at) return -1;
        return new Date(b.created_at) - new Date(a.created_at);
      });

      // If token and currentUser exist, update each card's like status.
      if (token && currentUser && currentUser.id) {
        const updatedPosts = await Promise.all(
          allPosts.map(async (card) => {
            try {
              const res = await axios.get(`${API_URL}likes/`, {
                params: {
                  content_type: getLikeContentType(card.type),
                  object_id: card.id,
                },
                headers: { Authorization: `Bearer ${token}` },
              });
              const likes = res.data;
              return {
                ...card,
                likeCount: likes.length,
                liked: likes.some((like) => Number(like.user.id) === Number(currentUser.id)),
              };
            } catch (err) {
              console.error("Error fetching likes for card", card.id, err);
              return card;
            }
          })
        );
        allPosts = updatedPosts;
      }
      setCards(allPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, [currentUser]);

  // Handle post creation (only applies to forum posts for now).
  const handleCreatePost = async (postData) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", postData.title);
      formData.append("content", postData.content);
      formData.append("tags", postData.tags);
      if (postData.media) formData.append("media", postData.media);

      await axios.post(`${API_URL}forums/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      fetchAllPosts();
    } catch (error) {
      console.error("Error creating forum post:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Open comments modal with the specified post ID and type.
  const handleOpenComments = (postId, postType) => {
    setSelectedPostId(postId);
    setSelectedPostType(postType);
  };

  const handleCloseComments = () => {
    setSelectedPostId(null);
    setSelectedPostType(null);
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

  // Toggle like status for a post by integrating the likes backend.
  const handleToggleLike = async (postId, postType) => {
    const token = localStorage.getItem("token");
    const contentType = getLikeContentType(postType);
    const uniqueId = `${postType}-${postId}`;
    const card = cards.find((c) => c.uniqueId === uniqueId);
    if (!card) return;
    if (!card.liked) {
      // Like the post.
      try {
        await axios.post(
          `${API_URL}likes/`,
          { content_type: contentType, object_id: postId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCards((prevCards) =>
          prevCards.map((c) =>
            c.uniqueId === uniqueId ? { ...c, liked: true, likeCount: (c.likeCount || 0) + 1 } : c
          )
        );
      } catch (error) {
        console.error("Error liking post:", error);
      }
    } else {
      // Unlike the post.
      try {
        const res = await axios.get(`${API_URL}likes/`, {
          params: { content_type: contentType, object_id: postId },
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.length > 0) {
          const likeInstance = res.data.find(
            (like) => Number(like.user.id) === Number(currentUser.id)
          );
          if (likeInstance) {
            await axios.delete(`${API_URL}likes/${likeInstance.id}/`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setCards((prevCards) =>
              prevCards.map((c) =>
                c.uniqueId === uniqueId
                  ? { ...c, liked: false, likeCount: (c.likeCount || 0) - 1 }
                  : c
              )
            );
          }
        }
      } catch (error) {
        console.error("Error unliking post:", error);
      }
    }
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
        {cards.map((card) => {
          const displayContent = truncateText(card.content, 100);
          const isForum = card.type === "forum";
          return (
            <div
              key={card.uniqueId}
              className="group bg-gray-100 shadow-lg rounded-lg overflow-hidden flex flex-col sm:flex-row transform transition-transform duration-300 hover:scale-105"
            >
              {card.image && (
                <img
                  src={card.image}
                  alt="Media content"
                  className="sm:w-1/3 w-full h-48 sm:h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              <div className="p-4 flex-1">
                <div className="flex justify-between items-center mb-2">
                  {isForum ? (
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold text-white mr-3">
                        {card.author[0]}
                      </div>
                      <p className="font-semibold text-lg text-gray-800">{card.author}</p>
                    </div>
                  ) : (
                    <p className="font-semibold text-lg text-gray-800">{card.title}</p>
                  )}
                  {card.tags === "News" ? (
                    <NewsButton />
                  ) : card.tags === "Event" ? (
                    <EventButton />
                  ) : null}
                </div>
                <p className="text-gray-700">{displayContent}</p>
                {isForum && (
                  <p className="text-gray-500 text-sm mt-1 italic">Tags: {card.tags}</p>
                )}
                <p className="text-gray-500 text-sm mt-2 italic">{formatDate(card.created_at)}</p>
                <div className="flex items-center justify-between mt-3">
                  <button
                    onClick={() => handleOpenComments(card.id, card.type)}
                    className="text-gray-600 hover:text-gray-700 transform transition-all duration-300 hover:scale-110 p-1 rounded-full flex items-center gap-1"
                  >
                    <FaComment className="text-xl" />
                    <span className="text-sm">{card.commentCount || 0}</span>
                  </button>
                  <button
                    onClick={() => handleToggleLike(card.id, card.type)}
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
          );
        })}

        {/* Dummy posts for testing */}
        {[
          {
            id: 997,
            name: "Jane Doe",
            tags: "News",
            title: "Prototype Launch",
            content: "Green Inc are proud to launch their first prototype! 😁",
            comment: "Awesome news!",
            image: "https://via.placeholder.com/300x200",
          },
          {
            id: 998,
            name: "John Doe",
            tags: "Event",
            title: "Annual Conference",
            content: "Green Inc are hosting their annual conference at the Excel Centre in London!",
            comment: "Sounds interesting!",
            image: "https://via.placeholder.com/300x200",
          },
          {
            id: 999,
            name: "Emily Smith",
            tags: "Volunteering",
            content: "Join us in making a difference in the community! 🌍",
            comment: "It's a rewarding experience!",
            image: "https://via.placeholder.com/300x200",
          },
        ].map((card, index) => {
          const isForum = !card.tags || (card.tags !== "News" && card.tags !== "Event" && card.tags !== "Article");
          const displayContent = truncateText(card.content, 100);
          const dummyType = card.tags === "News" ? "article" : card.tags === "Event" ? "event" : "forum";
          return (
            <div
              key={`existing-${index}`}
              className="group bg-gray-100 shadow-lg rounded-lg overflow-hidden flex flex-col sm:flex-row transform transition-transform duration-300 hover:scale-105"
            >
              {card.image && (
                <img
                  src={card.image}
                  alt="Media content"
                  className="sm:w-1/3 w-full h-48 sm:h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              <div className="p-4 flex-1">
                <div className="flex justify-between items-center mb-2">
                  {card.tags === "News" || card.tags === "Event" ? (
                    <p className="font-semibold text-lg text-gray-800">{card.title || card.name}</p>
                  ) : (
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold text-white mr-3">
                        {card.name[0]}
                      </div>
                      <p className="font-semibold text-lg text-gray-800">{card.name}</p>
                    </div>
                  )}
                  {card.tags === "News" ? (
                    <NewsButton />
                  ) : card.tags === "Event" ? (
                    <EventButton />
                  ) : null}
                </div>
                <p className="text-gray-700">{displayContent}</p>
                {isForum && (
                  <p className="text-gray-500 text-sm mt-2 italic">{card.comment}</p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <button
                    onClick={() => handleOpenComments(card.id, dummyType)}
                    className="text-gray-600 hover:text-gray-700 transform transition-all duration-300 hover:scale-110 p-1 rounded-full flex items-center gap-1"
                  >
                    <FaComment className="text-xl" />
                    <span className="text-sm">{card.comments?.length || 0}</span>
                  </button>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleToggleLike(card.id, dummyType)}
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
            </div>
          );
        })}
      </div>

      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onSubmit={handleCreatePost}
      />

      {selectedPostId && (
        <CommentsPopup
          postId={selectedPostId}
          contentType={
            selectedPostType === "forum"
              ? "forums.forumpost"
              : selectedPostType === "article"
              ? "articles.article"
              : selectedPostType === "event"
              ? "events.event"
              : "forums.forumpost"
          }
          onClose={handleCloseComments}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </div>
  );
};

export default ForYouCard;
