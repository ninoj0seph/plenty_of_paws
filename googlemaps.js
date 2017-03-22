
$(document).ready(function(){
    createMap();
});
function createMap(){
    $("#map").googleMap();
    $("#map").addMarker({
        address: '15 avenue des champs Elysées 75008 Paris',
        //zoom: 13, // Initial zoom level (optional)
        //coords: [48.895651, 2.290569], // Map center (optional)
        //type: "ROADMAP" // Map type (optional)
        title: 'Marker 1',
        text: '15 avenue des champs Elysées 75008 Paris'
    });
}
//request = {
//         location: center,
//         radius: 8047,
//         types: ['cafe']
//     };
