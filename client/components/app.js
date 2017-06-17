import React, { Component } from 'react';
import Map from './map';
import TruckFilter from './truckFilter';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div>Food Truck</div>
        <TruckFilter />
        <Map />
      </div>
    )
  }
}

export default App;
