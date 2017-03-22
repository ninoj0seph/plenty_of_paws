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
$(document).ready(function () {
    $('.btn-danger').click(shelterSelector);
});

function getRandomPet() {
    var dataObject = {
        format: "json",
        key: "1db51d3f16936ba505cf7a0476dd8771",
        animal: "dog",
        output: "basic"
        //callback: "\?"
    };
    var urlString = "http://api.petfinder.com/pet.getRandom?format=json" + "&" + dataObject["animal"] + "&" + dataObject["output"] + "&" + "callback=?";
        $.ajax({
            data: dataObject,
            dataType: "JSON",
            method: "GET",
            url: urlString, //"http://api.petfinder.com/pet.getRandom", // petFinder.php",
            success: function(response) {
                console.log(response["petfinder"]["pet"]);
            },
            error: function(response) {
                console.log(response);
            }
        });
}
//http://api.petfinder.com/pet.getRandom?key=1db51d3f16936ba505cf7a0476dd8771&animal=dog&output=basic

var shelterArray = [];
var petArray = [];
var userShelter = null;
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
        }
    });
};
var shelterPets = function () {
    $.ajax({
        url: 'http://api.petfinder.com/shelter.getPets?key=579d9f154b80d15e1daee8e8aca5ba7a&output=full&format=json&callback=?',
        type: 'GET',
        data: {
            id: shelterArray[userShelter].id.$t
        },
        dataType: 'json',
        success: function (result) {
            console.log(result);
            for(var i = 0; i < result.petfinder.pets.pet.length; i++) {
                petArray.push(result.petfinder.pets.pet[i])
            }
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
    userShelter = shelter;

    var row = $('<tr>', {
        class: 'list-row'
    });
    var shelterName = $('<td>',{
        text: shelterArray[shelterNumber].name.$t
    });
    var selectRow = $('<td>');
    var selectButton = $('<button>',{
        text: 'select',
        class: "btn btn-danger btn-sm"
    });
    $(selectRow).append(selectButton);
    $(row).append(shelterName, selectRow);
    $('.table tbody').append(row)
};
var shelterSelector = function () {
    $('.table tbody').empty();
};