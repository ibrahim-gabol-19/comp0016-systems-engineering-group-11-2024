import React, { useState, useEffect, useCallback } from "react";
import { FaThumbsUp, FaComment, FaFilter } from "react-icons/fa";
import EventButton from "./EventButton";
import NewsButton from "./NewsButton";
import CreatePostModal from "./CreatePostModal";
import CommentsPopup from "./CommentsPopup";
import FilterForYouModal from "./FilterForYouModal";
import ExpandedPostModal from "./ExpandedPostModal";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Helper function to truncate text.
const truncateText = (text, limit) => {
  if (!text) return "";
  return text.length > limit ? text.slice(0, limit) + "..." : text;
};

// Helper function to format time as HH:MM
const formatTime = (timeString) => {
  if (!timeString) return "";
  return timeString.slice(0, 5);
};

// Transformation functions for each post type.
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
  tags: post.tags,
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
  tags: "News",
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
  tags: "Event",
  location: event.location,
  time: event.time,
});

// Helper function for likes.
const getLikeContentType = (type) => {
  if (type === "forum") return "forums.forumpost";
  if (type === "article") return "articles.article";
  if (type === "event") return "events.event";
  return "forums.forumpost";
};

const ForYouCard = () => {
  const [cards, setCards] = useState([]);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedPostType, setSelectedPostType] = useState(null);
  const [expandedPost, setExpandedPost] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Local filter state.
  const [filterOptions, setFilterOptions] = useState({
    forum: true,
    article: true,
    event: true,
    likedOnly: false,
  });
  const [sortOrder, setSortOrder] = useState("newest");

  const fetchAllPosts = useCallback(async (user) => {
    try {
      const token = localStorage.getItem("token");
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

      // Forums
      const forumRes = await axios.get(`${API_URL}forums/`, { headers: authHeader });
      const forumPostsRaw = forumRes.data;
      const forumPosts = await Promise.all(
        forumPostsRaw.map(async (post) => {
          try {
            const commentRes = await axios.get(`${API_URL}comments/`, {
              params: { content_type: "forums.forumpost", object_id: post.id },
              headers: authHeader,
            });
            return transformForumPost({
              ...post,
              commentCount: commentRes.data.length,
            });
          } catch {
            return transformForumPost({ ...post, commentCount: 0 });
          }
        })
      );

      // Articles
      const articlesRes = await axios.get(`${API_URL}articles/`, { headers: authHeader });
      const articlesRaw = articlesRes.data;
      const articles = await Promise.all(
        articlesRaw.map(async (article) => {
          try {
            const commentRes = await axios.get(`${API_URL}comments/`, {
              params: { content_type: "articles.article", object_id: article.id },
              headers: authHeader,
            });
            return {
              ...transformArticle(article),
              commentCount: commentRes.data.length,
            };
          } catch {
            return transformArticle(article);
          }
        })
      );

      // Events
      const eventsRes = await axios.get(`${API_URL}events/`, { headers: authHeader });
      const eventsRaw = eventsRes.data;
      const events = await Promise.all(
        eventsRaw.map(async (event) => {
          try {
            const commentRes = await axios.get(`${API_URL}comments/`, {
              params: { content_type: "events.event", object_id: event.id },
              headers: authHeader,
            });
            return {
              ...transformEvent(event),
              commentCount: commentRes.data.length,
            };
          } catch {
            return transformEvent(event);
          }
        })
      );

      // Combine
      let allPosts = [...forumPosts, ...articles, ...events].sort((a, b) => {
        if (!a.created_at) return 1;
        if (!b.created_at) return -1;
        return new Date(b.created_at) - new Date(a.created_at);
      });

      // Likes
      if (token && user?.id) {
        const updatedPosts = await Promise.all(
          allPosts.map(async (card) => {
            try {
              const likeRes = await axios.get(`${API_URL}likes/`, {
                params: {
                  content_type: getLikeContentType(card.type),
                  object_id: card.id,
                },
                headers: authHeader,
              });
              const likes = likeRes.data;
              return {
                ...card,
                likeCount: likes.length,
                liked: likes.some(
                  (like) => Number(like.user.id) === Number(user.id)
                ),
              };
            } catch (error) {
              console.error("Error fetching likes for", card.uniqueId, error);
              return { ...card, liked: false };
            }
          })
        );
        allPosts = updatedPosts;
      }

      setCards(allPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }, []);

  useEffect(() => {
    const fetchUserThenPosts = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get(`${API_URL}accounts/user/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = res.data;
        setCurrentUser(user);
        await fetchAllPosts(user);
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    };
    fetchUserThenPosts();
  }, [fetchAllPosts]);

  




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

      fetchAllPosts(currentUser);
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

  const handleOpenComments = (postId, postType, e) => {
    if (e) e.stopPropagation();
    setSelectedPostId(postId);
    setSelectedPostType(postType);
  };

  const handleCloseComments = () => {
    setSelectedPostId(null);
    setSelectedPostType(null);
  };

  const handleCommentAdded = () => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === selectedPostId
          ? { ...card, commentCount: (card.commentCount || 0) + 1 }
          : card
      )
    );
  };

  const handleCommentDeleted = () => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === selectedPostId
          ? { ...card, commentCount: Math.max((card.commentCount || 1) - 1, 0) }
          : card
      )
    );
  };
  

  const handleToggleLike = async (postId, postType, e) => {
    if (e) e.stopPropagation();
    const token = localStorage.getItem("token");
    const contentType = getLikeContentType(postType);
    const uniqueId = `${postType}-${postId}`;
    const card = cards.find((c) => c.uniqueId === uniqueId);
    if (!card) return;
  
    if (!card.liked) {
      // LIKE
      try {
        await axios.post(
          `${API_URL}likes/`,
          { content_type: contentType, object_id: postId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCards((prevCards) =>
          prevCards.map((c) =>
            c.uniqueId === uniqueId
              ? { ...c, liked: true, likeCount: (c.likeCount || 0) + 1 }
              : c
          )
        );
      } catch (error) {
        console.error("Error liking post:", error);
      }
    } else {
      // UNLIKE
      try {
        await axios.delete(`${API_URL}likes/unlike/`, {
          params: {
            content_type: contentType,
            object_id: postId,
          },
          headers: { Authorization: `Bearer ${token}` },
        });
        setCards((prevCards) =>
          prevCards.map((c) =>
            c.uniqueId === uniqueId
              ? { ...c, liked: false, likeCount: Math.max((c.likeCount || 1) - 1, 0) }
              : c
          )
        );
      } catch (error) {
        console.error("Error unliking post:", error);
      }
    }
  };
  

// Apply filtering and sorting.
const filteredCards = cards.filter((card) => {
  // Filter by post type (forum/article/event)
  if (!filterOptions[card.type]) return false;

  // Filter by liked posts only if enabled
  if (filterOptions.likedOnly && !card.liked) return false;

  return true;
});

const sortedCards = [...filteredCards].sort((a, b) => {
  if (sortOrder === "newest") {
    return new Date(b.created_at) - new Date(a.created_at);
  } else if (sortOrder === "oldest") {
    return new Date(a.created_at) - new Date(b.created_at);
  } else if (sortOrder === "most_liked") {
    return (b.likeCount || 0) - (a.likeCount || 0);
  } else if (sortOrder === "most_commented") {
    return (b.commentCount || 0) - (a.commentCount || 0);
  }
  return 0;
});


  return (
    <div className="p-6 font-sans">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">For You</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="bg-blue-500 text-white text-sm font-semibold py-2 px-4 rounded-full hover:bg-blue-600 transform transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            <FaFilter />
            Filter
          </button>
          <button
            onClick={() => setIsCreatePostModalOpen(true)}
            className="bg-blue-500 text-white text-sm font-semibold py-2 px-4 rounded-full hover:bg-blue-600 transform transition-all duration-300 hover:scale-105 flex items-center gap-1"
          >
            <span>+</span> Create Post
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCards.map((card) => {
          const displayContent = truncateText(card.content, 100);
          const isForum = card.type === "forum";
          return (
            <div
              key={card.uniqueId}
              onClick={() => setExpandedPost(card)}
              className="group bg-gray-100 shadow-lg rounded-lg overflow-hidden flex flex-col sm:flex-row transform transition-transform duration-300 hover:scale-105 cursor-pointer"
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
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold text-white mr-3">
                          {card.author[0]}
                        </div>
                        <p className="font-semibold text-lg text-gray-800">
                          {card.title}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="font-semibold text-lg text-gray-800">
                      {card.title}
                    </p>
                  )}
                  {card.tags === "News" ? (
                    <NewsButton />
                  ) : card.tags === "Event" ? (
                    <EventButton />
                  ) : null}
                </div>
                <p className="text-gray-700">{displayContent}</p>
                {isForum && (
                  <p className="text-gray-500 text-sm mt-1 italic">
                    Tags: {card.tags}
                  </p>
                )}
                <p className="text-gray-500 text-sm mt-2 italic">
                  {formatDate(card.created_at)}
                </p>
                {card.type === "event" && (
                  <div className="text-gray-500 text-xs mt-1">
                    {card.location && <p>Location: {card.location}</p>}
                    {card.time && <p>Time: {formatTime(card.time)}</p>}
                  </div>
                )}
                <div className="flex items-center justify-between mt-3">
                  <button
                    onClick={(e) =>
                      handleOpenComments(card.id, card.type, e)
                    }
                    className="text-gray-600 hover:text-gray-700 transform transition-all duration-300 hover:scale-110 p-1 rounded-full flex items-center gap-1"
                  >
                    <FaComment className="text-xl" />
                    <span className="text-sm">{card.commentCount || 0}</span>
                  </button>
                  <button
                    onClick={(e) =>
                      handleToggleLike(card.id, card.type, e)
                    }
                    className={`p-1 rounded-full flex items-center gap-1 transition-all duration-300 hover:scale-110 ${
                      card.liked
                        ? "text-blue-500"
                        : "text-gray-600 hover:text-gray-700"
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
          onCommentDeleted={handleCommentDeleted}
        />
      )}

      <FilterForYouModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={(newFilters, newSortOrder) => {
          setFilterOptions(newFilters);
          setSortOrder(newSortOrder);
        }}
        initialFilters={filterOptions}
        initialSortOrder={sortOrder}
      />

      {expandedPost && (
        <ExpandedPostModal
          post={expandedPost}
          onClose={() => setExpandedPost(null)}
          onOpenComments={handleOpenComments}
        />
      )}
    </div>
  );
};

export default ForYouCard;
