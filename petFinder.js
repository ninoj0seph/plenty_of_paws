
$(document).ready(function() {
    var petObject = null;
    $('.btn-danger').click(shelterSelector);
    $(".animalType").on("click", getRandomPet);
    $(".userLocationSubmit").on("click",getPets);
    $('.btn-danger').click(shelterSelector);
});
function getPets(){
    shelterFinder();
    shelterPets();
}
/*
* createMap - Makes map
* @params obj that contains stuff
 */
function createMap(obj){
    $("#map").googleMap({
        zoom: 14,
        coords: [obj.latitude,obj.longitude] // Map center (optional)
    });
    $("#map").addMarker({
        coords: [obj.latitude,obj.longitude],
        title: obj.address.name,
        text: obj.address.text
    });
}
/*
* infoForMap - gets latitude and longitude information
 */
function infoForMap(){
    var index = 0;
    var coordObj = {};
    coordObj.address = {};
    coordObj.latitude = parseFloat(shelterArray[index].latitude['$t']);
    coordObj.longitude = parseFloat(shelterArray[index].longitude['$t']);
    coordObj.address.name = shelterArray[index].name['$t'];
    coordObj.address.city = shelterArray[index].city['$t'];
    coordObj.address.state = shelterArray[index].state['$t'];
    coordObj.address.text = coordObj.address.city + ', ' + coordObj.address.state;
    return coordObj;
}

function displayMap(){
    var coordinates = infoForMap();
    createMap(coordinates);
}
/*
displayPet - function to append the DOM to display the animal's profile
@params response["petfinder"]["pets"]
 */
    var petDetails = ["name","age","description"]; // media.photos.photo[i] for images of dog
    function displayPet(petObject) {
        var petProfile = $("<div>");
        var petPicture = $("<img>");


        for (var i = 0; i < petDetails.length; i++) {
            //console.log(petObject[petDetails[i]]["$t"]);
            petPicture.attr("src",petObject[i]["media"]["photos"]["photo"][0]["$t"]).addClass("animalPicture");
            petProfile.append(petObject[i][petDetails[i]]["$t"]);
            petProfile.append(petPicture);
        }
        $("body").append(petProfile);
    }
function displayRandomPet(petObject) {
    var petProfile = $("<div>");
    var petPicture = $("<img>");
    petPicture.attr("src",petObject["media"]["photos"]["photo"][0]["$t"]).addClass("animalPicture");
    petProfile.append(petPicture);
    for (var i = 0; i < petDetails.length; i++) {
        //console.log(petObject[petDetails[i]]["$t"]);
        petProfile.append(petObject[petDetails[i]]["$t"]);
    }
    $("body").append(petProfile);
}


    /*
    * getRandomPet - Based on user click get a random dog or cat
    * May need to transition this to shelter.getPet and randomize the results or something like that
     */
    function getRandomPet() {
        console.log($(this)); //$(this) = button.animalType
        var dataObject = {
            format: "json",
            key: "1db51d3f16936ba505cf7a0476dd8771",
            animal: $(this).text(),
            output: "basic"
        };
        var urlString = "http://api.petfinder.com/pet.getRandom?format=json" + "&" + dataObject["animal"] + "&" + dataObject["output"] + "&" + "callback=?";
        $.ajax({
            data: dataObject,
            dataType: "JSON",
            method: "GET",
            url: urlString, //"http://api.petfinder.com/pet.getRandom", // petFinder.php",
            success: function (response) {
                console.log("Random pet", response["petfinder"]["pet"]);
                petObject = response["petfinder"]["pet"];
                displayRandomPet(petObject);
            },
            error: function (response) {
                console.log(response);
            }
        });
    }

//http://api.petfinder.com/pet.getRandom?key=1db51d3f16936ba505cf7a0476dd8771&animal=dog&output=basic

/* shelter coordinates
@params shelters found in shelter finder
 */

// function getShelterCoordinates(shelterObj) {
//     for (var i = 0; i < shelterArray.length; i++)
// }

var shelterArray = [];
var petArray = [];
var shelterObj = null;
var userShelter = null;
var shelterId = null;
var shelterNumber = null;
var shelterFinder = function () {
    var dataObject = {
        format: "json",
        key: "579d9f154b80d15e1daee8e8aca5ba7a",
        location: $(".userLocation").val(),
        output: "full"
    };
    var urlString = "http://api.petfinder.com/shelter.find?format=json" + "&" + dataObject["location"] + "&" + dataObject["output"] + "&" + "callback=?";
    $.ajax({
        url: urlString,
        type: 'GET',
        data: dataObject,
        dataType: 'json',
        success: function (result) {
            console.log(result);
            //shelterObj = result["petfinder"]["shelters"]
            for(var i = 0; i < result.petfinder.shelters.shelter.length; i++) {
                shelterArray.push(result.petfinder.shelters.shelter[i])
            }
            updateShelterList()
        }
    });
};
var shelterPets = function () {
    $.ajax({
        url: 'http://api.petfinder.com/shelter.getPets?key=579d9f154b80d15e1daee8e8aca5ba7a&output=full&format=json&callback=?',
        type: 'GET',
        data: {
            id: "CA1506" //shelterArray[shelterId].id.$t
        },
        dataType: 'json',
        success: function (result) {
            console.log("shelterPets",result);
            for(var i = 0; i < result.petfinder.pets.pet.length; i++) {
                petArray.push(result.petfinder.pets.pet[i])
            }
            for(var j = 0; j < petArray.length; j++){
                $('.table tbody').append(petArray[j].name.$t);
            }
            displayPet(result.petfinder.pets.pet);
            return petArray;
        }
    });
};
var updateShelterList = function () {
    for(var i = 0; i < shelterArray.length; i++){
        shelterNumber = i;
        $('.shelter-list-container > .list-body').append(shelterChooser(shelterArray[i]));
    }
};
var shelterChooser = function (shelter) {

    var row = $('<tr>', {
        class: 'list-row'
    });
    var shelterName = $('<td>',{
        text: shelterArray[shelterNumber].name.$t
    });
    var selectRow = $('<td>');
    var selectButton = $('<button>',{
        text: 'select',
        class: "btn btn-danger btn-sm",
        click: shelterSelector
    });
    $(selectRow).append(selectButton);
    $(row).append(shelterName, selectRow);
    $('.table tbody').append(row)
};
var shelterSelector = function () {
    shelterId = event.target.parentElement.parentElement.rowIndex-1;
    shelterPets();
    $('.table tbody').empty();
};

