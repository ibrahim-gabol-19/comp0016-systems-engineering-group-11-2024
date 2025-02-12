import React, { useEffect, useState } from "react";

import MapComponent from "./MapComponent";
import SidebarReport from "./SidebarReport";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

const ReportsSection = ({userQuery}) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [newMarker, setNewMarker] = useState(null);
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("open");

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

  const filterChange = (event) => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="h-full w-full flex flex-col py-1 pr-2">
      <div className="h-full flex flex-col">
        <div className=" h-full w-full flex">
          <div className="bg-[#f9f9f9]  shadow-l py-5 rounded-xl h-full w-2/6">
            <SidebarReport
              selectedMarker={selectedMarker}
              newMarker={newMarker}
              fetchReports={fetchReports}
            ></SidebarReport>
          </div>
          <div className=" h-full flex flex-col w-4/6 pb-9">
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
              userQuery={userQuery}
            ></MapComponent>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReportsSection;
