import React, { useEffect, useState } from "react";
import axios from "axios";
import MapComponent from "./MapComponent";

const API_URL = process.env.REACT_APP_API_URL;

const MiscellaneousSection = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [about, setAbout] = useState("");
  const [mainColor, setMainColor] = useState('#000000'); // Default color (black)

  const [font, setFont] = useState('Arial'); // State for selected font
  const [swLat, setSwLat] = useState(49.5); // Southwest Latitude
  const [swLon, setSwLon] = useState(-8);   // Southwest Longitude
  const [neLat, setNeLat] = useState(60);   // Northeast Latitude
  const [neLon, setNeLon] = useState(2);    // Northeast Longitude

  // Update the bounds based on slider values
  const handleSwLatChange = (e) => setSwLat(parseFloat(e.target.value));
  const handleSwLonChange = (e) => setSwLon(parseFloat(e.target.value));
  const handleNeLatChange = (e) => setNeLat(parseFloat(e.target.value));
  const handleNeLonChange = (e) => setNeLon(parseFloat(e.target.value));

  useEffect(() => {
    fetchCompanyInformation();
    // eslint-disable-next-line
  }, []);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));  // Set the image URL to the state
    }
  };
  const fetchCompanyInformation = async () => {
    try {
      const response = await axios.get(API_URL + "companyinformation/");
      const data = response.data[0]; // Assuming data is an array and you need the first item.

      console.log(data);
      // Set state variables based on the response data
      setName(data.name || ""); // Set Name, or default to an empty string if not available
      setImage(data.logo || null); // Set image, or default to null
      setAbout(data.about || ""); // Assuming 'about' is the description
      setMainColor(data.main_color || '#000000'); // Assuming 'color' is the color, or default to black

      setSwLat(data.sw_lat || 0);
      setSwLon(data.sw_lon || 0);
      setNeLat(data.ne_lat || 0);
      setNeLon(data.ne_lon || 0);

    } catch (err) {
      console.log(err.message);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(image);

    const companyInfo = {
      name,
      image,
      about,
      main_color: mainColor,
      font,
      sw_lat: swLat,
      sw_lon: swLon,
      ne_lat: neLat,
      ne_lon: neLon,
    };

    try {
      const response = await axios.put(API_URL + "companyinformation/1/", companyInfo);
      console.log("Company information saved:", response.data);
      // Handle success, show success message or navigate
    } catch (err) {
      console.error("Error saving company information:", err.message);
      // Handle error
    }
  };

  return (
    <div className="h-full w-full  bg-green-100 px-5 py-5 ">
      <div className="bg-white shadow-xl rounded-xl">
        <p>Company Information</p>
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="overflow-auto">
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-1/2 text-xl border rounded-lg"
            />
          </div>
          {/* Name */}
          <div className="overflow-auto">
            <input
              type="text"
              id="about"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="About"
              className="w-1/2 text-xl border rounded-lg"
            />
          </div>

          {/* Image Upload */}
          <div>
            {/* Show image if it exists */}
            {image ? (
              <div>
                <img src={image} alt="Uploaded" style={{ width: '200px', height: 'auto' }} />
              </div>
            ) : (
              <p>No image uploaded</p>
            )}

            {/* Image upload input */}
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          {/* Color Picker */}
          <div>
            <label htmlFor="color" className="block text-xl">Choose a color</label>
            <input
              type="color"
              id="color"
              value={mainColor}
              onChange={(e) => setMainColor(e.target.value)}
              className="w-1/2"
            />
          </div>
          <div>
            <label htmlFor="font" className="block text-xl">Choose a font</label>
            <select
              id="font"
              value={font}
              onChange={(e) => setFont(e.target.value)}
              className="w-1/2 text-xl border rounded-lg"
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
          {/* Boundaries */}
          <div>
            <h3>Set Boundaries</h3>

            {/* Bottom Side */}
            <div className="mb-4">
              <label className="block">Bottom Side</label>
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

            {/* Left Side */}
            <div className="mb-4">
              <label className="block">Left Side</label>
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

            {/* Top Side */}
            <div className="mb-4">
              <label className="block">Top Side</label>
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

            {/* Right Side */}
            <div className="mb-4">
              <label className="block">Right Side</label>
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

            {/* Map Component */}
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
        </form>
      </div >
    </div >

  );
};
export default MiscellaneousSection;
