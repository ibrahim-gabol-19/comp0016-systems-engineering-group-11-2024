import React, { useEffect, useState, useRef } from "react";

import MapComponent from "./MapComponent";
import SidebarReport from "./SidebarReport";
import axios from "axios";
import { useLocation} from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

const ReportsSection = ({userQuery}) => {
  const location = useLocation();
  const [selectedMarker, setSelectedMarker] = useState(location.state?.selectedIssue || null);
  const [newMarker, setNewMarker] = useState(null);
  const [reports, setReports] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarRef = useRef(null);
  const mapRef = useRef(null);

  const [filterToggles, setFilterToggles] = useState({
    open: true,
    resolved: false,
    closed: false,
  });

  const handleMarkerSelected = (item) => {
    setSelectedMarker(item);
    setNewMarker(null);
    setIsSidebarOpen(true);
  };

  const fetchReports = async () => {
    try {
      const response = await axios.get( API_URL + "reports/");
      const newReports = response.data;
      setReports(newReports);

      if (selectedMarker) {
        // Directly find the updated marker in the new reports
        const updatedMarker = newReports.find(
          (report) => report.id === selectedMarker.id
        );
        setSelectedMarker(updatedMarker || null); // Set to null if not found
      }
      if (newMarker) {
        setNewMarker(null);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line
  }, []);

  
  const handleOutsideClick = (event) => {
    if (selectedMarker || newMarker) {
      if (sidebarRef.current && sidebarRef.current.contains(event.target)) {
        return; // Click inside sidebar
      }
      if (mapRef.current && mapRef.current.getContainer().contains(event.target)) { // Access the DOM container
        return; // Click inside map
      }
      setSelectedMarker(null);
      setNewMarker(null);
      setIsSidebarOpen(false);
    }
  };

  const handleSidebarClose = () => {
    setSelectedMarker(null);
    setNewMarker(null);
    setIsSidebarOpen(false); // Close sidebar when X button is clicked
  };

  const handleToggleChange = (filterName) => {
    setFilterToggles((prevToggles) => ({
      ...prevToggles,
      [filterName]: !prevToggles[filterName],
    }));
  };

  const getActiveFilters = () => {
    return Object.keys(filterToggles).filter((key) => filterToggles[key]);
  };

  return (
    <div className="h-screen flex flex-col" onClick={handleOutsideClick}>
      <div className="h-full flex">
          {isSidebarOpen && (
          <div className={`bg-[#f9f9f9] shadow-2xl py-5 rounded-xl h-full ${isSidebarOpen ? "w-full" : "w-2/6"} relative sm:w-2/6`} ref={sidebarRef}>
            <button
              className="absolute top-4 right-5 text-3xl scale-150"
              onClick={handleSidebarClose}
            >
              &times;
            </button>
            <SidebarReport
              selectedMarker={selectedMarker}
              fetchReports={fetchReports}
            ></SidebarReport>
          </div>
          )}

          <div className={`h-full flex flex-col ${selectedMarker || newMarker ? 'w-4/6 hidden sm:flex' : 'flex-grow min-w-0'} relative`}>
            <MapComponent
              onMarkerSelected={handleMarkerSelected}
              reports={reports}
              activeFilters={getActiveFilters()}
              selectedMarker={selectedMarker}
              mapRef={mapRef}
              userQuery={userQuery}
            ></MapComponent>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-40 lg:mb-40 mb-60 ">
              <button
                className={`px-4 py-2 rounded-lg border-2 border-gray-400 ${filterToggles.open ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-200'}`}
                onClick={() => handleToggleChange('open')}
              >
                Unresolved
              </button>
              <button
                className={`px-4 py-2 rounded-lg border-2 border-gray-400 ${filterToggles.resolved ? 'bg-green-500 text-white border-green-500' : 'bg-gray-200'}`}
                onClick={() => handleToggleChange('resolved')}
              >
                Resolved
              </button>
              <button
                className={`px-4 py-2 rounded-lg border-2 border-gray-400 ${filterToggles.closed ? 'bg-red-500 text-white border-red-500' : 'bg-gray-200'}`}
                onClick={() => handleToggleChange('closed')}
              >
                Closed
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReportsSection;
