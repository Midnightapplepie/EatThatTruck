import React, { Component } from 'react';
import Map from './map';
require('../stylesheets/components/app.scss')

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="header">
          <h1>EAT THAT TRUCK</h1>
        </div>
        <Map />
      </div>
    )
  }
}

export default App;
