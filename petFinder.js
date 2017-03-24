$(document).ready(function() {
    var petObject = null;
    $('#homeModal').modal('show');
    //$(".animalType").on("click", getRandomPet);
    $(".animalType").on("click",assignAnimalType);
    $(".animalType").on("click",getPets);
    //$("#homeModal").on("click", resetEverything);
    $(".animalType").on("click",newSearch);
    $(".walmart").hide();
});

var newSearch = function () {
    $('#petInfo').empty();
    nextShelterButton.remove();
};
/*
 * assignAnimalType - gets the text of the button pressed to know the animal
 * @params
 */
var userSelectedAnimal = null;
var nextShelterButton = null;
function assignAnimalType() {
    userSelectedAnimal = $(this).text();
}
/*
 * getPets - function for finding a shelter (shelterFinder) and finding pets at that shelter (shelterPets); userSelectedAnimal picks up value
 * @params
 */
function getPets(){
    console.log($(this).text());
    //var userSelectedAnimal = $(this).text();
    shelterFinder();
}
/*
 * createMap - Makes map from the values of the latitude and longitude keys
 * @params {object} obj
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
 * infoForMap - gets latitude and longitude information from the shelterArray. Stores the latitude and longitude of the shelter in a key:value pair
 * @params - none
 * return - coordObj
 */
