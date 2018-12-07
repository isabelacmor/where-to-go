import * as utils from './utils.js';

export const fetchAllPlaces = (lat, long, radius, types, mapEl, processAllPlaces) => {
    let pyrmont = new window.google.maps.LatLng(lat, long);
    let map = new window.google.maps.Map(mapEl, {
        center: pyrmont,
        zoom: 15
    });

    var request = {
        location: pyrmont,
        radius: radius,
        type: utils.convertToStringTypes(types)  // convert typesOfPlaces here from value to string
    };

    let service = new window.google.maps.places.PlacesService(map);
    service.nearbySearch(request, processAllPlaces);
};

export const fetchPlaceDetails = (place, allPlaces, map, processPlace) => {
    // TODO: If this place_id isn't store in Redux yet, we can call the next API. Otherwise, ignore.
    var request = {
        placeId: place.place_id,
        fields: ['name', 'rating', 'formatted_phone_number', 'geometry', 'opening_hours', 'place_id', 'types']
    };

    // eslint-disable-next-line no-loop-func
    let exists = allPlaces.filter(item => {
        return item.place_id === place.place_id;
    });
    
    // Process request if the item doesn't already exist
    if (exists.length === 0) {
        console.log(place.name + " doesn't exist yet... go fetch");
        let service = new window.google.maps.places.PlacesService(map);
        service.getDetails(request, processPlace);
    }
};