$(document).ready(function() {
    var petObject = null;
    $(".animalType").on("click", assignAnimalType);
    $(".animalType").on("click", getPets);
    $(".animalType").on("click", newSearch);
    $(".walmartSuggestion").on("click", () => {
        const walmartAPI = new WalmartSuggestionInformation();
        walmartAPI.getItemInformation();
    });
});

var newSearch = function () {

    $('#petInfo').empty(); // remove the elements from the DOM and destroy click handlers
    shelterArray = []; // Empty the list of stored shelters
    petArray = []; // Empty the list of stored pets from that search
    (nextShelterButton !== null) ? (emptyAnimalDOM()) : (''); // Empty the animal dom only if the nextShelter button is there. If not, do nothing
};

// While there may be a configuration that does not require
// the userSelectedAnimal, nextShelterButton, and previousShelterButton variables to be in the global
// name space,  a global scoping configuration is functional for the purposes of polishing the UI.
var userSelectedAnimal = null;
var nextShelterButton = null;
var previousShelterButton = null;
/**
 * assignAnimalType - gets the text of the button pressed to know the animal* @name assign
 * @params none
 */
function assignAnimalType() {
    userSelectedAnimal = $(this).text();
}
/**
 * getPets - function for finding a shelter (shelterFinder) and finding pets at that shelter (shelterPets); userSelectedAnimal picks up value
 * @params none
 */
function getPets(){
    //var userSelectedAnimal = $(this).text();
    // hide the input form after the user searches for it
    toggleVisibility('animalSearch');
    window.location.hash = '#search'; // set the hash to search so the routing back to the index.html for multiple searches can work will minimal rework
    shelterFinder();
}

/**
 @name displayPet - function to append the DOM to display the animal's profile
 @params petObject => response["petfinder"]["pets"]
 */
function displayPet(petObject) {
    if (petObject.length > 0) {

        for (let i = 0; i < petObject.length; i++) {
            let petCard = $("<div class='card col-lg-4 col-sm-3 col-xs-3'>");
            let cardMedia = $("<div class='cardMedia img-fluid'>");
            let petName = petObject[i]["name"]["$t"];
            let cardTitle = $("<div class='cardTitle'>").text(petName); // Make the petName the cardTitle
            let cardActions = $("<div class='cardActions'>");
            // let likeButton = $("<button class='likeButton'>");
            let likeIcon = $("<i class='material-icons'>").text("favorite").addClass('likeIcon');
            let petAge = petObject[i]["age"]["$t"];
            let petAgeDiv = $("<div class=petAge>").text(petAge); // Pet age. Some have years, some just list a general age, e.g. "Adult"
            let petGender = petObject[i]["sex"]["$t"];
            let petGenderDiv = $("<div class=petAge>").text(petGender); // male/female
            let petDescription = petObject[i]["description"]["$t"];
            let petDescriptionDiv = $("<div class=petDescription>").text(petDescription);
            let petInfoDiv = $("<div class='petInfoExtended'>");
            petInfoDiv.append(petAgeDiv, petGenderDiv, petDescriptionDiv);
            // When the user clicks the like icon, append the extended information onto the card
            cardMedia.on("click", function () {
                petInfoDiv.stop().slideToggle("slow");
            });
            if (petObject[i]["media"]["photos"] !== undefined) {
                // set the background image of the card media div = to the pet's image
                // In the response from the PetFinder API, the index=2 of the media.photos.photo array contains an image of the dog that has a width of 500. The 0 and 1 indices are smaller widths
                $(cardMedia).css("background-image", `url("${petObject[i]["media"]["photos"]["photo"][2]["$t"]}")`);
                // $(petCard).css("background-image", `url("${petObject[i]["media"]["photos"]["photo"][2]["$t"]}")`);
            } else {
                console.log("No photo found"); // TODO pick a default photo in case there is not a photo there
            }
            petCard.append(cardMedia);
            cardMedia.append(cardTitle);
            petCard.append(petInfoDiv); // Append the petInfoDiv to the card with display property of none
            $(".animalCards").append(petCard);
        }
        // Append the shelter information to the animalShelterInformaiton div that sits above the animal cards
        let shelterName = $("<div>").text(shelterArray[shelterCount]["name"]["$t"]).addClass('shelterName col-lg-8 col-lg-offset-2 col-xs-8 col-xs-offset-2');
        let shelterContact = $("<div>").text(petObject[0]["contact"]["email"]["$t"]).addClass('petContact col-lg-8 col-lg-offset-2 col-xs-8 col-xs-offset-2'); // for shelters, the email address is the same, so pick off the email address from the first animal in the array
        $(".animalShelterInformation").append(shelterName, shelterContact);
    } else {
        let noMoreAnimals = `This shelter does not have any ${userSelectedAnimal}s available for adoption`;
        $("#petInfo").append($("<div class='noMoreAnimals'>").text(noMoreAnimals));
    }
    nextShelterButton = $('<button>', {
        text: 'Next Shelter',
        class: "btn btn-danger shelterButton",
        click: nextShelter
    });
    previousShelterButton = $('<button>', {
        text: 'Previous Shelter',
        class: "btn btn-danger shelterButton",
        click: null

    });

    $('#petInfo').append(previousShelterButton, nextShelterButton);
}

