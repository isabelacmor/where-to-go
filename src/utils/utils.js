import TypesEnum from '../placetypes';
import CodesEnum from '../codetypes';

export const convertToStringTypes = (typesByValue) => {
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

export const getDistanceFromLatLonInKm = (lat1,lon1,lat2,lon2) => {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
}

export const doesTypeMatch = (list1, list2) => {      
    let newList = convertToStringTypes(list2);
    let found = false;
    list1.forEach(type => {
        if (newList.indexOf(type) !== -1) {
            found =  true;
        }
    });

    return found;
}

export const timeInRange = (allHours, userTime) => {
    // TODO: Handle special case of being open 24 hours
    // periods:
    // Array[1]
    // 0:
    // {…}
    // open:
    // {…}
    // day:
    // 0
    // hours:
    // 0
    // minutes:
    // 0
    // time:
    // "0000"
    window['moment-range'].extendMoment(window.moment);
    let currentDay = new Date();
    let openTime = new Date();
    let closeTime = new Date();
    let todayHours = undefined;

    // Find the day that corresponds to today
    // Can't just use the index because some days might be closed, so won't exist in the array
    allHours.forEach(day => {
        if ((day.close && day.close.day === currentDay.getDay()) || (day.open && day.open.day === currentDay.getDay()) ) {
            todayHours = day;
        }
    });

    if (todayHours) {
        currentDay.setHours(userTime.hours);
        currentDay.setMinutes(userTime.minutes);
        openTime.setHours(todayHours.open.hours);
        openTime.setMinutes(todayHours.open.minutes);
        closeTime.setHours(todayHours.close.hours);
        closeTime.setMinutes(todayHours.close.minutes);
        const range = window.moment.range(openTime, closeTime);
        return range.contains(currentDay);
    }

    return false;
    
}

let deg2rad = (deg) => {
    return deg * (Math.PI/180);
}