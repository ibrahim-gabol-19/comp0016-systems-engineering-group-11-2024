import React, { useEffect, useState, useRef } from "react";

import MapComponent from "../../components/reporting/MapComponent";
import SidebarReport from "../../components/reporting/SidebarReport";
import axios from "axios";
import Header from "../../components/Header";
import { useLocation} from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL;


const ReportsPage = () => {
  const location = useLocation();
  const [selectedMarker, setSelectedMarker] = useState(location.state?.selectedIssue || null);
  const [newMarker, setNewMarker] = useState(null);
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("open");

  const sidebarRef = useRef(null);
  const mapRef = useRef(null);

  const handleMarkerSelected = (item) => {
    setSelectedMarker(item);
    setNewMarker(null);
  };

  const handleNewMarkerSelected = (item) => {
    setNewMarker(item);
    setSelectedMarker(null);
  };

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {}; 

      const response = await axios.get( API_URL + "reports/", {
        headers, 
    });
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

  const filterChange = (event) => {
    setFilter(event.target.value);
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
    }
  };

  return (
    <div className="h-screen flex flex-col" onClick={handleOutsideClick}>
      <Header/>
      <div className="pt-20"></div>
      <div className="h-full flex">
          {(selectedMarker || newMarker) && (
          <div className="bg-[#f9f9f9]  shadow-2xl py-5 rounded-xl h-full w-2/6" ref={sidebarRef}>
            <SidebarReport
              selectedMarker={selectedMarker}
              newMarker={newMarker}
              fetchReports={fetchReports}
            ></SidebarReport>
          </div>
          )}
          <div className={`h-full flex flex-col ${selectedMarker || newMarker ? 'w-4/6' : 'flex-grow min-w-0'} pb-9`}>
            <div className="text-sm justify-center text-center font-bold pb-2">
              <select
                value={filter}
                onChange={filterChange}
                className="px-1 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="open">Open Issues</option>
                <option value="resolved">Resolved Issues</option>
                <option value="closed">Closed Issues</option>
              </select>
            </div>
            <MapComponent
              onMarkerSelected={handleMarkerSelected}
              onNewMarkerSelected={handleNewMarkerSelected}
              reports={reports}
              newMarker={newMarker}
              filter={filter}
              selectedMarker={selectedMarker}
              mapRef={mapRef}
            ></MapComponent>
          </div>
      </div>
    </div>
  );
};
export default ReportsPage;
