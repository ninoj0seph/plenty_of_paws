
$(document).ready(function(){
    createMap();
});
function createMap(){
    $("#map").googleMap({
        zoom: 14
        //zoom: 13, // Initial zoom level (optional)
        //coords: [48.895651, 2.290569], // Map center (optional)
    });
    $("#map").addMarker({
        address: '15 avenue des champs Elysées 75008 Paris',
        title: 'Marker 1',
        text: '15 avenue des champs Elysées 75008 Paris'
    });
}

