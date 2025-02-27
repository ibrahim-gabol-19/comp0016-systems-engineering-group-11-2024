import React, { useState, useEffect } from "react";
import { FaThumbsUp } from "react-icons/fa";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const CommentsPopup = ({ postId, onClose }) => {
  const [comments, setComments] = useState([]); // State to store comments
  const [newComment, setNewComment] = useState(""); // State for new comment input
  const [replyTo, setReplyTo] = useState(null); // State to track which comment is being replied to

  // Fetch comments for the selected post
  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}comments/`, {
        params: { post_id: postId }, // Pass the post ID as a query parameter
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setComments(response.data); // Update the state with fetched comments
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Fetch comments when the component mounts
  useEffect(() => {
    fetchComments();
  }, [postId]);

  // Handle submitting a new comment
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // Log the payload before sending the request
      const payload = {
        content: newComment,
        post_id: postId, // Include the post ID in the payload
        reply_to: replyTo, // Include the reply_to field if it exists
      };
      console.log("Payload being sent:", payload);

      const response = await axios.post(
        `${API_URL}comments/`,
        payload, // Send the payload
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response from backend:", response.data);

      setNewComment(""); // Clear the input field
      setReplyTo(null); // Reset replyTo
      fetchComments(); // Refresh the comments list
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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchComments(); // Refresh the comments list
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Comments</h2>
        <div className="max-h-96 overflow-y-auto mb-4">
          {comments.map((comment, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold text-white mr-3">
                  {comment.author[0]} {/* Display the first letter of the author's username */}
                </div>
                <p className="font-semibold text-gray-800">{comment.author}</p>
              </div>
              <p className="text-gray-700 mt-1">{comment.content}</p>
              <p className="text-gray-500 text-sm mt-1">
                {new Date(comment.created_at).toLocaleDateString()}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => handleLikeComment(comment.id)}
                  className="text-gray-600 hover:text-gray-700 transform transition-all duration-300 hover:scale-110 p-1 rounded-full"
                >
                  <FaThumbsUp className="text-xl" />
                </button>
                <button
                  onClick={() => setReplyTo(comment.id)}
                  className="text-gray-600 hover:text-gray-700 transform transition-all duration-300 hover:scale-110 p-1 rounded-full"
                >
                  Reply
                </button>
              </div>
            </div>
          ))}
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
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Post
          </button>
        </form>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CommentsPopup;
