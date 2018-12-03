import React, {PureComponent, Fragment} from 'react';

// PureComponents only rerender if at least one state or prop value changes.
// Change is determined by doing a shallow comparison of state and prop keys.
class ListOfPlaces extends PureComponent {
    constructor() {
        super();

        this.processAllPlaces = this.processAllPlaces.bind(this);
        this.processPlace = this.processPlace.bind(this);
    }

    handleRadiusChange = event => {
        this.props.onGotRadiusChange(event.target.value);
    };

    fetchNewPlaces () {
        let pyrmont = new window.google.maps.LatLng(this.props.lat, this.props.long);
        let map = new window.google.maps.Map(this.refs.map, {
            center: pyrmont,
            zoom: 15
        });

        var request = {
            location: pyrmont,
            radius: this.props.radius,
            type: ['restaurant']
        };

        let service = new window.google.maps.places.PlacesService(map);
        service.nearbySearch(request, this.processAllPlaces);
    }

    processAllPlaces (results, status, pagination) {
        console.log(status);
        console.log(results);
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            console.log();
            for (var i = 0; i < results.length; i++) {
                var place = results[i];

                // TODO: If this place_id isn't store in Redux yet, we can call the next API. Otherwise, ignore.
                var request = {
                    placeId: place.place_id,
                    fields: ['name', 'rating', 'formatted_phone_number', 'geometry', 'opening_hours', 'place_id']
                };

                // let exists = this.props.places.filter((item, place) => item.place_id === place.place_id);
                
                // Process request if the item doesn't already exist
                // if (exists.length === 0) {
                    let service = new window.google.maps.places.PlacesService(this.refs.map);
                    service.getDetails(request, this.processPlace);
                // }
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
            console.log(place);
        }
    }

    render() {
    // The render method on this PureComponent is called only if
    // props.list or state.filterRadius has changed.
    // const filteredList = this.props.places.filter(
    //     item => item.name.includes(this.state.filterRadius)
    // )

    // const filteredList = this.props.places.filter(
    //     item => item.name.includes(this.state.filterTypes)
    // )

    return (
        <Fragment>
            <div id="map" ref="map"></div>
            <input onChange={this.handleRadiusChange} value={this.props.radius} />
            {/* <ul>{filteredList.map(item => <li key={item.place_id}>{item.name}</li>)}</ul> */}
            <ul>{this.props.places.map(item => <li key={item.place_id}>{item.name}</li>)}</ul>
        </Fragment>
    );
    }
}

export default ListOfPlaces;