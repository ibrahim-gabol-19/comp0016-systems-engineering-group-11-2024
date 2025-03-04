import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import MapComponent from "../../components/settings/MapComponent";

const API_URL = process.env.REACT_APP_API_URL;

const MiscellaneousSection = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [about, setAbout] = useState("");
  const [mainColor, setMainColor] = useState("#000000");
  const [font, setFont] = useState("Arial");
  const [swLat, setSwLat] = useState(49.5);
  const [swLon, setSwLon] = useState(-8);
  const [neLat, setNeLat] = useState(60);
  const [neLon, setNeLon] = useState(2);
  const [feedback, setFeedback] = useState({ message: "", color: "" });
  const navigate = useNavigate();

  const handleSwLatChange = (e) => setSwLat(parseFloat(e.target.value));
  const handleSwLonChange = (e) => setSwLon(parseFloat(e.target.value));
  const handleNeLatChange = (e) => setNeLat(parseFloat(e.target.value));
  const handleNeLonChange = (e) => setNeLon(parseFloat(e.target.value));

  useEffect(() => {
    fetchCompanyInformation();
    // navigate(-1);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Store the File object in state
    }
  };

  const fetchCompanyInformation = async () => {
    try {
      const response = await axios.get(API_URL + "companyinformation/");
      const data = response.data[0];

      setName(data.name || "");
      setAbout(data.about || "");
      setMainColor(data.main_color || "#000000");
      setFont(data.font || "Arial");
      setSwLat(data.sw_lat || 49.5);
      setSwLon(data.sw_lon || -8);
      setNeLat(data.ne_lat || 60);
      setNeLon(data.ne_lon || 2);
    } catch (err) {
      setFeedback({ message: "Failed to fetch company information.", color: "red" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    if (image) {
      formData.append("logo", image); // Append the File object directly
    }
    formData.append("about", about);
    formData.append("main_color", mainColor);
    formData.append("font", font);
    formData.append("sw_lat", swLat);
    formData.append("sw_lon", swLon);
    formData.append("ne_lat", neLat);
    formData.append("ne_lon", neLon);

    try {
      await axios.put(API_URL + "companyinformation/1/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFeedback({ message: "Company information saved successfully!", color: "green" });
    } catch (err) {
      setFeedback({ message: "Error saving company information.", color: "red" });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className="w-screen h-full flex justify-center items-start overflow-auto p-6 bg-gray-100 rounded-lg">

      <div className="w-3xl w-full bg-white p-6 rounded-md shadow-md">
      {/* Feedback Message */}
      {feedback.message && (
        <div className={`py-2 w-full bg-green-100 text-center text-xl  text-${feedback.color}-600`}>
          {feedback.message}
        </div>
      )}

        <div className="flex justify-between h-full">

          {/* Back Button */}
          <button
            onClick={handleBack}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          {/* Save Button (Anchored to Top Right) */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-300 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Save
          </button>
        </div>
        <h2 className="py-2 font-bold text-4xl">Company Information</h2>
        <div>
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="overflow-auto px-2 py-2">
              <h3 className="text-xl text-gray-600 mb-2">Title</h3>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full text-3xl border rounded-lg p-2"
              />
            </div>

            {/* About */}
            <div className="overflow-auto px-2 py-2">
              <h3 className="text-xl text-gray-600 mb-2">About</h3>
              <textarea
                id="about"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="About"
                className="w-full h-32 text-lg border rounded-lg p-2 resize-none"
              />
            </div>

            {/* Image Upload */}
            <div className="px-2 py-2">
              <h3 className="text-xl text-gray-600 mb-2">Logo</h3>
              {image ? (
                <div>
                  <img
                    src={URL.createObjectURL(image)} // Use URL.createObjectURL for preview
                    alt="Uploaded"
                    className="w-48 h-48 object-cover rounded-lg border"
                  />
                </div>
              ) : (
                <p className="text-gray-500">No image uploaded</p>
              )}
              <input
                type="file"
                className="mt-2"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            {/* Color Picker */}
            <div className="px-2 py-2">
              <h3 className="text-xl text-gray-600 mb-2">Main Color</h3>
              <input
                type="color"
                id="color"
                value={mainColor}
                onChange={(e) => setMainColor(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Font Selector */}
            <div className="px-2 py-2">
              <h3 className="text-xl text-gray-600 mb-2">Font</h3>
              <select
                id="font"
                value={font}
                onChange={(e) => setFont(e.target.value)}
                className="w-full text-xl border rounded-lg p-2"
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Verdana">Verdana</option>
                <option value="Georgia">Georgia</option>
                <option value="Tahoma">Tahoma</option>
              </select>
            </div>

            {/* Divider */}
            <hr className="my-6 border-t border-gray-300" />

            {/* Boundaries Section */}
            <div className="py-5">
              <h2 className="py-2 font-bold text-4xl">Reporting</h2>
              <div className="flex">
                <div className="w-1/2 pr-4">
                  <div className="mb-4">
                    <h3 className="text-xl text-gray-600 mb-2">Top Side</h3>
                    <input
                      type="range"
                      min="-90"
                      max="90"
                      step="0.05"
                      value={neLat}
                      onChange={handleNeLatChange}
                      className="w-full"
                    />
                    <span>{neLat}°</span>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-xl text-gray-600 mb-2">Bottom Side</h3>
                    <input
                      type="range"
                      min="-90"
                      max="90"
                      step="0.05"
                      value={swLat}
                      onChange={handleSwLatChange}
                      className="w-full"
                    />
                    <span>{swLat}°</span>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-xl text-gray-600 mb-2">Left Side</h3>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      step="0.05"
                      value={swLon}
                      onChange={handleSwLonChange}
                      className="w-full"
                    />
                    <span>{swLon}°</span>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-xl text-gray-600 mb-2">Right Side</h3>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      step="0.05"
                      value={neLon}
                      onChange={handleNeLonChange}
                      className="w-full"
                    />
                    <span>{neLon}°</span>
                  </div>
                </div>

                {/* Map Component */}
                <div className="w-1/2 h-96">
                  <MapComponent
                    bounds={[
                      [swLat, swLon],
                      [neLat, neLon],
                    ]}
                  />
                </div>
              </div>
            </div>


          </form>
        </div>
      </div>
    </div>
  );
};

export default MiscellaneousSection;