var petDetails = ["name","age","description"]; // media.photos.photo[i] for images of dog

/**
 * @name - displayRandomPet - function for displaying a random pet from somewhere in the petfinder database
 * @params - petObject
 * @return none
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
/**
 * @name - getRandomPet - Based on user click get a random dog or cat
 * @note - May need to transition this to shelter.getPet and randomize the results or something like that
 */
function getRandomPet() {
    var dataObject = {
        format: "json",
        key: "1db51d3f16936ba505cf7a0476dd8771",
        animal: $(this).text(),
        output: "basic"
    };
    var urlString = "https://api.petfinder.com/pet.getRandom?format=json" + "&" + dataObject["animal"] + "&" + dataObject["output"] + "&" + "callback=?";
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
/**
 * @name - shelterFinder - function for finding a shelter based on the user submitted location. Also updates the shelter list
 * @params - none
 * dataObject @type
 */
const shelterFinder = function () {
    let userLocation = $(".userLocation").val();
    var dataObject = {
        format: "json",
        key: "579d9f154b80d15e1daee8e8aca5ba7a",
        location: userLocation,
        output: "full",
        count: 5
    };
    // Quick hard coded error handling for empty input fields
    (userLocation.length < 4) ? (dataObject.location = "90210") : (dataObject.locaction = $("userLocation").val());
    let shelterFinderURL = `https://api.petfinder.com/shelter.find?format=json&${dataObject["location"]}&${dataObject["output"]}&callback=?`;
    $.ajax({
        url: shelterFinderURL,
        type: 'GET',
        data: dataObject,
        dataType: 'json',
        success: function (result) {
            // console.log(result);
            for(var i = 0; i < result.petfinder.shelters.shelter.length; i++) {
                shelterArray.push(result.petfinder.shelters.shelter[i]);
            }
            shelterPets(shelterArray);
            displayMap(); // displayMap really creates the map, and the toggleVisibility is really what makes it visible.
            //suggestion.getItemInformation();
            //suggestion.findNearestStoreFromShelter();
        }
    });
};

function getRandomShelterBasedOnAreaCode(shelterArray) {
    var randomShelterID = shelterArray[shelterCount];
    return shelterArray[shelterCount]["id"]["$t"];
}

const shelterPets = function () {
    $.ajax({
        url: 'https://api.petfinder.com/shelter.getPets?key=579d9f154b80d15e1daee8e8aca5ba7a&output=full&format=json&callback=?',
        type: 'GET',
        data: {
            id: getRandomShelterBasedOnAreaCode(shelterArray)
        },
        dataType: 'json',
        success: function (result) {
            // console.log("shelterPets", result);
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

const resetEverything = function () {
    petArray = [];
    shelterArray = [];
    userSelectedAnimal = null;
    shelterCount = 0;
    $('.noMoreShelters').remove();
    $('.userLocation').val(''); // Empty the zip code when you reset everything
    let newSearch = $("<a href='index.html' class='btn'>").text("New Search?");
    $(".animalCards").append(newSearch);
    newSearch.on('click', toggleVisibility('newSearchRequested')); // hide the map, walmart, and animal cards
};

const nextShelter = function () {
    petArray = [];
    nextShelterButton.remove();
    previousShelterButton.remove();
    emptyAnimalDOM(); // Empty the DOM for all information about the animals

    if (shelterCount < 4){
        shelterCount++;
    }
    else if(shelterCount >= 4){
        shelterCount = 0;
        let noMoreShelters = $("<a href='index.html' class='btn' class='noMoreShelters btn btn-outline-primary'>").text("No more shelters in your area. New Search?");
        emptyAnimalDOM();
        $(".animalCards").append(noMoreShelters);
        // $('.noMoreShelters').on('click', resetEverything);
        // return;
    }
    displayMap();
    shelterPets();
};

/**
 * @name emptyAnimalDOM - remove all animal cards, shelter information, and notification text from the DOM
 */
const emptyAnimalDOM = function() {
    $('.animalCards').empty();
    $('.animalShelterInformation').empty();
    $('.noMoreAnimals').remove();
};

/**
 * @name toggleVisibility - hide and show components based on whether or not the user is searching
 * @param context {type | string}
 */

function toggleVisibility(context) {
    let animalSelection = $('.animalSelection'); // the div containing the form for the user to select an animal
    let map = $('#map');
    switch(context) {

        case('animalSearch'):
            animalSelection.css('display','none'); // hide the input form
            map.css('display', 'block'); //
            break;
        case('newSearchRequested'):
            map.css('display','none'); // hide the map
            emptyAnimalDOM(); // Clear out animal DOM
            $('.newSearchButton').remove();
            animalSelection.css('display','block');
            break;
        default:
            console.log("toggle visibility default");

    }
}