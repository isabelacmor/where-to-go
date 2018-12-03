import React, { Component } from 'react';
import './App.css';
import Places from './Places';
import User from './User';

class App extends Component {
  constructor () {
    super();

    this.state = { userLocation: {}};
    this.handleStoreLocation = this.handleStoreLocation.bind(this);
  }

  handleStoreLocation (position) {
    this.setState({ userLocation : position.coords });
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
