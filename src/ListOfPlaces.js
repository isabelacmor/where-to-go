import React, {PureComponent} from 'react';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import './ListOfPlaces.css';
import MultiselectTags from './MultiselectTags';
import TypesEnum from './placetypes';
import CodesEnum from './codetypes';
import FormControl from 'react-bootstrap/lib/FormControl';
import TimePicker from 'react-bootstrap-time-picker';

// PureComponents only rerender if at least one state or prop value changes.
// Change is determined by doing a shallow comparison of state and prop keys.
class ListOfPlaces extends PureComponent {
    constructor() {
        super();

        this.state = { sliderRadiusValue: 1000, time: "3600" };

        this.processAllPlaces = this.processAllPlaces.bind(this);
        this.processPlace = this.processPlace.bind(this);
        this.handleTypeOfPlacesChanged = this.handleTypeOfPlacesChanged.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
    }

    componentDidMount () {
        this.setState({ sliderRadiusValue: parseInt(this.props.radius) });
        this.fetchNewPlaces();
    }

    handleRadiusChange = v => {
        this.props.onGotRadiusChange(this.state.sliderRadiusValue);
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
            type: this.convertToStringTypes(this.props.typesOfPlaces)  // convert typesOfPlaces here from value to string
        };

        console.log("REQUEST");
        console.log(request);

        let service = new window.google.maps.places.PlacesService(map);
        service.nearbySearch(request, this.processAllPlaces);
    }
    
    convertToStringTypes(typesByValue) {
        let stringRes = [];
        let codeRes = [];

        typesByValue.forEach(type => {
            stringRes = stringRes.concat(Object.keys(TypesEnum).filter(key => TypesEnum[key] === type));
        });

        stringRes.forEach(s => {
            codeRes = codeRes.concat(CodesEnum[s]);
        });

        return codeRes;
    }

    processAllPlaces (results, status, pagination) {
        console.log(status);
        console.log(results);
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                var place = results[i];

                // TODO: If this place_id isn't store in Redux yet, we can call the next API. Otherwise, ignore.
                var request = {
                    placeId: place.place_id,
                    fields: ['name', 'rating', 'formatted_phone_number', 'geometry', 'opening_hours', 'place_id', 'types']
                };

                // eslint-disable-next-line no-loop-func
                let exists = this.props.places.filter(item => {
                    return item.place_id === place.place_id;
                });
                
                // Process request if the item doesn't already exist
                if (exists.length === 0) {
                    console.log(place.name + " doesn't exist yet... go fetch");
                    let service = new window.google.maps.places.PlacesService(this.refs.map);
                    service.getDetails(request, this.processPlace);
                }
            }

            // Get more results
            // TODO: uncomment for prod; commented in dev to reduce API calls
            // if (pagination.hasNextPage) {
            //     pagination.nextPage();
            // }
        }
    }

    processPlace (place, status) {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            this.props.onGotNewPlaces(place);
        }
    }

    getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
        var dLon = this.deg2rad(lon2-lon1); 
        var a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        return d;
    }

    deg2rad(deg) {
        return deg * (Math.PI/180);
    }

    handleTypeOfPlacesChanged(selectedOptions) {
        this.props.onGotNewTypesOfPlaces(selectedOptions);
    }

    doesTypeMatch(list1, list2) {
        console.log(list1);
        console.log("vs");
        console.log(list2);
        
        let newList = this.convertToStringTypes(list2);
        let found = false;
        list1.forEach(type => {
            if (newList.indexOf(type) !== -1) {
                found =  true;
            }
        });

        return found;
    }

    handleTimeChange (time) {
        this.setState({time : time});
        let hour = this.pad(2, Math.floor(time/60/60));
        let minute = this.pad(2, (time/60) % 60);
        console.log(hour + "" + minute);
        this.props.onGotNewCloseTime(time);
    }

    pad = function(size, num) {
        var s = String(num);
        while (s.length < (size || 2)) {s = "0" + s;}
        return s;
    }

    timeInRange (allHours, curHour) {
        let currentDay = new Date().getDay()-1;
        console.log("==============================");
        console.log(allHours);
        console.log(allHours[currentDay]);

        let hour = this.pad(2, Math.floor(curHour/60/60));
        let minute = this.pad(2, (curHour/60) % 60);


        if (allHours[currentDay]) {
            console.log(allHours[currentDay].open.time + " <= " + parseInt(hour + "" + minute) + " <= " + parseInt(allHours[currentDay].close.time));
            return parseInt(curHour) >= parseInt(allHours[currentDay].open.time) && parseInt(hour + "" + minute) <= parseInt(allHours[currentDay].close.time);
        }

        return false;
        
    }

    render() {
    // The render method on this PureComponent is called only if
    // props.places or state.filterRadius has changed.

    const filteredList = this.props.places.filter(
        item => { 
            console.log(item);
            let withinRadius = (this.props.radius * 0.001) >= this.getDistanceFromLatLonInKm(item.geometry.location.lat(), item.geometry.location.lng(), this.props.userLocation.latitude, this.props.userLocation.longitude);
            let matchingType = this.doesTypeMatch(item.types, this.props.typesOfPlaces);
            let matchingCloseTime = true;
            if (item.opening_hours) {
                console.log(item.opening_hours.periods)
                console.log(this.props.closeTime);
                matchingCloseTime = this.timeInRange(item.opening_hours.periods, this.props.closeTime);
                
            }
            console.log(matchingCloseTime);
            return withinRadius && matchingType && matchingCloseTime;
        }
    )

    return (
        <div id="placesContainer">
            <div id="map" ref="map"></div>
            <div id="inputRangeContainer">
                <InputRange
                    formatLabel={sliderRadiusValue => `${sliderRadiusValue}m`}
                    maxValue={50000}
                    minValue={1000}
                    step={1000}
                    value={this.state.sliderRadiusValue}
                    onChange={sliderRadiusValue => this.setState({ sliderRadiusValue })}
                    onChangeComplete={this.handleRadiusChange} />
                <MultiselectTags 
                    onTypeOfPlacesChanged={this.handleTypeOfPlacesChanged}
                    typesOfPlaces={this.props.typesOfPlaces} />
                <TimePicker step={30}
                    onChange={this.handleTimeChange}
                    value={this.state.time} />
            </div>
            <ul>{filteredList.map(item => <li key={item.place_id}>{item.name}</li>)}</ul>

            {/* <ul>{this.props.places.map(item => <li key={item.place_id}>{item.name}</li>)}</ul> */}
        </div>
    );
    }
}

export default ListOfPlaces;