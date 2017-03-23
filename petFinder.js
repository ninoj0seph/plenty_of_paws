// Javascript file for petfinder api stuff
//var animalType = $(".animalType").text();
//console.log(".animalType").text();

// $.getJSON('http://api.petfinder.com/my.method?format=json&key=12345&callback=?')
//     .done(function(petApiData) { alert('Data retrieved!'; })
//     .error(function(err) { alert('Error retrieving data!');
//     });
// var petDetails = ["age","animal","media" ]
// function displayPet() {
//     for (var i = 0; i <)
//
// }
$(document).ready(function() {
    var petObject = null;
    shelterFinder();
  $('.btn-danger').click(shelterSelector);
});
/*
displayPet - function to append the DOM to display the animal's profile
@params response["petfinder"]["pets"]
 */
    var petDetails = ["name","age","description"]; // media.photos.photo[i] for images of dog
    function displayPet(petObject) {
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

    $(".animalType").on("click", getRandomPet);
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
                displayPet(petObject);
            },
            error: function (response) {
                console.log(response);
            }
        });
    }

//http://api.petfinder.com/pet.getRandom?key=1db51d3f16936ba505cf7a0476dd8771&animal=dog&output=basic

var shelterArray = [];
var petArray = [];
var shelterId = null;
var shelterNumber = null;
var shelterFinder = function () {
    $.ajax({
        url: 'http://api.petfinder.com/shelter.find?key=579d9f154b80d15e1daee8e8aca5ba7a&output=full&format=json&callback=?',
        type: 'GET',
        data: {
            location: 92705,
            count: 5
        },
        dataType: 'json',
        success: function (result) {
            console.log(result);
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
            id: shelterArray[shelterId].id.$t
        },
        dataType: 'json',
        success: function (result) {
            console.log(result);
            for(var i = 0; i < result.petfinder.pets.pet.length; i++) {
                petArray.push(result.petfinder.pets.pet[i])
            }
            for(var j = 0; j < petArray.length; j++){
                $('.table tbody').append(petArray[j].name.$t);
            }
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
var petListDisplay = function () {
    for(var j = 0; j < petArray.length; j++){
        $('.table tbody').append(petArray[j].name.$t);
    }
};
