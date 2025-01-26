import React, { useEffect, useState } from "react";

import MapComponent from "../../components/reporting/MapComponent";
import SidebarReport from "../../components/reporting/SidebarReport"


const ReportsPage = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [newMarker, setNewMarker] = useState(null);


  const handleMarkerSelected = (item) => {
    setSelectedMarker(item);
    setNewMarker(null);
  };

  const handleNewMarkerSelected = (item) => {
    setNewMarker(item);
    setSelectedMarker(null)
  }


  return (
    <div className=" h-[calc(100vh-80px)] w-screen  flex">
      <div className="bg-[#f9f9f9]  shadow-2xl py-5 rounded-xl h-full w-2/6">
        <SidebarReport selectedMarker={selectedMarker} newMarker={newMarker}></SidebarReport>
      </div>
      <div className="bg-yellow-100 h-full w-4/6">
        <MapComponent onMarkerSelected={handleMarkerSelected} onNewMarkerSelected={handleNewMarkerSelected}></MapComponent>
      </div>

    </div>
  );
};
export default ReportsPage;
