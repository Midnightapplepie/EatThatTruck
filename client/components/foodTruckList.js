import React, { Component } from 'react';
require('../stylesheets/components/foodTruckList.scss')

class FoodTruckList extends Component {

  render(){
    const trucks = this.props.trucks;
    console.log(trucks)
    const listItems = trucks.map((truck) => {
      return (
        <li key={truck.name} className="itemBlock">
          <div className="truck-name">{truck.name}</div>
          <div className="truck-food-items">Food Items: {truck.fooditems}</div>
        </li>
      )
    })

    return(
      <div className="list-container">
        <ul>{listItems}</ul>
      </div>
    )
  }
}

export default FoodTruckList
