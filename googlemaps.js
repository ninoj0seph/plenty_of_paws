// $(document).ready(function(){
//     initMap();
// });
// var map;
// var infowindow;
// var request;
// var service;
// var markers = [];
//
// function initMap(){
//     var center = {lat: 33.682497, lng: -117.781677};
//     map = new google.maps.Map($('#map').get(0), {
//         center: center,
//         zoom: 13
//     });
//     request = {
//         location: center,
//         radius: 8047,
//         types: ['cafe']
//     };
//     marker = new google.maps.Marker({
//         position: center,
//         map: map
//     });
//     infowindow = new google.maps.InfoWindow();
//     service = new google.maps.places.PlacesService(map);
//     service.nearbySearch(request, callback);
// }
// function callback(results, status){
//     if(status == google.maps.places.PlacesServiceStatus.OK){
//         for(var i = 0; i < 5; i++){
//             createMarker(results[i]);
//         }
//     }
// }
// function createMarker(place){
//     var placeLoc = place.geometry.location;
//     var marker = new google.maps.Marker({
//         map: map,
//         position: place.geometry.location
//     });
//     google.maps.event.addListener(marker,'click', function(){
//         infowindow.setContent(place.name);
//         infowindow.open(map, this);
//     })
// }
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
