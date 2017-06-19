import React, { Component } from 'react';

class FoodTruckList extends Component {


  render(){
    const trucks = this.props.trucks;
    const listItems = trucks.map((truck) => {
      <li>{truck.name}</li>
    })

    return(
      <div className="list-container">
        <ul>{listItems}</ul>
      </div>
    )
  }
}

export default FoodTruckList
