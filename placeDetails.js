var config = require("./config.js");

var async = require("async");

var GooglePlaces = require("googleplaces");
var googlePlaces = new GooglePlaces(config.apiKey, config.outputFormat);
var latLong = [13.082680, 80.270718],
	searchType = ["restaurant"];
//var placeId = 'ChIJYTN9T-plUjoRM9RjaAunYW4';

/**
 * Place details requests - https://developers.google.com/places/documentation/#PlaceDetails
 */

var parameters = {
  location: latLong,
  types: searchType
};

googlePlaces.placeSearch(parameters, function (error, response) {
	if (error) {
		console.log(error);
		throw error;
	} 
	else {
		// console.log('search res - ', response.results[0]);	
		var place_id = response.results[0].place_id;
		var reference = response.results[0].reference;
		googlePlaces.placeDetailsRequest({reference: reference}, function (err, res) {
			if (err) {
				console.log(err);
				throw err;
			}
		    console.log(res.result.reviews, ' - Detailed Reviews');
		});
	}
	
});