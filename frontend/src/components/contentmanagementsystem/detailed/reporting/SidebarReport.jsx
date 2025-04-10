import React, { useState, useContext } from "react";
import axios from "axios";
import { CompanyContext } from "../../../../context/CompanyContext";
import { useAuth } from "../../../../context/AuthContext";
const API_URL = import.meta.env.VITE_API_URL;

const SidebarReport = ({ selectedMarker, fetchReports }) => {
  const [viewingDiscussion, setViewingDiscussion] = useState(false);
  const [message, setMessage] = useState(null);
  const [isDiscussionEmpty, setIsDiscussionEmpty] = useState(false);

  const { auth } = useAuth();

  const { main_color } = useContext(CompanyContext);
  const author = auth.user.username;

  const lightenColor = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;

    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  };

  const handleStatusChange = async (status) => {
    try {
      const response = await axios.patch(
        `${API_URL}/reports/${selectedMarker.id}/`,
        { status: status.target.value }
      );

      if (response.status === 200) {
        fetchReports();
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleTagsChange = async (tags) => {
    try {
      const response = await axios.patch(
        `${API_URL}/reports/${selectedMarker.id}/`,
        { tags: tags.target.value }
      );

      if (response.status === 200) {
        fetchReports();
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleDeleteReport = async () => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete report?`
    );
    if (isConfirmed) {
      try {
        const response = await axios.delete(
          `${API_URL}/reports/${selectedMarker.id}/`
        );

        if (response.status === 204) {
          fetchReports();
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  const handleDeleteDiscussion = async (id) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete discussion?`
    );
    if (isConfirmed) {
      try {
        const response = await axios.delete(
          `${API_URL}/reportdiscussion/${id}/`
        );

        if (response.status === 204) {
          fetchReports();
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  const handleSubmitNewDiscussionMessage = async () => {
    try {

      if (message.trim()) {
        try {
          const discussionMessage = {
            author: author,
            message: message,
            report: selectedMarker.id,
          };
          const token = localStorage.getItem("token");

          if (!token) {
            alert("Authentication required. Please log in.");
            return;
          }

          const response = await axios.post(
            API_URL + "reportdiscussion/",
            discussionMessage,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 201) {
            setMessage("");
            fetchReports();
            setIsDiscussionEmpty(false);

          }
        } catch (err) {
          console.log("Error creating discussion:", err.message);
          setIsDiscussionEmpty(true);
        }
      } else {
        setIsDiscussionEmpty(true);
      }
    }
    catch {
      setIsDiscussionEmpty(true);
    }
  };

  if (selectedMarker) {
    /*Existing Report Discussion*/
    if (viewingDiscussion) {
      return (
        <div className="w-full h-full flex flex-col">
          <div className="w-full h-1/6 px-3 ">
            {/*Title*/}
            <div className="w-full h-3/4 ">
              <div className="w-full h-3/4 text-center justify-center">
                <p class="font-semibold text-4xl mb-4 mr-8 line-clamp-2">{selectedMarker.title}</p>
              </div>
              <div className="w-full h-1/4 flex flex-col text-center justify-center">
                <p className="text-gray-500 text-m mb-4">
                  Date Reported: {new Date(
                    selectedMarker.published_date
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
            {/* Status + Tags */}
            <div className="w-full flex justify-center items-center">
              <select
                value={selectedMarker.status}
                onChange={handleStatusChange}
                className="px-1 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-m font-semibold text-center text-purple-600 mb-4"
              >
                <option value="open">Open</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <p className="text-center font-bold mx-4 text-gray-300 mb-4">|</p>
              <select
                value={selectedMarker.tags}
                onChange={handleTagsChange}
                className="px-1 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-m font-semibold text-center text-sky-400 mb-4 "
              >
                <option value="road">Road</option>
                <option value="environmental">Environmental</option>
                <option value="pollution">Pollution</option>
                <option value="wildlife_conservation">
                  Wildlife Conservation
                </option>
                <option value="climate_change">Climate Change</option>
                <option value="waste_management">Waste Management</option>
                <option value="health_safety">Health & Safety</option>
                <option value="urban_development">Urban Development</option>
              </select>
              <p className="text-center font-bold mx-4 text-gray-300 mb-4">|</p>

              <div className=" h-1/2 mb-4">
                <button
                  className="px-1 py-1 border rounded-lg focus:outline-none bg-red-500 font-bold text-white hover:bg-red-400 active:bg-red-300 transition active:duration-100 duration-500"
                  onClick={handleDeleteReport}
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
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {/**Discussion */}
          <div className="w-full max-h-[450px] overflow-y-auto border border-gray-300 ">
            {selectedMarker.discussions.map((discussion, index) => (
              <div
                key={index}
                className={`flex px-4 h-auto w-full min-h-16 border border-gray-200 ${discussion.author === "Business" ? "bg-yellow-200" : ""
                  }`}
              >
                {/* Profile Picture (SVG Icon) */}
                <div className="w-1/6 flex justify-center items-center">
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
                <div className="w-5/6 break-words py-3">
                  <p className="font-semibold">{discussion.author}</p>
                  <p className="">{discussion.message}</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(discussion.created_at).toLocaleString(undefined, {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true,
                    })}
                  </p>
                </div>

                <div className="w-1/6">
                  <button
                    className="justify-center items-center w-8 h-8 flex flex-row py-3 bg-red-500 font-bold text-white rounded-lg hover:bg-red-400 active:bg-red-300 transition active:duration-100 duration-500 mt-4 ml-2"
                    onClick={() => handleDeleteDiscussion(discussion.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/*New Discussion Message */}
          <div className="w-full flex flex-col items-center justify-center h-2/6 px-3 py-3 pb-6 ">
            <div className="w-full h-2/4 py-2 ">
              {/* Text Input Form */}
              <textarea
                className={`w-full p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 ${isDiscussionEmpty ? 'border-red-500' : 'border-gray-300'
                  }`} placeholder="Type your anouncement message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>
            <div className="w-full h-1/4">
              <button
                className="w-full h-2/3 py-2 mt-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300"
                onClick={handleSubmitNewDiscussionMessage}
              >
                Submit Anouncement
              </button>
            </div>
            {/*View Overview*/}
            <div className="w-full shadow-md h-1/4">
              <button
                className="flex flex-row justify-center w-full h-full bg-white font-bold rounded-lg transition duration-500 active:duration-100 mb-2 items-center justify-center"
                style={{
                  color: main_color, // Dynamic text color
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = lightenColor(
                    main_color,
                    40
                  ); // Lighter background on hover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white"; // Reset background on mouse leave
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.backgroundColor = lightenColor(
                    main_color,
                    60
                  ); // Even lighter background on active
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.backgroundColor = lightenColor(
                    main_color,
                    40
                  ); // Reset to hover state on mouse up
                }}
                onClick={() => setViewingDiscussion(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
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
          <div className="w-full h-1/6 px-3">
            {/*Title*/}
            <div className="w-full h-3/4 ">
              <div className="w-full h-3/4 text-center justify-center">
                <p class="font-semibold text-4xl mb-4 mr-8 line-clamp-2">{selectedMarker.title}</p>
              </div>
              <div className="w-full h-1/4 flex flex-col text-center justify-center">
                <p className="text-gray-500 text-m mb-4">
                  Date Reported: {new Date(
                    selectedMarker.published_date
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
            {/* Status + Tags */}
            <div className="w-full flex justify-center items-center">
              <select
                value={selectedMarker.status}
                onChange={handleStatusChange}
                className="px-1 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-m font-semibold text-center text-purple-600 mb-4"
              >
                <option value="open">Open</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <p className="text-center font-bold mx-4 text-gray-300 mb-4">|</p>
              <select
                value={selectedMarker.tags}
                onChange={handleTagsChange}
                className="px-1 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-m font-semibold text-center text-sky-400 mb-4 "
              >
                <option value="road">Road</option>
                <option value="environmental">Environmental</option>
                <option value="pollution">Pollution</option>
                <option value="wildlife_conservation">
                  Wildlife Conservation
                </option>
                <option value="climate_change">Climate Change</option>
                <option value="waste_management">Waste Management</option>
                <option value="health_safety">Health & Safety</option>
                <option value="urban_development">Urban Development</option>
              </select>
              <p className="text-center font-bold mx-4 text-gray-300 mb-4">|</p>

              <div className="h-1/2 mb-4">
                <button
                  className="px-1 py-1 border rounded-lg focus:outline-none bg-red-500 font-bold text-white hover:bg-red-400 active:bg-red-300 transition active:duration-100 duration-500"
                  onClick={handleDeleteReport}
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
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {/*Image*/}
          <div className="w-full h-[200px] flex justify-center items-center border border-gray-300">
            {selectedMarker.main_image ? (
              <img
                src={selectedMarker.main_image}
                alt=""
                className="h-full w-full object-contain p-6"
              />
            ) : (
              <img
                src="https://img.freepik.com/free-vector/illustration-notepad_53876-18174.jpg?ga=GA1.1.1375142660.1737879724&semt=ais_hybrid"
                alt=""
                className="h-full w-full object-contain"
              />
            )}
          </div>

          {/* Description with Poster and Date */}
          <div className="w-full  px-3 py-3 pb-6 h-3/6 flex flex-col">
            {/* Poster and Date Section */}

            {/* Description Text */}
            <div className="w-full h-[300px] mb-3 overflow-auto">
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
              <div className="w-1/2 justify-center"></div>
            </div>
            {/*View discussion*/}
            <div className="w-full h-1/5 shadow-md">
              <button
                className="flex flex-row justify-center w-full h-full bg-white font-bold rounded-lg transition duration-500 active:duration-100 mb-2 items-center justify-center"
                style={{
                  color: main_color, // Dynamic text color
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = lightenColor(
                    main_color,
                    40
                  ); // Lighter background on hover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white"; // Reset background on mouse leave
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.backgroundColor = lightenColor(
                    main_color,
                    60
                  ); // Even lighter background on active
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.backgroundColor = lightenColor(
                    main_color,
                    40
                  ); // Reset to hover state on mouse up
                }}
                onClick={() => setViewingDiscussion(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
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
