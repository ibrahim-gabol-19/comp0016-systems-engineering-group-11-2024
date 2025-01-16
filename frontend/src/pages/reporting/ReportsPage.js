import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../../components/home/SearchBar"; // Import the SearchBar component
import ForYouCard from "../../components/home/ForYouCard";
import MapFilter from "../../components/home/MapFilter";
import MapComponent from "../../components/reporting/MapComponent";
import SidebarReport from "../../components/reporting/SidebarReport"


const ReportsPage = () => {

  return (
    <div className=" h-[calc(100vh-80px)] w-screen  flex">
        <div className="bg-green-100  h-full w-1/6">
          <SidebarReport></SidebarReport>
        </div>
        <div className="bg-yellow-100 h-full w-5/6">
            <MapComponent></MapComponent>
        </div>

    </div>
  );
};
export default ReportsPage;
