import React, { Component } from 'react';
import './App.css';
import User from './User';
import ListOfPlaces from './ListOfPlaces';
import TypesEnum from './placetypes';
import RadiusInput from './RadiusInput';
import TimeInput from './TimeInput';
import MultiselectTags from './MultiselectTags';
import './ListOfPlaces.css';

class App extends Component {
  constructor () {
    super();

    this.state = { userLocation: { }, radius: '8000', places: [], typesOfPlaces: [TypesEnum.Restaurants], closeTime: { hours : 16, minutes : 0} };
    this.handleStoreLocation = this.handleStoreLocation.bind(this);
    this.handleUpdateRadius = this.handleUpdateRadius.bind(this);
    this.handleUpdatePlaces = this.handleUpdatePlaces.bind(this);
    this.handleUpdateTypesOfPlaces = this.handleUpdateTypesOfPlaces.bind(this);
    this.handleUpdateCloseTime = this.handleUpdateCloseTime.bind(this);

    this.placesComponent = React.createRef();
  }

  handleStoreLocation (position) {
    // Only update state if the location has actually changed to prevent refetching data from API
    if (this.state.userLocation.latitude !== position.coords.latitude || this.state.userLocation.longitude !== position.coords.longitude) {
      this.setState({ userLocation : {latitude: position.coords.latitude, longitude: position.coords.longitude }});
    } else {
      console.log("lat/long hasn't changed");
    }
  }

  handleUpdateRadius (r) {
    this.setState({ radius: r });
  }

  handleUpdatePlaces (place) {
    // Update state as long as it doesn't already contain this place.
    // Drawback: this place's info might change. Consider replacing the existing item if found.
    this.setState(prevState => {
        let exists = false;
        let temp = prevState.places;

        // Make sure we don't add a place that already exists in our state
        for (let i = 0; i < temp.length; i++) {
            if (temp[i].place_id === place.place_id) {
                exists = true;
                break;
            }
        }
        
        if (!exists) {
            temp = temp.concat([place]);
        }

        return {
            places: temp
        }
    });
  }

  handleUpdateTypesOfPlaces (types) {
    this.setState({ typesOfPlaces : types });
  }

  handleUpdateCloseTime (time) {
    this.setState({ closeTime: time });
  }

  render () {
    return (
      <div className="App">
        <User onGotUserLocation={this.handleStoreLocation} />
        
        <div id="inputRangeContainer">
          <RadiusInput 
            onGotRadiusChange={this.handleUpdateRadius}
            radius={this.state.radius} />
          <TimeInput 
            onGotNewCloseTime={this.handleUpdateCloseTime} />
          <MultiselectTags 
            onTypeOfPlacesChanged={this.handleUpdateTypesOfPlaces}
            typesOfPlaces={this.state.typesOfPlaces} />
        </div>
          
        <ListOfPlaces 
          ref={this.placesComponent} 
          onGotNewPlaces={this.handleUpdatePlaces}
          places={this.state.places} 
          lat={this.state.userLocation.latitude} 
          long={this.state.userLocation.longitude} 
          radius={this.state.radius}
          userLocation={this.state.userLocation}
          typesOfPlaces={this.state.typesOfPlaces}
          closeTime={this.state.closeTime} />
      </div>
    );
  }
}

export default App;
