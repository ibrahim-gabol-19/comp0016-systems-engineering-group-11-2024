import React from "react";
import "./Events.css";
import Calendar from "../../components/events/Calendar";
import PointOfInterest from "../../components/events/PointOfInterest";
import FeaturedEvents from "../../components/events/FeaturedEvents";
import Header from "../../components/Header";

const EventsPage = () => {
  return (
    <div>
      <Header />
      <div className="pt-20"></div>
      <div className="flex justify-center">
        <title className="px-5 font-bold text-3xl flex text-center">
          Events
        </title>
      </div>
      <FeaturedEvents />
      <Calendar />
      <PointOfInterest />
    </div>
  );
};

export default EventsPage;
