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
		console.log('Search Results - ', response.results);	
		console.log('=======================');
		console.log('Totally Results fetched - ', response.results.length);
		
	});
});


/**
 * Place details requests - https://developers.google.com/maps/documentation/javascript/places#place_search_requests
 */