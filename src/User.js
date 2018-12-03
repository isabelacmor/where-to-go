import React, {Component} from 'react';

class User extends Component {
    constructor () {
        super();

        this.updateLocation = this.updateLocation.bind(this);
    }

    getLocation () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.updateLocation);
        } else { 
            console.log("Geolocation is not supported by this browser.");
        }
    }

    updateLocation (position) {
        console.log(position);
        this.props.onGotUserLocation(position);
    }

    render () {
        this.getLocation();

        return(
            <h1>User</h1>
        );
    }
}

export default User;