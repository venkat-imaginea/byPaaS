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
	if (!Array.isArray(data)) {
		debug('Output of Source is not an array');
		return false;
	}

	err, netRes <<- async.mapLimit(data, 3, fetchDetails);
	if (err) {
		console.log(err);
		throw err;
	}

	var reviews = netRes.filter(onlyReviews);
	// debug(netRes, ' - netRes');
	return reviews;
}

// Single Fetch operation
function fetchDetails (item, done) {
	var place_id = item.place_id;
	var reference = item.reference;
	googlePlaces.placeDetailsRequest({reference: reference}, function(err, res) {
		if (err)
			done(err);
		done(null, res.result);
	});	
}

// Filters records with only Reviews
function onlyReviews (item) {
	return item.reviews
}
exports.process = getReviews;