var debug = require('debug')('kc-places:rule:restaurant-reviews');
var config = require('../../config').root;
var utils = require('../utils');
var async = require("async");

var GooglePlaces = require("googleplaces");
var googlePlaces = new GooglePlaces(config.google.places.key, config.google.places.output_format);

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
exports.invokeRule = getReviews;