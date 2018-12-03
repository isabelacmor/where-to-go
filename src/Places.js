import React, {Component} from 'react';
import secrets from './secrets.json';

class Places extends Component {
    constructor() {
        super();
        this.state = { places: []};
        this.processAllPlaces = this.processAllPlaces.bind(this);
        this.processPlace = this.processPlace.bind(this);
    }

    // Call our API every time the lat/long changes
    componentWillUpdate () {
        this.fetchNewPlaces();
    }

    fetchNewPlaces () {
        console.log(this.props);
        let pyrmont = new window.google.maps.LatLng(this.props.lat, this.props.long);

        let map = new window.google.maps.Map(this.refs.map, {
            center: pyrmont,
            zoom: 15
            });

        var request = {
            location: pyrmont,
            radius: '5000',
            type: ['restaurant']
        };

        let service = new window.google.maps.places.PlacesService(map);
        service.nearbySearch(request, this.processAllPlaces);
    }

    processAllPlaces (results, status, pagination) {
        if (status == window.google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                var place = results[i];

                // TODO: If this place_id isn't store in Redux yet, we can call the next API. Otherwise, ignore.
                var request = {
                    placeId: place.place_id,
                    fields: ['name', 'rating', 'formatted_phone_number', 'geometry', 'opening_hours']
                };
                
                let service = new window.google.maps.places.PlacesService(this.refs.map);
                service.getDetails(request, this.processPlace);
            }

            console.log(pagination);
            // Get more results
            if (pagination.hasNextPage) {
                pagination.nextPage();
            }
        }
    }

    processPlace (place, status) {
        if (status == window.google.maps.places.PlacesServiceStatus.OK) {
            // More details for this particular place. We'll want to store these in Redux
            // and eventually check to see which are open at the time the user specified 
            // and update the UI (likely using filter)

            // TODO: BUG: don't have multiples. Figure out how to get place_id from processAllPlaces call in here to check
            this.setState(prevState => ({
                places: prevState.places.concat([place])
            }));
        }
    }

    render () {
        return(
            <div>
                <h1>Places nearby</h1>
                <div id="map" ref="map"></div>
                <ul>
                    {
                        this.state.places.map((item, index) =>
                            <li key={index}>
                                <span>{item.name}</span>
                            </li>
                        )
                    }
                </ul>
            </div>
        );
    }
}

export default Places;