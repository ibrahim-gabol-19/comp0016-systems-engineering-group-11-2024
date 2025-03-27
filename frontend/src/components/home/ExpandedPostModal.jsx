import React from "react";
import { FaTimes, FaComment } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ExpandedPostModal = ({ post, onClose, onOpenComments }) => {
  const navigate = useNavigate();
  if (!post) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString.slice(0, 5);
  };

  const handleRedirect = (item) => {
    if (item.type === "report") {
      navigate("/reporting", { state: { selectedIssue: item } });
    } else if (item.type === "event") {
      navigate(`/events/${item.id}`);
    } else {
      navigate(`/articles/${item.id}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full relative overflow-y-auto max-h-screen">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          <FaTimes size={24} />
        </button>
        {post.image && (
          <img
            src={post.image}
            alt="Media content"
            className="w-full h-64 object-cover rounded-t-lg"
          />
        )}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
          <p className="text-gray-500 text-sm mb-4">{formatDate(post.created_at)}</p>
          {post.author && (
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold text-white mr-3">
                {post.author[0]}
              </div>
              <p className="font-semibold text-lg text-gray-800">{post.author}</p>
            </div>
          )}
          <p className="text-gray-700 mb-4">{post.content}</p>
          {post.type === "event" ? (
            <>
              <div className="mb-4">
                {post.location && (
                  <p className="text-gray-700 mb-2">
                    <span className="font-bold">Location:</span> {post.location}
                  </p>
                )}
                {post.time && (
                  <p className="text-gray-700">
                    <span className="font-bold">Time:</span> {formatTime(post.time)}
                  </p>
                )}
              </div>
              {post.tags && (
                <p className="text-gray-500 italic mb-4">Tags: {post.tags}</p>
              )}
            </>
          ) : (
            post.tags && (
              <p className="text-gray-500 italic mb-4">Tags: {post.tags}</p>
            )
          )}

          {/* Footer buttons - align right */}
          <div className="flex justify-end items-center gap-4 mt-6">
            {/* Hide View Details for forum posts */}
            {post.type !== "forum" && (
              <button
                onClick={() => {
                  handleRedirect(post);
                  console.log("Source id is", post.id);
                  console.log("Source is", post.type);
                }}
                className="text-blue-500 hover:text-blue-600"
              >
                View details
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenComments(post.id, post.type, e);
              }}
              className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
            >
              <FaComment className="text-xl" />
              <span>Comments ({post.commentCount || 0})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandedPostModal;

