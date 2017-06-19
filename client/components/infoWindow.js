import React, { Component } from 'react';
require('../stylesheets/components/infoWindow.scss')

const InfoWindow = (truck) => {

    return (
      <div className="info-container">
        <div className="header">{truck.name}</div>
        <div className="details">
          <div>
            <span className="bold">Address:</span>
            <span>{truck.address}</span>
          </div>
          <div>
            <span className="bold">schedule:</span>
            <span>{truck.scheduleString}</span>
          </div>
        </div>
        <div className="food-items">
          <span className="bold">Food Items:</span>
          <span>{truck.fooditems}</span>
        </div>
      </div>
    )
}

export default InfoWindow
