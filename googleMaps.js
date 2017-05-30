/**
 * Begin Google Maps API related code
 */

/**
 * @name initMap - Makes map from the values of the latitude and longitude keys
 * @params {object} obj
 */

function initMap(infoObj) {
    let mapOptions = {
        zoom: 12,
        disableDefaultUI: true,
        scrollwheel:  false,
        disableDoubleClickZoom: true,
        draggable: false,
        center: new google.maps.LatLng(infoObj.latitude, infoObj.longitude)
    };

    let iconImg;
    if(userSelectedAnimal === 'Dog'){
        iconImg = 'images/puppy_icon.png';
    } else {
        iconImg = 'images/kitty_icon.png';
    }

    let map = new google.maps.Map(document.getElementById('map'), mapOptions);

    google.maps.event.addDomListener(window, "resize", function() {
        let center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });

    let infoWindow = new google.maps.InfoWindow({
        content: infoObj.address.name
    });

    let marker = new google.maps.Marker({
        position: map.center,
        map: map,
        icon: iconImg,
        animation: google.maps.Animation.DROP
    });

    marker.addListener('click', function(){
        toggleBounce();
        infoWindow.open(map, marker);
    });

    google.maps.event.addListener(map, "click", function() {
        infoWindow.close();
    });

    function toggleBounce() {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    }

}
/**
 * @name infoForMap - gets latitude and longitude information from the shelterArray. Stores the latitude and longitude of the shelter in a key:value pair
 * @params - none
 * @return coordObj {object}
 */
function infoForMap(){
    let coordObj = {
        address : {
            state : shelterArray[shelterCount].state['$t'],
            city : shelterArray[shelterCount].city['$t'],
            name : shelterArray[shelterCount].name['$t']
        },
        latitude : parseFloat(shelterArray[shelterCount].latitude['$t']),
        longitude : parseFloat(shelterArray[shelterCount].longitude['$t'])
    };
    coordObj.address.text = coordObj.address.city + ', ' + coordObj.address.state;
    return coordObj;
}
/**
 * @name - displayMap - function for displaying the map from the coordinates returned by infoForMap. Calls createMap with parameter of coordinates
 * @params - none
 */
function displayMap(){
    initMap(infoForMap());
}
