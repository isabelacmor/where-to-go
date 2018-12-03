import React, { Component } from 'react';
import './App.css';
import Places from './Places';
import User from './User';

class App extends Component {
  constructor () {
    super();

    this.state = { userLocation: { }};
    this.handleStoreLocation = this.handleStoreLocation.bind(this);
  }

  handleStoreLocation (position) {
    // Only update state if the location has actually changed to prevent refetching data from API
    if (this.state.userLocation.latitude !== position.coords.latitude || this.state.userLocation.longitude !== position.coords.longitude) {
      this.setState({ userLocation : {latitude: position.coords.latitude, longitude: position.coords.longitude }});
    } else {
      console.log("lat/long hasn't changed");
    }
  }

  render () {
    return (
      <div className="App">
        <User onGotUserLocation={this.handleStoreLocation} />
        <span>{this.state.userLocation.latitude}, {this.state.userLocation.longitude}</span>
        <Places lat={this.state.userLocation.latitude} long={this.state.userLocation.longitude} />
      </div>
    );
  }
}

export default App;
