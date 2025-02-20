import React, { useEffect, useState } from "react";
import axios from "axios";
import MainImage from "./MainImage";
import MapComponent from "./MapComponent";

const API_URL = process.env.REACT_APP_API_URL;

const MiscellaneousSection = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [color, setColor] = useState('#000000'); // Default color (black)
  const [selectedTag, setSelectedTag] = useState("environmental"); // Default tag
  const [bounds, setBounds] = useState([]);


  const [swLat, setSwLat] = useState(49.5); // Southwest Latitude
  const [swLon, setSwLon] = useState(-8);   // Southwest Longitude
  const [neLat, setNeLat] = useState(60);   // Northeast Latitude
  const [neLon, setNeLon] = useState(2);    // Northeast Longitude

  // Update the bounds based on slider values
  const handleSwLatChange = (e) => setSwLat(parseFloat(e.target.value));
  const handleSwLonChange = (e) => setSwLon(parseFloat(e.target.value));
  const handleNeLatChange = (e) => setNeLat(parseFloat(e.target.value));
  const handleNeLonChange = (e) => setNeLon(parseFloat(e.target.value));

  const handleFilesUploaded = (acceptedFiles) => {
    if (acceptedFiles.length > 1) {
      alert("Only one image can be uploaded.");
      return;
    }
    setUploadedFiles([acceptedFiles[0]]);
  };

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

  const fetchCompanyInfo = async () => {

  }
  const handleSubmitNewDiscussionMessage = async () => {
    if (message.trim()) {
      try {
        const discussionMessage = {
          author: "Example Author",
          message: message,
          // report: selectedMarker.id,
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
          fetchCompanyInfo();
        }
      } catch (err) {
        console.log("Error creating discussion:", err.message);
        alert("Failed to submit your message. Please try again.");
      }
    } else {
      alert("Please enter a message!");
    }
  };
  return (
    <div className="h-full w-full  bg-green-100 px-5 py-5 ">
      <div className=" bg-white shadow-xl  rounded-xl">
        <p> Company Information</p>
        <div className="overflow-auto">
          <input
            type="text"
            id="name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Name"
            className="w-1/2  text-xl  border rounded-lg"
          />
        </div>
        <div>
          <MainImage onFilesUploaded={handleFilesUploaded} />
        </div>
        <div>
          <div>
            <label htmlFor="color" className="block text-xl">Choose a color</label>
            <input
              type="color"
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-1/2"
            />
          </div>
        </div>
        <div>
          <div>
            <p>Reports</p>
          </div>
          <div>
            <h3>Set Boundaries</h3>

            <div className="mb-4">
              <label className="block">Bottom Side</label>
              <input
                type="range"
                min="-90"
                max="90"
                step="0.1"
                value={swLat}
                onChange={handleSwLatChange}
                className="w-full"
              />
              <span>{swLat}°</span>
            </div>

            <div className="mb-4">
              <label className="block">Left Side</label>
              <input
                type="range"
                min="-180"
                max="180"
                step="0.1"
                value={swLon}
                onChange={handleSwLonChange}
                className="w-full"
              />
              <span>{swLon}°</span>
            </div>

            <div className="mb-4">
              <label className="block">Top Side</label>
              <input
                type="range"
                min="-90"
                max="90"
                step="0.1"
                value={neLat}
                onChange={handleNeLatChange}
                className="w-full"
              />
              <span>{neLat}°</span>
            </div>

            <div className="mb-4">
              <label className="block">Right Side</label>
              <input
                type="range"
                min="-180"
                max="180"
                step="0.1"
                value={neLon}
                onChange={handleNeLonChange}
                className="w-full"
              />
              <span>{neLon}°</span>
            </div>
          </div>
          <div className="h-96">
            <MapComponent bounds={[[swLat, swLon], [neLat, neLon]]} />
          </div>
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
      </div>
    </div>

  );
};
export default MiscellaneousSection;
