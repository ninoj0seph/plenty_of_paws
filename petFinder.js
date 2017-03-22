// Javascript file for petfinder api stuff
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
            for(var i = 0; i < result.petfinder.shelters.shelter.length; i++) {
                shelterArray.push(result.petfinder.shelters.shelter[i])
            }
        }
    });
};