import React, { useEffect, useState } from "react";

import MapComponent from "../../components/reporting/MapComponent";
import SidebarReport from "../../components/reporting/SidebarReport";
import axios from "axios";

const ReportsPage = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [newMarker, setNewMarker] = useState(null);
  const [reports, setReports] = useState([]);

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
      const response = await axios.get("http://127.0.0.1:8000/reports/");
      const newReports = response.data;
      setReports(newReports);
  
      if (selectedMarker) {
        // Directly find the updated marker in the new reports
        const updatedMarker = newReports.find((report) => report.id === selectedMarker.id);
        setSelectedMarker(updatedMarker || null);  // Set to null if not found
      }
      if (newMarker)
      {
        setNewMarker(null);
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className=" h-[calc(100vh-80px)] w-screen  flex">
      <div className="bg-[#f9f9f9]  shadow-2xl py-5 rounded-xl h-full w-2/6">
        <SidebarReport
          selectedMarker={selectedMarker}
          newMarker={newMarker}
          fetchReports={fetchReports}
        ></SidebarReport>
      </div>
      <div className="bg-yellow-100 h-full w-4/6">
        <MapComponent
          onMarkerSelected={handleMarkerSelected}
          onNewMarkerSelected={handleNewMarkerSelected}
          reports={reports}
          newMarker={newMarker}
        ></MapComponent>
      </div>
    </div>
  );
};
export default ReportsPage;
