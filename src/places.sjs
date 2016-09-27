var config = require('./config').root;

var async = require("async");

var GooglePlaces = require("googleplaces");
var googlePlaces = new GooglePlaces(config.google.places.key, config.google.places.output_format);
var geoCode = require('./getBounds.sjs').geocode;

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

// Get Reviews for the given 'restaurant place_id'
task getReviews (data) {
	catch (e) {
		throw e;
	}
	searchRes <- search(data);

	var place_id = searchRes[1].place_id;
	var reference = searchRes[1].reference;
	err, response <<- googlePlaces.placeDetailsRequest({reference: reference});

	if (err) {
		console.log(err);
		throw err;
	}
	// if (response.result.reviews) {
 	//    console.log(JSON.stringify(response.result), ' - Detailed Reviews');
	// }
    return response.result;
}

exports.search = search;
exports.getReviews = getReviews;

