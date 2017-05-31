/**
 * Begin Walmart API related code
 *
 * instantiation of serverConstructor
 */

/**
 * @name - WalmartSuggestionInformation
 * @constructor
 * @name - getItemInformation - Sends netwrok request for animal items
 */

function WalmartSuggestionInformation() {
    // We decided on a fixed number of items to be queried for each animal delivered consistent results
    // user input requires validation, normalization, and sanitization
    this.BASE_WALMART_QUERY_URL = `https://api.walmartlabs.com/v1/search?apiKey=${walmartApiKey}&query=`;

    // Use an array of objects for the product URLs related to the animal
    this.catQueries = [
        `${this.BASE_WALMART_QUERY_URL}cat%20scratcher`, // catScratcherQuery
        `${this.BASE_WALMART_QUERY_URL}cat%20food`, //catFoodQuery
        `${this.BASE_WALMART_QUERY_URL}cat%20food%20bowl`, //catDishQuery
        `${this.BASE_WALMART_QUERY_URL}cat%20litter%20box` // catLitterBox
        ];
    this.dogQueries = [
        `${this.BASE_WALMART_QUERY_URL}dog%20food`, // dogFoodQuery
        `${this.BASE_WALMART_QUERY_URL}dog%20treats`, // dogTreatQuery:
        `${this.BASE_WALMART_QUERY_URL}dog%20toy`, // dogToyQuery:
        `${this.BASE_WALMART_QUERY_URL}dog%20collar%20and%20leash` // dogCollarAndLeashQuery
        ];

    this.getItemInformation = function () {
        // userSelectedAnimal available from global scope
        // *.toLowerCase() to match the required format of the walmart api
        //this.selectedAnimal = userSelectedAnimal.toLowerCase();
        // TODO ponder the implementation of a ternary to replace the *.toLowerCase() in the name of an unquantified reduction in execution time
        userSelectedAnimal ? this.selectedAnimal = userSelectedAnimal.toLowerCase() : '';
        let walmartRequestURL = null;

        switch(this.selectedAnimal) {
            case('cat'):
                walmartRequestURL = this.catQueries;
                break;
            case('dog'):
                walmartRequestURL = this.dogQueries;
                break;
            default:
                // something has gone wrong if the pre defined values cannot match either of the two cases
                return; // do nothing
        }
        // since there are only three
        for (let i = 0; i < 3; i++) {
            // this.checkWalmart(this.selectedAnimal, suggestion.items[selectedAnimal][i]);
            this.checkWalmart(walmartRequestURL[i]); // send a request to the API for each item
        }
    };


    // There are only 4, so a hard coded constant is preferable to calculating .length on every iteration's conditional
    // (I am assuming there is not an optimization in place for some type of pseudo cache of the array length)
    this.checkWalmart = function(animalProdudctQuery) {
        let _manipulateDOMWithWalmartSuggestions =  this.manipulateDOMWithWalmartSuggestions.bind(this);
        $.ajax({
            url: animalProdudctQuery,
            dataType: "jsonp",
            method: "get",
            success: function (walmartItemInfo) {
                let randomProduct = Math.floor(Math.random() * walmartItemInfo.items.length); // The success response (walmartItemInfo) contains an array of relevant products, so "randomProduct" is just a random one of the relevant items
                let {mediumImage, name, stock, salePrice, productUrl} =  walmartItemInfo.items[randomProduct]; // pull off the mediumImage, name, stock, and salesPrice
                let productDiv = $("<div class='walmart-item col-sm-4 col-sm-offset-0 col-xs-10 col-xs-offset-1'>"); // div to hold the product image, name, availability, etc.
                let productImage  = $("<img class='img-responsive col-xs-10 col-xs-offset-1'>").attr("src", mediumImage); // the mediumImage attribute of the response object contains the href string for the image
                let productName = $("<a target='_blank'>").attr('href', `${productUrl}`).append($('<p>').text(name).addClass('col-xs-10 col-xs-offset-1'));
                productDiv.append(productImage, productName); // append the product image followed by the product name to the product div
                $('.walmartProducts').append(productDiv);

            },
            error: function () {
                console.log('network timeout');
            }
        });
    };

    this.manipulateDOMWithWalmartSuggestions = function () {

    }
}


// const walmartSuggestions = new walmartSuggestionInformation(); // make a new instance of walmart suggestions
// const suggestion = walmartSuggestions.suggestionConstructor(); // invoke the suggestionConstructor
// const walmartItems = new walmartAPICall(); // new instance of walmart API call


function taxonomyTest() {
    $.ajax({
        method: "GET",
        dataType: 'jsonp',
        url: 'http://api.walmartlabs.com/v1/taxonomy?apiKey=5pw9whbkctdk92vckbgewxky',
        success: function(response) {
            console.log('success response', response);
        },
        error: function(errorResponse) {
            console.log("error response", errorResponse);
        }
    });
}
