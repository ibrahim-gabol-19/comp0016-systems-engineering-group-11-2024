import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Events from './pages/events/Events'; // Ensure correct import

const App = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/items/')
      .then(response => {
        setItems(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the items!', error);
      });
  }, []);

  return (
    <Router>
      <div className="bg-gray-100 text-black min-h-screen">
        {/* Header stays fixed */}
        <Header />

        {/* Main content with padding-top to avoid overlap with the fixed header */}
        <div className="pt-20">
          {/* Define routes inside the Router using Routes */}
          <Routes>
            <Route path="/events" element={<Events />} />
            {/* You can add more routes here */}
          </Routes>

          <h1>Item List</h1>
          <ul>
            {items.map(item => (
              <li key={item.id}>{item.name} - {item.description}</li>
            ))}
          </ul>
        </div>
      </div>
    </Router>
  );
};

export default App;