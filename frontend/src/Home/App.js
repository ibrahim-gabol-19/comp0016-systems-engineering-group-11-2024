import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "../components/Header";
import Home from "../components/Home";
import MapFilter from "../components/Home/MapFilter"; // Import MapFilter

const App = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/items/")
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the items!", error);
      });
  }, []);

  return (
    <div>
      <Router>
        <div className="bg-rose-100 text-black min-h-screen">
          <Header />
          <div className="container mx-auto px-4 py-8">
            {/* MapFilter component */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3">
                <MapFilter />
              </div>

              {/* Home content */}
              <div className="w-full md:w-2/3">
                <h1 className="text-2xl font-bold mb-4">Items List</h1>
                <ul className="list-disc list-inside">
                  {items.map((item) => (
                    <li key={item.id} className="mb-2">
                      <span className="font-semibold">{item.name}</span> -{" "}
                      {item.description}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Router>
    </div>
  );
};

export default App;