function infoForMap(){
    var coordObj = {
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
/*
 * displayMap - function for displaying the map from the coordinates returned by infoForMap. Calls createMap with parameter of coordinates
 * @params - none
 */
function displayMap(){
    var coordinates = infoForMap();
    createMap(coordinates);
}
/*
 displayPet - function to append the DOM to display the animal's profile
 @params petObject => response["petfinder"]["pets"]
 */
var petDetails = ["name","age","description"]; // media.photos.photo[i] for images of dog
function displayPet(petObject) {
    if (petObject.length !== 0) {
        var petCarouselDiv = $("<div id='petCarousel' class='carousel slide col-xs-12'>");
        var innerPetCarousel = $("<div class= 'carousel-inner'>");
        var dummyDiv = $("<div class = 'item active'>").text("Click Arrow to Begin!");
        petCarouselDiv.append(innerPetCarousel);
        $(innerPetCarousel).append(dummyDiv);
        $("#petInfo").append(petCarouselDiv);
        for (var i = 0; i < petObject.length; i++) {
            var petProfile= $("<div>").addClass("item petProfile");//.addClass("petProfile col-xs-4");
            var petPictureHolder = $("<div>").addClass("imgContainer");
            var petPicture = $("<img>").addClass("img-fluid");
            if(petObject[i]["media"]["photos"] !== undefined) {
                petPicture.attr("src", petObject[i]["media"]["photos"]["photo"][2]["$t"]).addClass("animalPicture"); // ...["photo"][2]["$t"] seems to be the largest image that won't require splicing out part of the string. For the time being, "good enough" -ADG
                petPictureHolder.append(petPicture);
                petProfile.append(petPictureHolder);
            }

            var petName = $("<div>").text(petObject[i]["name"]["$t"]).addClass('petName');
            var petAge = $("<div>").text(petObject[i]["age"]["$t"]).addClass('petAge');
            var petContact = $("<div>").text(petObject[i]["contact"]["email"]["$t"]).addClass('petContact');
            var shelterName = $('<div>').text(shelterArray[shelterCount]["name"]["$t"]).addClass('shelterName');
            var heartContainer = $("<div>").addClass('heartContainer');
            $(heartContainer).on("click",walmartStuff);
            var imgUrl = 'images/heart_icon.svg';
            var walmartButton = $('<img>',{
                src: imgUrl,
                click: walmartStuff
            });
            heartContainer.append(walmartButton);
            petProfile.append(petName, petAge, petContact, shelterName, heartContainer);
            $(innerPetCarousel).append(petProfile);
        }

    }
    else {
        console.log("This shelter does not have any " + userSelectedAnimal + "s available for adoption");

        $("#petInfo").append($("<div>").text("This shelter does not have any " + userSelectedAnimal + "s available for adoption"));
    }

    nextShelterButton = $('<button>',{
        text: 'Next Shelter',
        class: "btn btn-danger nextButton",
        click: nextShelter
    });
    $('.mainContent').append(nextShelterButton);
}
var walmartStuff = function () {
    $(".walmart").show();
    $(".walmart div").remove();
    suggestion.getItemInformation();
    // suggestion.findNearestStoreFromShelter();
    server.walmartLocator(infoForMap());
};


/*
 * displayRandomPet - function for displaying a random pet from somewhere in the petfinder database
 * @params - petObject
 * return - Nothing
 */
function displayRandomPet(petObject) {
    var petProfile = $("<div>");
    var petPicture = $("<img>");
    var petPictureHolder = $("<div>");
    petPicture.attr("src",petObject["media"]["photos"]["photo"][0]["$t"]).addClass("animalPicture");
    petPictureHolder.append(petPicture);
    petProfile.append(petPictureHolder);
    for (var i = 0; i < petDetails.length; i++) {
        petProfile.append(petObject[petDetails[i]]["$t"]);
    }
    $(".mainContent").append(petProfile);
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

var shelterArray = [];
var petArray = [];
var shelterCount = 0;
/*
 * shelterFinder - function for finding a shelter based on the user submitted location. Also updates the shelter list
 * @params - none
 * dataObject @type
 */
var shelterFinder = function () {
    var dataObject = {
        format: "json",
        key: "579d9f154b80d15e1daee8e8aca5ba7a",
        location: $(".userLocation").val(),
        output: "full",
        count: 5
    };
    var urlString = "http://api.petfinder.com/shelter.find?format=json" + "&" + dataObject["location"] + "&" + dataObject["output"] + "&" + "callback=?";
    $.ajax({
        url: urlString,
        type: 'GET',
        data: dataObject,
        dataType: 'json',
        success: function (result) {
            console.log(result);
            for(var i = 0; i < result.petfinder.shelters.shelter.length; i++) {
                shelterArray.push(result.petfinder.shelters.shelter[i]);
            }
            shelterPets(shelterArray);
            displayMap();
            suggestion.getItemInformation();
            //suggestion.findNearestStoreFromShelter();
        }
    });
};

function getRandomShelterBasedOnAreaCode(shelterArray) {
    var randomShelterID = shelterArray[shelterCount];
    return shelterArray[shelterCount]["id"]["$t"];
}
var shelterPets = function () {
    $.ajax({
        url: 'http://api.petfinder.com/shelter.getPets?key=579d9f154b80d15e1daee8e8aca5ba7a&output=full&format=json&callback=?',
        type: 'GET',
        data: {
            id: getRandomShelterBasedOnAreaCode(shelterArray)
        },
        dataType: 'json',
        success: function (result) {
            console.log("shelterPets", result);
            if(result.petfinder.pets.pet !== undefined) {
                for (var i = 0; i < result.petfinder.pets.pet.length; i++) {
                    if (result.petfinder.pets.pet[i].animal.$t == userSelectedAnimal) {
                        petArray.push(result.petfinder.pets.pet[i]);
                    }
                }
            }
            displayPet(petArray);
        }
    });
};
/*
 * instantiation of serverConstructor
 */
var server = new serverConstructor();
var suggestion = new suggestionConstructor();

function suggestionConstructor() {
    this.items = {
        dog: ['food', 'treats', 'toy', 'collar+leash'],
        cat: ['food,', 'bowl', 'litter+box', 'scratching+post']
    };

    this.getItemInformation = function () {
        for (var i = 0; i < suggestion.items[userSelectedAnimal.toLowerCase()].length; i++) {
            server.checkWalmart(userSelectedAnimal.toLowerCase(), suggestion.items[userSelectedAnimal.toLowerCase()][i]);
        }
    };
}
function serverConstructor() {
    this.checkWalmart = function (passedAnimal, passedItem) {
        $.ajax({
            "url": "http://api.walmartlabs.com/v1/search?query=" + passedAnimal + "+" + passedItem + " +&format=json&apiKey=5pw9whbkctdk92vckbgewxky",
            "dataType": "jsonp",
            "method": "get",
            "success": function (walmartItemInfo) {
                var randomProduct = Math.floor(Math.random() * walmartItemInfo.items.length);
                var keys = ["mediumImage","name", "stock" , "salePrice"];
                keys[0] = "<img src='" + walmartItemInfo.items[randomProduct][keys[0]] + "'>";
                for(var i = 1; i  < keys.length; i++){
                    keys[i] = "<span>" + walmartItemInfo.items[randomProduct][keys[i]] + "</span>";
                }
                $(".walmart").append("<a href=" + walmartItemInfo.items[randomProduct].productUrl + "><div class='thumbnail'>" + keys.join("<br>") + "</div>");
            },
            "error": function () {
                console.log('network timeout');
            }
        });
    };

    this.walmartLocator = function (coordinates) {
        $.ajax({
            "url" : "http://api.walmartlabs.com/v1/stores?format=json&lat="+ coordinates.latitude + "&lon=" + coordinates.longitude + "&apiKey=5pw9whbkctdk92vckbgewxky",
            "dataType" : "jsonp",
            "method" : "get",
            "success" : function (walmartLocation) {
                $(function() {
                    $("#map").googleMap();
                    for(var i = 0; i < 10; i++){
                        $("#map").addMarker({
                            coords: [parseFloat(walmartLocation[i].coordinates[1]), parseFloat(walmartLocation[i].coordinates[0])],
                            title: walmartLocation[i].name,
                            text:  walmartLocation[i].streetAddress + " " + walmartLocation[i].city + " " + walmartLocation[i].stateProvCode + " " + walmartLocation[i].zip
                        });
                    }
                });
            }
        });
    };
}
var resetEverything = function () {
    petArray = [];
    shelterArray = [];
    userSelectedAnimal = null;
    shelterCount = 0;
};
var nextShelter = function () {
    petArray = [];
    nextShelterButton.remove();
    $('#petInfo').empty();
    if (shelterCount < 4){
        shelterCount++;
    }
    else if(shelterCount >= 4){
        shelterCount = 0;
        $("#petInfo").append("No more shelters in your area.");
        resetEverything();
        return;
    }
    displayMap();
    shelterPets();
};