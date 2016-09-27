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

	// async.mapLimit(data, 2, fetchDetails, function(err, netRes) {
	// 	if (err) {
	// 		console.log(err);
	// 		throw err;
	// 	}
	// 	debug(netRes, ' - netRes');
	// 	return netRes;
	// });
	err, netRes <<- async.mapLimit(data, 3, fetchDetails);
	if (err) {
		console.log(err);
		throw err;
	}
	// debug(netRes, ' - netRes');
	return netRes;
}

function fetchDetails (item, done) {
	var place_id = item.place_id;
	var reference = item.reference;
	googlePlaces.placeDetailsRequest({reference: reference}, function(err, res) {
		if (err)
			done(err);
		done(null, res.result);
	});	
}
exports.process = getReviews;