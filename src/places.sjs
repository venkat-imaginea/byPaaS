var config = require("../config.js");

var async = require("async");

var GooglePlaces = require("googleplaces");
var googlePlaces = new GooglePlaces(config.apiKey, config.outputFormat);
var geoCode = require('../getBounds.js').geocode;

// var latLong = [13.082680, 80.270718];


//var placeId = 'ChIJYTN9T-plUjoRM9RjaAunYW4';

// Search for the Places nearby the 'location' provided
task search (data) {
	catch (e) {
		throw e;
	}
	var searchType = [data.type];
	geoInfo <- geoCode(data.place);
	var latLong = [geoInfo[0].latitude, geoInfo[0].longitude];
	console.log('GeoCode - ', latLong);

	var parameters = {
	  location: latLong,
	  types: searchType
	};

	error, response <<- googlePlaces.placeSearch(parameters);
	if (error) {
		console.log(error);
		throw error;
	} 
	// console.log('Search Results - ', response.results);	
	console.log('=======================');
	console.log('Totally Results fetched - ', response.results.length);
	return response.results;

}

exports.search = search;

