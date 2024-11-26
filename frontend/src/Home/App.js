import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter
import Header from "../components/Header";
import Home from "../components/Home";


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
    <div>
      
    
    <Router>
      <div className="bg-rose-100 text-black min-h-screen">
        <Header />
        <h1></h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.name} - {item.description}</li>
        ))}
      </ul>
       
      </div>
    </Router>
    </div>

  
  );
};

export default App;
