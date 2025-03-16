/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

// Create a context
export const CompanyContext = createContext();

// Create a provider component
export const CompanyProvider = ({ children }) => {
  const [companyInfo, setCompanyInfo] = useState({
    id: 1, // Default ID
    name: "Example Company", // Default name
    about: "This is an example company. It's just a placeholder.", // Default about
    logo: null, // Default logo (null if not provided)
    main_color: "#000000", // Default color
    font: "Arial", // Default font
    sw_lat: "34.052235", // Default SW latitude
    sw_lon: "-118.243683", // Default SW longitude
    ne_lat: "34.052255", // Default NE latitude
    ne_lon: "-118.243600", // Default NE longitude
  });
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const response = await fetch(`${API_URL}companyinformation/1/`);
        const data = await response.json();

        // Set all company information in state
        setCompanyInfo({
          id: data.id || 1, // Default to 1 if not provided
          name: data.name || "Example Company", // Default name
          about:
            data.about ||
            "This is an example company. It's just a placeholder.", // Default about
          logo: data.logo || null, // Default to null if no logo
          main_color: data.main_color || "#000000", // Default color
          font: data.font || "Arial", // Default font
          sw_lat: data.sw_lat || "34.052235", // Default SW latitude
          sw_lon: data.sw_lon || "-118.243683", // Default SW longitude
          ne_lat: data.ne_lat || "34.052255", // Default NE latitude
          ne_lon: data.ne_lon || "-118.243600", // Default NE longitude
        });
      } catch (error) {
        console.error("Error fetching company information:", error);

        // Set default values in case of an error
        setCompanyInfo({
          id: 1,
          name: "Example Company",
          about: "This is an example company. It's just a placeholder.",
          logo: null,
          main_color: "#000000",
          font: "Arial",
          sw_lat: "34.052235",
          sw_lon: "-118.243683",
          ne_lat: "34.052255",
          ne_lon: "-118.243600",
        });
      }
    };

    fetchCompanyInfo();
  }, []);

  return (
    <CompanyContext.Provider value={companyInfo}>
      {children}
    </CompanyContext.Provider>
  );
};
