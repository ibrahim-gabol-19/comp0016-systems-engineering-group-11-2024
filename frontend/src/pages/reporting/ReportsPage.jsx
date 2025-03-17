import React, { useEffect, useState, useRef } from "react";
import MapComponent from "../../components/reporting/MapComponent";
import SidebarReport from "../../components/reporting/SidebarReport";
import axios from "axios";
import Header from "../../components/Header";
import ReactMarkdown from "react-markdown";
import { useLocation } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const ReportsPage = () => {
  const location = useLocation();
  const [selectedMarker, setSelectedMarker] = useState(
    location.state?.selectedIssue || null
  );
  const [newMarker, setNewMarker] = useState(null);
  const [reports, setReports] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    !!location.state?.selectedIssue
  );
  const [viewingAISummary, setViewingAISummary] = useState(false);
  const [modelReply, setModelReply] = useState("");
  const [lastSummaryID, setLastSummaryID] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");


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

  const handleNewMarkerSelected = (item) => {
    setNewMarker(item);
    setSelectedMarker(null);
    setIsSidebarOpen(true);
  };

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(API_URL + "reports/", {
        headers,
      });
      const newReports = response.data;
      setReports(newReports);

      if (selectedMarker) {
        const updatedMarker = newReports.find(
          (report) => report.id === selectedMarker.id
        );
        setSelectedMarker(updatedMarker || null);
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

    if (location.state?.selectedIssue) {
      setSelectedMarker(location.state.selectedIssue);
      setIsSidebarOpen(true);
    }

    if (location.state?.newIssue) {
      const newIssue = location.state.newIssue;
      setNewMarker(newIssue);
      setIsSidebarOpen(true);
      setTitle(newIssue.title);
      setDescription(newIssue.description);
    }
    // eslint-disable-next-line
  }, [location.state?.selectedIssue, location.state?.newIssue]);

  // Close the AI summary box if selectedMarker was changed
  useEffect(() => {
    if (selectedMarker && selectedMarker.id !== lastSummaryID) {
      setViewingAISummary(false);
    }
    // eslint-disable-next-line
  }, [selectedMarker]);

  const handleOutsideClick = (event) => {
    if (selectedMarker || newMarker) {
      if (sidebarRef.current && sidebarRef.current.contains(event.target)) {
        return;
      }
      if (
        mapRef.current &&
        mapRef.current.getContainer().contains(event.target)
      ) {
        return;
      }
      setSelectedMarker(null);
      setNewMarker(null);
      setIsSidebarOpen(false);
    }
  };

  const handleSidebarClose = () => {
    setSelectedMarker(null);
    setNewMarker(null);
    setIsSidebarOpen(false);
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
      <Header />
      <div className="pt-20"></div>
      <div className="h-full flex mt-4">
        {isSidebarOpen && (
          <div
            className={`bg-[#f9f9f9] shadow-2xl py-5 rounded-xl h-full ${
              isSidebarOpen ? "w-full" : "w-2/6"
            } relative sm:w-2/6`}
            ref={sidebarRef}
          >
            <button
              className="absolute top-4 right-5 text-3xl scale-150"
              onClick={handleSidebarClose}
            >
              &times;
            </button>
            <SidebarReport
              selectedMarker={selectedMarker}
              newMarker={newMarker}
              fetchReports={fetchReports}
              onSidebarClose={handleSidebarClose}
              viewingAISummary={viewingAISummary}
              setViewingAISummary={setViewingAISummary}
              modelReply={modelReply}
              setModelReply={setModelReply}
              lastSummaryID={lastSummaryID}
              setLastSummaryID={setLastSummaryID}
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
            ></SidebarReport>
          </div>
        )}
        <div
          className={`h-full flex flex-col ${
            selectedMarker || newMarker
              ? "w-4/6 hidden sm:flex"
              : "flex-grow min-w-0"
          } relative`}
        >
          <MapComponent
            onMarkerSelected={handleMarkerSelected}
            onNewMarkerSelected={handleNewMarkerSelected}
            reports={reports}
            newMarker={newMarker}
            activeFilters={getActiveFilters()}
            selectedMarker={selectedMarker}
            mapRef={mapRef}
          ></MapComponent>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10 mb-10">
            <button
              className={`px-4 py-2 rounded-lg border-2 border-gray-400 ${
                filterToggles.open
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-gray-200"
              }`}
              onClick={() => handleToggleChange("open")}
            >
              Unresolved
            </button>
            <button
              className={`px-4 py-2 rounded-lg border-2 border-gray-400 ${
                filterToggles.resolved
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-gray-200"
              }`}
              onClick={() => handleToggleChange("resolved")}
            >
              Resolved
            </button>
            <button
              className={`px-4 py-2 rounded-lg border-2 border-gray-400 ${
                filterToggles.closed
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-gray-200"
              }`}
              onClick={() => handleToggleChange("closed")}
            >
              Closed
            </button>
          </div>
        </div>
        <div className="absolute lg:top-1/3 lg:w-1/4 top-1/3 lg:translate-x-[135%] lg:translate-y-[0%] translate-y-[80%] lg:bottom-auto bottom-0">
          {/* Expandable AI Summary Section */}
          {viewingAISummary && selectedMarker && (
            <div className="mt-4 p-4 max-h-[40rem] overflow-auto px-4 py-3 bg-blue-50 rounded-2xl shadow-md border border-gray-200">
              <p
                className={`text-gray-700 ${
                  !modelReply ? "animate-pulse bg-gray-200 rounded" : ""
                }`}
              >
                <ReactMarkdown className="text-gray-800">
                  {modelReply || ""}
                </ReactMarkdown>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ReportsPage;
