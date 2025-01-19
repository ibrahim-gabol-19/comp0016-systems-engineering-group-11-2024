import React, { useEffect, useState } from "react";

import MapComponent from "../../components/reporting/MapComponent";
import SidebarReport from "../../components/reporting/SidebarReport"


const ReportsPage = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);    

  const handleMarkerSelected = (item) => {
    setSelectedMarker(item);
  };


  return (
    <div className=" h-[calc(100vh-80px)] w-screen  flex">
        <div className="bg-[#f9f9f9]  shadow-2xl py-5 rounded-xl h-full w-1/6">
          <SidebarReport selectedMarker={selectedMarker}></SidebarReport>
        </div>
        <div className="bg-yellow-100 h-full w-5/6">
            <MapComponent onMarkerSelected={handleMarkerSelected}></MapComponent>
        </div>

    </div>
  );
};
export default ReportsPage;
