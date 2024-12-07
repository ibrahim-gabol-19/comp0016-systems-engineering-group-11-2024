import React, { useState } from 'react';
import './Events.css'; 
import Calendar from '../../components/events/Calendar';
import PointOfInterest from '../../components/events/PointOfInterest';

const Events = () => {
    return (
        <div>
            <Calendar/>
            <PointOfInterest/>
        </div>    
      );
};

export default Events;
