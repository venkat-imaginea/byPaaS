var config = require("./config.js");

var async = require("async");

var GooglePlaces = require("googleplaces");
var googlePlaces = new GooglePlaces(config.apiKey, config.outputFormat);

var geoCode = require('./getBounds.js').geocode;

// var latLong = [13.082680, 80.270718];

var searchType = ["restaurant"];
var place = "Chennai";
//var placeId = 'ChIJYTN9T-plUjoRM9RjaAunYW4';
geoCode(place, function(err, res) {
	if (err) 
		throw err;
	var latLong = [res[0].latitude, res[0].longitude];
	console.log('GeoCode - ', latLong);

	var parameters = {
	  location: latLong,
	  types: searchType
	};

	googlePlaces.placeSearch(parameters, function (error, response) {
		if (error) {
			console.log(error);
			throw error;
		} 
		var place_id = response.results[0].place_id;
		var reference = response.results[0].reference;
		googlePlaces.placeDetailsRequest({reference: reference}, function (err, res) {
			if (err) {
				console.log(err);
				throw err;
			}
		    console.log(JSON.stringify(res.result.reviews), ' - Detailed Reviews');
		});
		
	});
});
