var server = new serverConstructor();
var suggestion = new suggestionConstructor()
var animal = 'cat';
// suggestion.getItemInformation();

function suggestionConstructor() {
    this.items = {
        dog : ['food','treats','carrier','toy','collar+leash'],
        cat : ['food,','bowl','litter+box','scratching+post','bedding']
    };

    this.getItemInformation = function () {
        for(var i = 0; i  <  this.items[animal].length; i++) {
            server.checkWalmart(animal, this.items[animal][i]);
        }
    };

    this.findNearestStoreFromShelter = function () {
        server.walmartLocator(33.83529333,-117.914505);
    };
}

function serverConstructor() {
    this.checkWalmart = function (passedAnimal, passedItem) {
        $.ajax({
            "url": "http://api.walmartlabs.com/v1/search?query=" + passedAnimal + "+" + passedItem + " +&format=json&apiKey=5pw9whbkctdk92vckbgewxky",
            "dataType": "jsonp",
            "method": "get",
            "success": function (walmartItemInfo) {
                walmartItemInfo.items.sort(function (a, b) {
                    return parseFloat(a.customerRating) - parseFloat(b.customerRating);
                });
                suggestion.items[animal][suggestion.items[animal].indexOf(passedItem)] = walmartItemInfo.items;
            },
            "error": function () {
                console.log('network timeout');
            }
        });
    };

    this.walmartLocator = function (lat, long) {
        $.ajax({
            "url" : "http://api.walmartlabs.com/v1/stores?format=json&lat="+ lat + "&lon=" + long + "&apiKey=5pw9whbkctdk92vckbgewxky",
            "dataType" : "jsonp",
            "method" : "get",
            "success" : function (walmartLocation) {
                suggestion.stores = walmartLocation;
            }
        });
    }
}