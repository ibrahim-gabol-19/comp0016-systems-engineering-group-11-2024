import React from 'react';
import './Events.css'; 
import Calendar from '../../components/Events/Calendar';
import PointOfInterest from '../../components/Events/PointOfInterest';
import FeaturedEvents from '../../components/Events/FeaturedEvents';

const EventsPage = () => {
    return (
        <div>
            <div className="flex justify-center">
                <title className="px-5 font-bold text-3xl flex text-center">Events</title>
            </div> 
            <FeaturedEvents/>
            <Calendar/>
            <PointOfInterest/>
        </div>
      );
};

export default EventsPage;
