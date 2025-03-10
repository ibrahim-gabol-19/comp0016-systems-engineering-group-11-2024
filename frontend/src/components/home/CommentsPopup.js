import React, { useState, useEffect } from "react";
import { FaThumbsUp } from "react-icons/fa";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const CommentsPopup = ({ postId, contentType, onClose, onCommentAdded }) => {
  const [comments, setComments] = useState([]); // All comments for this post
  const [newComment, setNewComment] = useState(""); // New comment text
  const [replyTo, setReplyTo] = useState(null); // Which comment is being replied to
  const [visibleReplies, setVisibleReplies] = useState({}); // Tracks which main comment's replies are visible
  const [editingCommentId, setEditingCommentId] = useState(null); // ID of comment being edited
  const [editingCommentContent, setEditingCommentContent] = useState(""); // Edited text
  const [currentUser, setCurrentUser] = useState(""); // Current user's username

  // Fetch current user details from the accounts endpoint
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${API_URL}accounts/user/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setCurrentUser(res.data.username))
        .catch((err) => console.error("Error fetching current user:", err));
    }
  }, []);

  // Format date as dd/mm/yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Fetch comments using the passed contentType prop
  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}comments/`, {
        params: {
          content_type: contentType,
          object_id: postId,
        },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setComments(response.data); // API returns nested replies in each comment's "replies" field
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId, contentType]);

  // Handle submitting a new comment or reply
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const payload = {
        content: newComment,
        content_type: contentType, // Use the passed contentType prop
        object_id: postId,         // The post ID
        reply_to: replyTo,         // Parent comment ID (if replying)
      };
      await axios.post(`${API_URL}comments/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewComment(""); // Clear input
      setReplyTo(null);  // Reset reply target
      fetchComments();   // Refresh comments
      if (onCommentAdded) onCommentAdded();
    } catch (error) {
      console.error("Error submitting comment:", error);
      if (error.response) {
        console.error("Backend response data:", error.response.data);
        console.error("Backend response status:", error.response.status);
      }
    }
  };

  // Handle liking a comment
  const handleLikeComment = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}comments/${commentId}/like/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComments(); // Refresh after like
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  // Handle deleting a comment (or reply)
  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}comments/${commentId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComments();
      if (onCommentAdded) onCommentAdded();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // Handle saving an edited comment
  const handleSaveEdit = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_URL}comments/${commentId}/`,
        { content: editingCommentContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingCommentId(null);
      setEditingCommentContent("");
      fetchComments();
      if (onCommentAdded) onCommentAdded();
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentContent("");
  };

  // Toggle the visibility of replies for a given main comment
  const toggleReplies = (commentId) => {
    setVisibleReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  // Flatten nested replies into a single array
  const flattenReplies = (replies) => {
    let result = [];
    replies.forEach((reply) => {
      result.push(reply);
      if (reply.replies && reply.replies.length > 0) {
        result = result.concat(flattenReplies(reply.replies));
      }
    });
    return result;
  };

  // Render a single comment (or reply) with edit and delete options if applicable
  const renderCommentComponent = (comment, indentClass = "") => {
    return (
      <div className={`${indentClass} mb-2`} key={comment.id}>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold text-white mr-3">
            {comment.author[0]}
          </div>
          <p className="font-semibold text-gray-800">{comment.author}</p>
        </div>
        {editingCommentId === comment.id ? (
          <div className="mt-1">
            <input
              type="text"
              value={editingCommentContent}
              onChange={(e) => setEditingCommentContent(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <div className="mt-1 flex gap-2">
              <button
                onClick={() => handleSaveEdit(comment.id)}
                className="px-2 py-1 bg-green-500 text-white rounded text-sm"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-2 py-1 bg-gray-300 text-black rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 mt-1">{comment.content}</p>
        )}
        <p className="text-gray-500 text-sm mt-1">{formatDate(comment.created_at)}</p>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => {
              setReplyTo(comment.id);
              setNewComment(`@${comment.author} `);
            }}
            className="text-gray-600 hover:text-gray-700 transform transition-all duration-300 hover:scale-110 p-1 rounded-full"
          >
            Reply
          </button>
          <button
            onClick={() => handleLikeComment(comment.id)}
            className="text-gray-600 hover:text-gray-700 transform transition-all duration-300 hover:scale-110 p-1 rounded-full"
          >
            <FaThumbsUp className="text-xl" />
          </button>
          {comment.author === currentUser && (
            <>
              <button
                onClick={() => {
                  setEditingCommentId(comment.id);
                  setEditingCommentContent(comment.content);
                }}
                className="text-blue-500 hover:text-blue-600 transform transition-all duration-300 p-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="text-red-500 hover:text-red-600 transform transition-all duration-300 p-1 rounded"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  // Render a top-level comment along with a toggle to show/hide its replies.
  // Replies are flattened and rendered at a fixed indent level (depth = 1).
  const renderTopLevelComment = (comment) => {
    const replies = comment.replies ? flattenReplies(comment.replies) : [];
    return (
      <div key={comment.id} className="mb-4">
        {renderCommentComponent(comment)}
        {replies.length > 0 && (
          <div className="mt-2">
            {visibleReplies[comment.id] ? (
              <>
                {replies.map((reply) => (
                  <div key={reply.id} className="ml-8 border-l pl-4 mb-2">
                    {renderCommentComponent(reply)}
                  </div>
                ))}
                <button onClick={() => toggleReplies(comment.id)} className="text-blue-500 text-sm">
                  Hide Replies
                </button>
              </>
            ) : (
              <button onClick={() => toggleReplies(comment.id)} className="text-blue-500 text-sm">
                View Replies ({replies.length})
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Comments</h2>
        <div className="max-h-96 overflow-y-auto mb-4">
          {comments
            .filter((comment) => comment.parent_comment === null)
            .map((comment) => renderTopLevelComment(comment))}
        </div>
        <form onSubmit={handleSubmitComment} className="flex items-center">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={replyTo ? "Reply to comment..." : "Add a comment..."}
            className="w-full p-2 border rounded"
            required
          />
          <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Post
          </button>
        </form>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          Close
        </button>
      </div>
    </div>
  );
};

export default CommentsPopup;
