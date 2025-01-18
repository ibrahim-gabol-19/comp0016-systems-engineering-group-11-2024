import React, { useEffect, useState } from "react";

const SidebarReport = ({ selectedMarker }) => {
  const [viewingDiscussion, setViewingDiscussion] = useState(false);



  if (selectedMarker == "new") {
    return (
      <div className="w-full h-full flex flex-col">
        new newn ew
      </div>
    )
  }
  else if (selectedMarker) {
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
              <p class="">{selectedMarker.status} ● {selectedMarker.tags}</p>
            </div>
          </div>
          <div className="w-full bg-green-500 h-4/6 overflow-auto">
            {selectedMarker.discussion.map((discussion, index) => (
              <div
                key={index}
                className={`p-4 text-center font-bold cursor-pointer`}
              >
                {discussion}
              </div>
            ))}
          </div>
          {/*Upvote + View discussion*/}
          <div className="w-full bg-red-100 h-1/6">
            <button
              className="flex flex-row justify-center w-full py-3 bg-white font-bold text-green-500 rounded-lg active:bg-green-100 hover:bg-gray-100 transition duration-500 active:duration-100 mb-2"
              onClick={() => setViewingDiscussion(false)}            >
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
            <p class="">0 Upvotes</p>



          </div>
        </div>
      )
    }
    else {
      return (
        <div className="w-full h-full flex flex-col">
          <div className="w-full bg-green-500 h-1/6">
            {/*Title*/}
            <div className="w-full h-3/4 bg-green-200 ml-4">
              <p class="font-bold text-4xl">{selectedMarker.name}</p>
            </div>
            {/*Status + Tags*/}
            <div className="w-full h-1/4 bg-green-100 ml-4">
              <p class="">{selectedMarker.status} ● {selectedMarker.tags}</p>
            </div>
          </div>
          {/*Image*/}
          <div className="w-full bg-blue-500 h-2/6">
            <img
              src="https://picsum.photos/150"
              alt=""
              className=" "
            />
          </div>
          {/*Description*/} {/*Include the poster and date at the bottom */}
          <div className="w-full bg-blue-100 h-2/6">
            <p class="">{selectedMarker.description}</p>
            <p class="">{selectedMarker.poster} ● {selectedMarker.date}</p>

          </div>
          {/*Upvote + View discussion*/}
          <div className="w-full bg-red-100 h-1/6">
            <button
              className="flex flex-row justify-center w-full py-3 bg-white font-bold text-green-500 rounded-lg active:bg-green-100 hover:bg-gray-100 transition duration-500 active:duration-100 mb-2"
              onClick={() => setViewingDiscussion(true)}            >
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
            <p class="">0 Upvotes</p>



          </div>
        </div>
      )
    };
  } else {
    return <div></div>;
  }
};

export default SidebarReport;
