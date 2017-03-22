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
    var shelterFinder = function () {
        $.ajax({
            url: 'http://api.petfinder.com/shelter.find?key=579d9f154b80d15e1daee8e8aca5ba7a&output=full&format=json&callback=?',
            type: 'GET',
            data: {
                location: 92705
            },
            dataType: 'json',
            success: function (result) {
                console.log(result);
                for (var i = 0; i < result.petfinder.shelters.shelter.length; i++) {
                    shelterArray.push(result.petfinder.shelters.shelter[i])
                }
            }
        });
    };
});
