import React, { useState } from 'react';
import './Events.css'; 
import Calendar from '../../components/events/Calendar';
import PointOfInterest from '../../components/events/PointOfInterest';

const Events = () => {
    return (
        <div>
            <title className="font-bold text-3xl flex text-center">Events</title>
            <Calendar/>
            <PointOfInterest/>
        </div> 
      );
};

export default Events;
