import React, { useState, useEffect } from "react";
import axios from 'axios';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import leaflet styles


import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

{/*Make default Icon show up for Markers*/ }
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 16]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = ({ onMarkerSelected, onNewMarkerSelected, reports, newMarker }) => {
  const [filteredItems, setFilteredItems] = useState([]);
  const [mapCenter, setMapCenter] = useState([52.1864, 0.1145]); // Default center of the UK (London)
  const [zoomLevel, setZoomLevel] = useState(13); // Default zoom level for the UK
  const [position, setPosition] = useState(null); 
  

  
  const data = [
    {
      id: 1,
      name: "Volunteering Event",
      type: "issues",
      date: "2024-12-15",
      emoji: "🙌",
      lat: 51.5074,
      lng: -0.1278,
      discussion: [
        "I think this is good!",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
      ],
    }, // London
    {
      id: 2,
      name: "News Update",
      type: "issues",
      date: "2024-12-10",
      emoji: "📰",
      lat: 53.4084,
      lng: -2.9916,
      discussion: [
        "I think this is good!",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
      ],
    }, // Manchester
    {
      id: 3,
      name: "Local Issue",
      type: "issues",
      date: "2024-12-14",
      emoji: "⚠️",
      lat: 52.4862,
      lng: -1.8904,
      discussion: [
        "I think this is good!",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
      ],
    }, // Birmingham
    {
      id: 4,
      name: "Community Event",
      type: "issues",
      date: "2024-12-12",
      emoji: "📍",
      lat: 51.4545,
      lng: -2.5879,
      discussion: [
        "I think this is good!",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
      ],
    }, // Bristol
    {
      id: 5,
      name: "Volunteering Event",
      type: "issues",
      date: "2024-12-13",
      emoji: "🙌",
      lat: 55.9533,
      lng: -3.1883,
      discussion: [
        "I think this is good!",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
      ],
    }, // Edinburgh
    {
      id: 6,
      name: "News Update",
      type: "issues",
      date: "2024-12-16",
      emoji: "📰",
      lat: 53.408,
      lng: -2.2389,
      discussion: [
        "I think this is good!",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
      ],
    }, // Liverpool
    {
      id: 7,
      name: "Local Issue",
      type: "issues",
      date: "2024-12-17",
      emoji: "⚠️",
      lat: 52.2053,
      lng: 0.1218,
      discussion: [
        "I think this is good!",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
        "I dont",
      ],
    }, // Cambridge
    {
      "id": 8,
      "name": "Community pickup for Trafalgar Square (Green Earth)",
      "type": "issues",
      "status": "Open",
      "tags": "Environmental",
      "poster": "Jane Doe",
      "description": "This is my description and such. I don't think this is good for our streets, could someone help please! There’s too much litter around Trafalgar Square. It’s affecting both the environment and public health. Any volunteers?",
      "date": "2024-12-11",
      "emoji": "📍",
      "lat": 52.2053,
      "lng": 0.1418,
      "discussion": [
        "I agree, the amount of litter in Trafalgar Square is overwhelming. I’ve seen it get worse in recent months.",
        "We need more organized cleanups in central locations like this one. It's not just about looks, it's about the environment.",
        "I can bring some gloves and trash bags for this. Just let me know when!",
        "I think the local government should do more to maintain this area. They’ve been slacking off lately.",
        "I don’t know if we’ll make much of a difference with just a few people, but it’s worth a try.",
        "I think the tourist foot traffic contributes a lot to the mess. Maybe an awareness campaign could help too.",
        "I’ve seen people just drop their trash right in the middle of the square! How can we stop that?",
        "I wonder if there’s any way to get a waste disposal bin system that’s more sustainable in the area.",
        "I don’t think this is going to be easy, but we should definitely try to make a change.",
        "This is such an important issue. Let’s take it one step at a time and focus on the positives.",
        "I’ll spread the word to others, the more hands, the better."
      ]
    },
    {
      "id": 9,
      "name": "Cambridge Park Waste Cleanup",
      "type": "issues",
      "status": "Open",
      "tags": "Environmental",
      "poster": "John Smith",
      "description": "There’s too much litter piling up in Cambridge Park. It's ruining the beauty of the area and could potentially harm the local wildlife. Let’s work together to clean it up and keep it looking nice for everyone.",
      "date": "2025-01-15",
      "emoji": "⚠️",
      "lat": 52.2155,
      "lng": 0.1419,
      "discussion": [
        "This park is one of my favorite spots in Cambridge. I’ve noticed it’s getting dirtier recently, we definitely need action.",
        "Totally! It’s also unsafe for animals. I’ve seen birds and squirrels eating things they shouldn’t because of all the trash.",
        "Let me know when you plan the cleanup, I’ll bring some cleaning supplies and help out.",
        "There’s so much plastic everywhere. It’s heartbreaking to see it in such a beautiful park.",
        "I’ve contacted the local council about this. Hopefully they’ll assist with providing more waste bins and regular collections.",
        "We should set up a recycling station too. That might encourage people to be more mindful of their trash.",
        "I’m surprised how quickly the trash builds up here. It seems like no one is taking responsibility.",
        "Maybe we can organize a regular cleanup crew to meet once a month? That would help keep the park clean in the long term.",
        "Definitely a good idea! We could even get local schools involved to raise awareness about keeping the environment clean.",
        "Count me in! We can also look into getting a community fundraiser for some supplies if needed.",
        "I’ll bring a few friends along. The more, the merrier, and the quicker we’ll get it done."
      ]
    },
    {
      "id": 10,
      "name": "Mill Road Waste Disposal Cleanup",
      "type": "issues",
      "status": "Open",
      "tags": "Environmental",
      "poster": "Sarah Johnson",
      "description": "The mess on Mill Road is getting out of hand. People are dumping all sorts of trash on the sidewalks, and it’s making the area unsafe and unpleasant. Let’s gather and clean up Mill Road so that we can restore its beauty and make it safer for pedestrians.",
      "date": "2025-01-18",
      "emoji": "⚠️",
      "lat": 52.1976,
      "lng": 0.1437,
      "discussion": [
        "This is getting ridiculous. I walk down Mill Road every day and it seems like the trash is never picked up. We need to take action!",
        "I live nearby and I can definitely help. The state of the street is just shameful, especially with all the waste lying around.",
        "It’s also starting to attract pests like rats and seagulls. That makes the situation even worse.",
        "I think it would be good if we set up a regular cleaning event. It’s not just a one-time thing, this needs ongoing attention.",
        "I’ll bring a broom, dustpan, and gloves. Maybe we can also get some flyers printed to raise awareness and stop more people from littering.",
        "There are way too many takeaway containers and plastic bottles on the ground. We should also encourage more recycling bins along the road.",
        "Maybe we can partner with a local business to provide us with some cleaning supplies or even offer incentives for people who volunteer.",
        "I’ve noticed more littering near the bus stop areas. We should focus on those high-traffic zones first.",
        "Absolutely, we need to target the most polluted parts first. Once the streets look cleaner, people will hopefully start taking care of them more.",
        "I’ll post about this on social media to get more people involved. Let’s get the word out!",
        "The sooner we get started, the sooner we’ll see improvements. Let’s pick a day and get to work!"
      ]
    },
    {
      "id": 11,
      "name": "King’s Parade Clean-Up Initiative",
      "type": "issues",
      "status": "Open",
      "tags": "Environmental",
      "poster": "Emily Green",
      "description": "King’s Parade has become cluttered with all kinds of rubbish, especially around the benches and trees. This area is a popular spot for locals and tourists alike, but the increasing amount of litter is affecting its charm. Let’s all pitch in to clean up the area and restore it to its former glory.",
      "date": "2025-01-19",
      "emoji": "📍",
      "lat": 52.1858,
      "lng": 0.1212,
      "discussion": [
        "This is such a beautiful area, but the litter has really been getting out of hand. It feels like no one is doing anything about it.",
        "I’ve noticed a lot of food wrappers and coffee cups on the ground lately. It’s frustrating because people just leave their trash behind.",
        "I walk through King’s Parade on my way to work every day, and it’s so disheartening to see the mess. We need to make a real change.",
        "Maybe we can also work with local cafes and restaurants to encourage people to clean up after themselves or have some bins nearby.",
        "I’m happy to help out! I’ll bring bags, gloves, and some snacks for volunteers. It’ll be fun to work together on this.",
        "I’ll bring my kids along. It’ll be a good way to teach them about taking care of the environment.",
        "If we can get enough people, we can really make a difference. I think it’ll also inspire others to do their part.",
        "It’s great to see everyone getting involved. The more people we get, the quicker it’ll get done.",
        "I’m thinking we can also create some signs to encourage people to dispose of their trash properly and to educate them on the impact of littering.",
        "I’ll spread the word on social media and to my friends. We need all hands on deck to tackle this mess."
      ]
    },
    {
      "id": 12,
      "name": "Cambridge Park Litter Cleanup",
      "type": "issues",
      "status": "Open",
      "tags": "Environmental",
      "poster": "Mark Davis",
      "description": "Jesus Green is a beautiful park, but the litter problem is really starting to affect the atmosphere. It’s a popular spot for families and dog walkers, but the increasing trash piles are ruining the natural beauty. Let's get together and make this park clean again!",
      "date": "2025-01-16",
      "emoji": "🙌",
      "lat": 52.2164,
      "lng": 0.1145,
      "discussion": [
        "I love Jesus Green, but the state of it is becoming unacceptable. I’ve noticed piles of plastic bottles and fast food wrappers all over.",
        "It’s a shame because this is such a lovely park. I’ve been thinking about organizing a cleanup myself, so I’m glad to see others are on the same page.",
        "I can definitely help out with cleaning supplies. A few bags and gloves should be enough to get started.",
        "I think one of the main problems is people leaving their trash behind after barbecues and picnics. It seems like no one is taking responsibility for cleaning up.",
        "Maybe we should partner with local stores to get some eco-friendly supplies or organize a fundraising campaign to cover the cost of supplies.",
        "We should definitely focus on the main walking paths first, then spread out to the areas where people gather.",
        "It’s sad to see the wildlife being affected. I’ve seen birds pecking at plastic bits, which is really concerning.",
        "I’ll bring my neighbors along. We’ll definitely make a day out of it and clean as much as we can.",
        "I’ve seen other parks successfully hold cleanups with great results, so I know it’ll be worth it if we stick together.",
        "I’ve made a post online to get more people involved. The more volunteers we have, the faster it’ll get done."
      ]
    }



  ];

  const ukBounds = [
    [49.5, -8], // Southwest coordinates (approx.)
    [60, 2], // Northeast coordinates (approx.)
  ];

  function NewReport() {
    const map = useMapEvents({
      click(e) {
        // Close any open popups
        map.closePopup();

        // Update position for the new marker
        setPosition(e.latlng);

        // Optionally, fly to the clicked location
        map.flyTo(e.latlng, map.getZoom());

        // Notify parent component of new marker
        onNewMarkerSelected(e);
      },
      locationfound(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
        
      },
    });

    return newMarker === null ? null : (
      <Marker
        position={position}
        draggable={true}

      >
        <Popup>You are here</Popup>
      </Marker>
    );
  }

  return (
    <MapContainer
      center={mapCenter}
      zoom={zoomLevel}
      style={{ width: "100%", minHeight: "100%", height: "100%" }}
      maxBounds={ukBounds} // Restrict map movement to UK
      maxBoundsViscosity={1.0} // Ensures map stays within bounds
      minZoom={8} // Set minimum zoom level to allow zooming in further
      maxZoom={17} // Set maximum zoom level to zoom in further
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {reports.map((item) => (
        <Marker
          key={item.id}
          position={[item.latitude, item.longitude]}
          eventHandlers={{
            click: () => {
              console.log("Marker clicked:", item); // Log the data of the clicked marker
              onMarkerSelected(item);
            },
          }}
        >
          <Popup>{item.name}</Popup>
        </Marker>
      ))}
      <NewReport />
    </MapContainer>
  );
};

export default MapComponent;
