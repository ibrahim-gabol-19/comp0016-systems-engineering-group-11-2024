import React, { useState } from "react";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

const SidebarReport = ({ selectedMarker, newMarker, fetchReports }) => {
  const [viewingDiscussion, setViewingDiscussion] = useState(false);
  const [message, setMessage] = useState(null);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [selectedTag, setSelectedTag] = useState("environmental"); // Default tag

  const tags = [
    "environmental",
    "road",
    "pollution",
    "wildlife_conservation",
    "climate_change",
    "waste_management",
    "health_safety",
    "urban_development",
  ];
  const handleUpvote = async () => {
    try {
      const response = await axios.post(
        API_URL + "reports/" + selectedMarker.id + "/upvote/"
      );
      if (response.status === 200) {
        fetchReports();
      }
    } catch (err) {
      console.log(err.message);
    } finally {
    }
  };

  const handleStatusChange = async (status) => {
    try {
      const response = await axios.patch(
        `${API_URL}/reports/${selectedMarker.id}/`,
        { status: status.target.value }
      );

      if (response.status === 200) {
        console.log("Status updated successfully");
        fetchReports();
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  const handleTagsChange = async (tags) => {
    try {
      const response = await axios.patch(
        `${API_URL}/reports/${selectedMarker.id}/`,
        { tags: tags.target.value }
      );

      if (response.status === 200) {
        console.log("Tags updated successfully");
        fetchReports();
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  const handleDeleteReport = async () => {
    const isConfirmed = window.confirm(`Are you sure you want to delete report?`);
    if (isConfirmed) {
      try {
        const response = await axios.delete(
          `${API_URL}/reports/${selectedMarker.id}/`,
        );

        if (response.status === 204) {
          console.log("Report deleted successfully");
          fetchReports();
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  }


  const handleDeleteDiscussion = async (id) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete discussion?`);
    if (isConfirmed) {

      try {
        const response = await axios.delete(
          `${API_URL}/reportdiscussion/${id}/`,
        );

        if (response.status === 204) {
          console.log("Discussion deleted successfully");
          fetchReports();
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  }


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(file); // Store image URL in state
      };
      reader.readAsDataURL(file); // Convert file to base64
    }
  };

  const handleSubmitNewDiscussionMessage = async () => {
    if (message.trim()) {
      try {
        const discussionMessage = {
          author: "Example Author",
          message: message,
          report: selectedMarker.id,
        };

        const response = await axios.post(
          API_URL + "reportdiscussion/",
          discussionMessage,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 201) {
          setMessage("");
          fetchReports();
        }
      } catch (err) {
        console.log("Error creating discussion:", err.message);
        alert("Failed to submit your message. Please try again.");
      }
    } else {
      alert("Please enter a message!");
    }
  };

  const handleSubmitNewForm = async (e) => {
    e.preventDefault();

    // Create the data object to send
    const formData = new FormData();
    formData.append("title", title);
    if (image) {
      formData.append("main_image", image);
    }
    formData.append("description", description);
    formData.append("author", "exampleauthor");
    formData.append("longitude", newMarker.latlng.lng.toFixed(5));
    formData.append("latitude", newMarker.latlng.lat.toFixed(5));
    formData.append("tags", selectedTag); // Include the selected tag

    try {
      const response = await axios.post(
        API_URL + "reports/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // To send files and form data
          },
        }
      );
      if (response.status === 201) {
        fetchReports();
      }

      // Clear the form after submission
      setTitle("");
      setImage(null);
      setDescription("");
      setSelectedTag("environmental"); // Reset the tag after submission
    } catch (err) {
      console.log("Error creating report:", err.message);
    }
  };

  if (newMarker) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center px-3 py-3">
        <div className="mb-6 ">
          <p className="text-3xl font-bold">New report</p>
        </div>
        <div className="h-5/6 w-full">
          <form onSubmit={handleSubmitNewForm} className="space-y-4">
            {/* Title Input */}
            <div>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full py-12 text-3xl px-3 border rounded-lg"
              />
            </div>

            {/* Image Input */}
            <div>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => handleImageUpload(e)}
                className="w-full py-6 px-3 border rounded-lg"
              />
            </div>

            {/* Description Input */}
            <div>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                className="w-full px-3 border rounded-lg h-48 resize-none"
              />
            </div>

            {/* Tags Select */}
            <div>
              <label htmlFor="tags" className="block font-medium mb-2">
                Select Tag
              </label>
              <select
                id="tags"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full py-3 px-3 border rounded-lg"
              >
                {tags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag.charAt(0).toUpperCase() +
                      tag.slice(1).replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full py-2 mt-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  } else if (selectedMarker) {
    /*Existing Report Discussion*/
    if (viewingDiscussion) {
      return (
        <div className="w-full h-full flex flex-col">
          <div className="w-full h-1/6 px-3 ">
            {/*Title*/}
            <div className="w-full h-3/4 flex justify-center items-center ">
              <div className="w-3/4">
                <div className="w-full h-3/4 text-center justify-center">
                  <p class="font-semibold text-4xl">{selectedMarker.title}</p>
                </div>
                <div className="w-full h-1/4 text-center justify-center">
                  <p className="text-gray-500 text-m">
                    {new Date(selectedMarker.published_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="w-1/4">
                <button
                  className="justify-center  flex flex-row py-3 max-w-80 bg-red-500 font-bold text-white rounded-lg hover:bg-red-400 active:bg-red-300 transition active:duration-100 duration-500"
                  onClick={handleDeleteReport}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.7"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
            {/* Status + Tags */}
            <div className="w-full h-1/4 flex justify-center items-center">

              <select
                value={selectedMarker.status}
                onChange={handleStatusChange}
                className="px-1 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="open">Open</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <p className="text-center font-bold mx-4">●</p>

              <select
                value={selectedMarker.tags}
                onChange={handleTagsChange}
                className="px-1 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="road">Road</option>
                <option value="environmental">Environmental</option>
                <option value="pollution">Pollution</option>
                <option value="wildlife_conservation">Wildlife Conservation</option>
                <option value="climate_change">Climate Change</option>
                <option value="waste_management">Waste Management</option>
                <option value="health_safety">Health & Safety</option>
                <option value="urban_development">Urban Development</option>
              </select>
            </div>
          </div>
          {/**Discussion */}
          <div className="w-full h-3/6 overflow-auto border border-gray-300 ">
            {selectedMarker.discussions.map((discussion, index) => (
              <div
                key={index}
                className={`flex px-4 h-32 w-full min-h-16 border border-gray-200 overflow-auto ${discussion.author === "Business" ? "bg-yellow-200" : ""
                  }`}              >
                {/* Profile Picture (SVG Icon) */}
                <div className="w-1/6 h-full flex justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-10 h-10 text-gray-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                </div>
                <div className="w-4/6 overflow-y-auto break-words py-3">
                  <p className="font-semibold">{discussion.author}</p>
                  <p className="">{discussion.message}</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(discussion.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="w-1/6 overflow-auto">
                  <button
                    className="justify-center w-full flex flex-row py-3 max-w-80 bg-red-500 font-bold text-white rounded-lg hover:bg-red-400 active:bg-red-300 transition active:duration-100 duration-500"
                    onClick={() => handleDeleteDiscussion(discussion.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.7"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/*New Discussion Message */}
          <div className="w-full  flex flex-col items-center justify-center h-2/6 px-3 py-3 pb-6 ">
            <div className="w-full h-2/4 py-2 ">
              {/* Text Input Form */}
              <textarea
                className="w-full h-full p-2 border rounded-lg resize-none"
                placeholder="Type your anouncement message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)} // Use state to manage input
              ></textarea>
            </div>
            <div className="w-full h-1/4">
              <button
                className="w-full  py-2 mt-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300"
                onClick={handleSubmitNewDiscussionMessage} // Submit handler
              >
                Submit Anouncement
              </button>
            </div>
            {/*View Overview*/}
            <div className="w-full shadow-md h-1/4">
              <button
                className="flex flex-row justify-center w-full h-full  bg-white font-bold text-green-500 rounded-lg active:bg-green-200 hover:bg-green-100 transition duration-500 active:duration-100 mb-2 items-center justify-center"
                onClick={() => setViewingDiscussion(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                  />
                </svg>
                Back
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      /*Existing Report Overview*/
      return (
        <div className="w-full h-full flex flex-col">
          <div className="w-full h-1/6 px-3 ">
            {/*Title*/}
            <div className="w-full h-3/4 flex justify-center items-center ">
              <div className="w-3/4">
                <div className="w-full h-3/4 text-center justify-center overflow-auto">
                  <p class="font-semibold text-3xl">{selectedMarker.title}</p>
                </div>
                <div className="w-full h-1/4 text-center justify-center">
                  <p className="text-gray-500 text-m">
                    {new Date(selectedMarker.published_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="w-1/4">
                <button
                  className="justify-center  flex flex-row py-3 max-w-80 bg-red-500 font-bold text-white rounded-lg hover:bg-red-400 active:bg-red-300 transition active:duration-100 duration-500"
                  onClick={handleDeleteReport}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.7"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
            {/* Status + Tags */}
            <div className="w-full h-1/4 flex justify-center items-center">

              <select
                value={selectedMarker.status}
                onChange={handleStatusChange}
                className="px-1 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="open">Open</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <p className="text-center font-bold mx-4">●</p>

              <select
                value={selectedMarker.tags}
                onChange={handleTagsChange}
                className="px-1 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="road">Road</option>
                <option value="environmental">Environmental</option>
                <option value="pollution">Pollution</option>
                <option value="wildlife_conservation">Wildlife Conservation</option>
                <option value="climate_change">Climate Change</option>
                <option value="waste_management">Waste Management</option>
                <option value="health_safety">Health & Safety</option>
                <option value="urban_development">Urban Development</option>
              </select>
            </div>
          </div>
          {/*Image*/}
          <div className="w-full h-2/6 flex  justify-center items-center border border-gray-300">
            {selectedMarker.main_image ? (
              <img
                src={selectedMarker.main_image}
                alt=""
                className="h-64 w-64 object-contain"
              />
            ) : (
              <img
                src="https://img.freepik.com/free-vector/illustration-notepad_53876-18174.jpg?ga=GA1.1.1375142660.1737879724&semt=ais_hybrid"
                alt=""
                className="h-64 w-64 object-contain"
              />
            )}
          </div>


          {/* Description with Poster and Date */}
          <div className="w-full  px-3 py-3 pb-6 h-3/6 flex flex-col">
            {/* Poster and Date Section */}

            {/* Description Text */}
            <div className="w-full h-3/6 mb-3 overflow-auto">
              <p class="text-lg">{selectedMarker.description}</p>
            </div>
            {/*Poster*/}
            <div className="h-1/6 flex items-center bg-white border border-gray-100 space-x-4">
              {/* Profile Picture (SVG Icon) */}
              <div className="w-1/6 h-full flex justify-center items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-10 h-10 text-gray-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </div>

              {/* Poster Name and Date */}
              <div className="w-5/6 flex flex-col justify-center">
                {/* Poster Name */}
                <p className="font-bold text-l">{selectedMarker.author}</p>

                {/* Date in Italics */}
                <p className="text-sm italic text-gray-500">
                  {selectedMarker.date}
                </p>
              </div>
            </div>
            <div className="h-1/6 flex items-center bg-white border border-gray-100 mb-3 justify-center ">
              <div className="w-1/2">
                {/* Current Upvotes */}
                <p className="italic text-center">
                  {selectedMarker.upvotes} Upvotes
                </p>
              </div>
              {/* Upvote Button with Icon */}
              <div className="w-1/2 justify-center">

              </div>
            </div>
            {/*View discussion*/}
            <div className="w-full h-1/6 shadow-md ">
              <button
                className="flex flex-row justify-center w-full h-full bg-white font-bold text-green-500 rounded-lg active:bg-green-200 hover:bg-green-100 transition duration-500 active:duration-100 mb-2 items-center justify-center"
                onClick={() => setViewingDiscussion(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-7 "
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                  />
                </svg>
                Discussion
              </button>
            </div>
          </div>
        </div>
      );
    }
  } else {
    return <div></div>;
  }
};

export default SidebarReport;
