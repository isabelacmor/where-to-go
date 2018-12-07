import React, {PureComponent} from 'react';
import * as GoogleApi from './utils/GoogleAPI.js';
import * as utils from './utils/utils.js';

// PureComponents only rerender if at least one state or prop value changes.
// Change is determined by doing a shallow comparison of state and prop keys.
class ListOfPlaces extends PureComponent {
    constructor() {
        super();

        this.processAllPlaces = this.processAllPlaces.bind(this);
        this.processPlace = this.processPlace.bind(this);
    }

    componentDidMount () {
        this.fetchAllPlaces();
    }

    // Call API with updated request when the props change from App.js
    componentWillUpdate () {
        this.fetchAllPlaces();
    }

    fetchAllPlaces () {
        GoogleApi.fetchAllPlaces(this.props.lat, this.props.long, this.props.radius, this.props.typesOfPlaces, this.refs.map, this.processAllPlaces);
    }

    processAllPlaces (results, status, pagination) {
        console.log(status);
        console.log(results);
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                var place = results[i];

                GoogleApi.fetchPlaceDetails(place, this.props.places, this.refs.map, this.processPlace);
            }

            // Get more results
            // TODO: uncomment for prod; commented in dev to reduce API calls
            // if (pagination.hasNextPage) {
            //     pagination.nextPage();
            // }
        }
    }

    processPlace (place, status) {
        console.log(status);
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            this.props.onGotNewPlaces(place);
        }

        // If the state is OVER_QUERY_LIMIT, add the place ID to a Set and have
        // a function on a set timeout for every 1000ms to retry automatically
    }

    render() {
    // The render method on this PureComponent is called only if
    // props.places or state.filterRadius has changed.

    const filteredList = this.props.places.filter(
        item => {
            let withinRadius = (this.props.radius * 0.001) >= utils.getDistanceFromLatLonInKm(item.geometry.location.lat(), item.geometry.location.lng(), this.props.userLocation.latitude, this.props.userLocation.longitude);
            let matchingType = utils.doesTypeMatch(item.types, this.props.typesOfPlaces);
            let matchingCloseTime = true;
            if (item.opening_hours) {
                matchingCloseTime = utils.timeInRange(item.opening_hours.periods, this.props.closeTime);
                
            }
            return withinRadius && matchingType && matchingCloseTime;
        }
    )

    return (
        <div id="placesContainer">
            <div id="map" ref="map"></div>
            <ul>{filteredList.map(item => <li key={item.place_id}>{item.name}</li>)}</ul>
        </div>
    );
    }
}

export default ListOfPlaces;