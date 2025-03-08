import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MapComponent from "../../components/settings/MapComponent";
import MainImage from "../../components/settings/MainImage";
const API_URL = process.env.REACT_APP_API_URL;

const MiscellaneousSection = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [about, setAbout] = useState("");
  const [mainColor, setMainColor] = useState("#000000");
  const [font, setFont] = useState("Arial");

  const [feedback, setFeedback] = useState({ message: "", color: "" });
  const navigate = useNavigate();
  const [radius, setRadius] = useState(0);
  const [bounds, setBounds] = useState([
    [51.341875, -0.29222], // Initial SW lat, lon
    [51.651675, 0.01758], // Initial NE lat, lon
  ]);

  const handleRadiusChange = (event) => {
    const newRadius = parseFloat(event.target.value);
    setRadius(newRadius);
    const centerLat = (bounds[0][0] + bounds[1][0]) / 2;
    const centerLon = (bounds[0][1] + bounds[1][1]) / 2;
    setBounds([
      [centerLat - newRadius, centerLon - newRadius], // SW corner
      [centerLat + newRadius, centerLon + newRadius], // NE corner
    ]);
  };

  useEffect(() => {
    fetchCompanyInformation();
  }, []);

  const handleImageUpload = (uploadedFiles) => {
    const file = uploadedFiles[0]; // Since we are only allowing 1 file to be uploaded
    if (file) {
      setImage(file); // Store the File object in state
    }
  };

  const fetchCompanyInformation = async () => {
    try {
      const response = await axios.get(API_URL + "companyinformation/");
      const data = response.data[0];

      const fetchedSwLat = data.sw_lat || 51.341875;
      const fetchedSwLon = data.sw_lon || -0.29222;
      const fetchedNeLat = data.ne_lat || 51.651675;
      const fetchedNeLon = data.ne_lon || 0.01758;

      // Directly set bounds based on fetched data
      const newBounds = [
        [parseFloat(fetchedSwLat), parseFloat(fetchedSwLon)],
        [parseFloat(fetchedNeLat), parseFloat(fetchedNeLon)],
      ];

      // Set state with fetched data
      setName(data.name || "");
      setAbout(data.about || "");
      setMainColor(data.main_color || "#000000");
      setCompanyLogo(data.logo);
      setFont(data.font || "Arial");
      setBounds(newBounds);  // Update bounds here
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
    formData.append("sw_lat", parseFloat(bounds[0][0].toFixed(6)));
    formData.append("sw_lon", parseFloat(bounds[0][1].toFixed(6)));
    formData.append("ne_lat", parseFloat(bounds[1][0].toFixed(6)));
    formData.append("ne_lon", parseFloat(bounds[1][1].toFixed(6)));

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
    window.location.reload();
  };
  return (
    <div className="w-screen h-full flex justify-center items-start overflow-auto p-6 bg-gray-100 rounded-lg">

      <div className="w-5/6 bg-white p-6 rounded-md shadow-md">
        {/* Feedback Message */}
        {feedback.message && (
          <div className={`py-2 w-full bg-green-100 text-center text-xl  text-${feedback.color}-600`}>
            {feedback.message}
          </div>
        )}

<div className="flex flex-wrap justify-between items-center w-full h-full p-4">

  {/* Back Button */}
  <button
    onClick={handleBack}
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 sm:mb-0"
  >
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

  {/* Heading */}
  <h2 className="py-2 font-bold text-3xl sm:text-4xl md:text-5xl flex items-center justify-center flex-grow text-center mx-2">
    Company Information
  </h2>

  {/* Save Button */}
  <button
    type="submit"
    onClick={handleSubmit}
    className="bg-green-500 hover:bg-green-300 text-white font-bold py-2 px-4 rounded mb-4 sm:mb-0"
  >
    Save
  </button>
</div>

<div>
  <form onSubmit={handleSubmit}>
    <div className="py-6"></div>

    {/* Name Input */}
    <div className="overflow-auto flex justify-center text-center items-center px-2 py-2 w-full">
      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="w-full md:w-3/4 text-center text-2xl md:text-4xl font-semibold border rounded-lg p-2"
      />
    </div>
    {/* <div className="grid grid-flow-col grid-rows-2 h-[25rem] px-4 justify-items-center items-center"> */}

    {/* Grid Section */}
    <div className="grid lg:grid-flow-col md:grid-cols-2 lg:grid-rows-2 gap-4 px-4 py-4">
      {/* About Company */}
      <div className="overflow-auto px-2 py-2 w-full">
        <h3 className="text-xl text-center text-gray-600 mb-2">About</h3>
        <textarea
          id="about"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder="About"
          className="w-full h-32 text-lg border rounded-lg p-2 resize-none"
        />
      </div>

      {/* Font Selector */}
      <div className="px-2 py-2 w-full">
        <h3 className="text-xl text-center text-gray-600">Font</h3>
        <select
          id="font"
          value={font}
          onChange={(e) => setFont(e.target.value)}
          className="w-full text-center text-xl border rounded-lg p-2"
          style={{ fontFamily: font }}
        >
          <option value="Arial" style={{ fontFamily: "Arial" }}>Arial</option>
          <option value="Helvetica" style={{ fontFamily: "Helvetica" }}>Helvetica</option>
          <option value="Times New Roman" style={{ fontFamily: "Times New Roman" }}>Times New Roman</option>
          <option value="Courier New" style={{ fontFamily: "Courier New" }}>Courier New</option>
          <option value="Verdana" style={{ fontFamily: "Verdana" }}>Verdana</option>
          <option value="Georgia" style={{ fontFamily: "Georgia" }}>Georgia</option>
          <option value="Tahoma" style={{ fontFamily: "Tahoma" }}>Tahoma</option>
        </select>
      </div>

      {/* Logo Upload */}
      <div className="flex flex-col justify-center items-center w-full">
        <h3 className="text-xl text-center text-gray-600">Logo</h3>
        <MainImage onFilesUploaded={handleImageUpload} defaultLogo={companyLogo} />
      </div>

      {/* Color Picker */}
      <div className="flex flex-col items-center justify-center px-2 py-2 w-full">
        <h3 className="text-xl text-center text-gray-600">Colour</h3>
        <input
          type="color"
          id="color"
          value={mainColor}
          onChange={(e) => setMainColor(e.target.value)}
          className="w-1/2 md:w-1/3 rounded-full"
        />
      </div>
    </div>

    {/* Divider */}
    <hr className="my-6 border-t border-gray-300" />

    {/* Boundaries Section */}
    <div className="py-5">
      <h2 className="py-2 font-bold text-3xl md:text-4xl text-center">Map Boundaries</h2>
      <div className="flex flex-col md:flex-row px-4 py-4 gap-4">
        {/* Radius Section */}
        <div className="w-full md:w-1/6 flex justify-center items-center">
          <div className="text-center">
            <input
              type="range"
              min="0"
              max="2"
              orient="vertical"
              step="0.0001"
              value={radius}
              onChange={handleRadiusChange}
              className="w-full h-32 md:h-full bg-gray-300 rounded-lg"
            />
            <div className="mt-2 text-lg">
              {((radius / 2) * 100).toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="w-full md:w-5/6">
          <div className="w-full h-64 md:h-96 border-2 border-gray-300 rounded-lg shadow-lg">
            <MapComponent bounds={bounds} setExternalBounds={setBounds} />
          </div>
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