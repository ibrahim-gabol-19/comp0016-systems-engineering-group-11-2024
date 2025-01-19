import React, { useEffect, useState } from "react";

const SidebarReport = ({ selectedMarker }) => {
  const [viewingDiscussion, setViewingDiscussion] = useState(false);
  const [message, setMessage] = useState(null);

  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');


  // Prevent form submission when pressing Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();  // Prevent form submission on Enter
    }
  };

  const handleSubmitNewDiscussionMessage = () => {
    if (message.trim()) {
      console.log("Message Submitted:", message);
      setMessage("");
    } else {
      alert("Please enter a message!");
    }
  };


    // Submit handler
    const handleSubmitNewForm = (e) => {
      e.preventDefault();
  
      // Log the form data
      console.log("Title:", title);
      console.log("Image URL:", image);
      console.log("Description:", description);
  
      // You can send this data to a backend or perform any other logic here.
  
      // Clear the form after submission
      setTitle('');
      setImage('');
      setDescription('');
    };



  if (selectedMarker == "new") {
    return <div className="w-full h-full flex flex-col">
      
      
    <h2>Submit Your Report</h2>
      <form onSubmit={handleSubmitNewForm} className="space-y-4" onKeyDown={handleKeyDown}>
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block font-medium">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Image Input */}
        <div>
          <label htmlFor="image" className="block font-medium">Image URL</label>
          <input
            type="text"
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Enter image URL"
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Description Input */}
        <div>
          <label htmlFor="description" className="block font-medium">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            className="w-full p-2 border rounded-lg h-24"
          />
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
      
      
      </div>;
  } else if (selectedMarker) {
    if (viewingDiscussion) {
      return (
        <div className="w-full h-full flex flex-col">
          <div className="w-full bg-green-500 h-1/6">
            {/*Title*/}
            <div className="w-full h-3/4 bg-green-200 ml-4">
              <p class="font-bold text-4xl">{selectedMarker.name}</p>
            </div>
            {/*Status + Tags*/}
            <div className="w-full h-1/4 bg-green-100 ml-4">
              <p class="">
                {selectedMarker.status} ● {selectedMarker.tags}
              </p>
            </div>
          </div>
          <div className="w-full bg-green-500 h-3/6 overflow-auto">
            {selectedMarker.discussion.map((discussion, index) => (
              <div
                key={index}
                className={`p-4 text-center font-bold cursor-pointer`}
              >
                {discussion}
              </div>
            ))}
          </div>
          {/*New Discussion Message */}
          <div className="w-full bg-yellow-500 h-1/6">
            {/* Text Input Form */}
            <textarea
              className="w-full h-24 p-2 border rounded-lg"
              placeholder="Type your discussion message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)} // Use state to manage input
            ></textarea>
            <button
              className="w-full py-2 mt-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300"
              onClick={handleSubmitNewDiscussionMessage} // Submit handler
            >
              Submit Message
            </button>
          </div>
          {/*Upvote + View discussion*/}
          <div className="w-full bg-red-100 h-1/6">
            <button
              className="flex flex-row justify-center w-full py-3 bg-white font-bold text-green-500 rounded-lg active:bg-green-100 hover:bg-gray-100 transition duration-500 active:duration-100 mb-2"
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
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
              View Overview
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-full h-full flex flex-col">
          <div className="w-full bg-green-500 h-1/6">
            {/*Title*/}
            <div className="w-full h-3/4 bg-green-200 ml-4">
              <p class="font-bold text-4xl">{selectedMarker.name}</p>
            </div>
            {/*Status + Tags*/}
            <div className="w-full h-1/4 bg-green-100 ml-4">
              <p class="">
                {selectedMarker.status} ● {selectedMarker.tags}
              </p>
            </div>
          </div>
          {/*Image*/}
          <div className="w-full bg-blue-500 h-2/6">
            <img src="https://picsum.photos/150" alt="" className=" " />
          </div>
          {/*Description*/} {/*Include the poster and date at the bottom */}
          <div className="w-full bg-blue-100 h-2/6">
            <p class="">{selectedMarker.description}</p>
            <p class="">
              {selectedMarker.poster} ● {selectedMarker.date}
            </p>
            <p class="">0 Upvotes</p>
          </div>
          {/*Upvote + View discussion*/}
          <div className="w-full bg-red-100 h-1/6">
            <button
              className="flex flex-row justify-center w-full py-3 bg-white font-bold text-green-500 rounded-lg active:bg-green-100 hover:bg-gray-100 transition duration-500 active:duration-100 mb-2"
              onClick={() => setViewingDiscussion(true)}
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
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
              View Discussion
            </button>
          </div>
        </div>
      );
    }
  } else {
    return <div></div>;
  }
};

export default SidebarReport;
