var debug = require('debug')('kc-places:rule:Details');
var config = require('../../../config').root;
var utils = require('../utils');
var async = require("async");

var GooglePlaces = require("googleplaces");
var googlePlaces = new GooglePlaces(config.supported_apps.google.places.key, config.supported_apps.google.places.output_format);

// Get Reviews for the given 'restaurant place_id'
task getDetails (data, cb) {
	catch (e) {
		throw e;
	}
	if (!Array.isArray(data)) {
		debug('Received input is not an array');
		return false;
	}

	err, netRes <<- async.mapLimit(data, 3, fetchForOneRecord);
	if (err) {
		console.log(err);
		throw err;
	}
	cb(null, netRes);
}

// Single Fetch operation
function fetchForOneRecord (item, done) {
	var place_id = item.place_id;
	var reference = item.reference;
	googlePlaces.placeDetailsRequest({reference: reference}, function(err, res) {
		if (err)
			done(err);
		done(null, res.result);
	});	
}

// Filters records with only Reviews
function thoseWithReviews (item) {
	return item.reviews
}
exports.process = getDetails;