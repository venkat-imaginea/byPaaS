var debug = require('debug')('kc-places:rule:Pick');
var config = require('../../config').root;


// Get Only reviews for the given set of place docs
task pickOnlyReviews (data, cb) {
	catch (e) {
		throw e;
	}
	if (!Array.isArray(data)) {
		debug('Received input is not an array');
		return false;
	}

	var reviews = data.map(pick);
	// return reviews;
	cb(null, reviews);
}

// Filter records that has Reviews
function pick (item) {
	return item.reviews
}
exports.process = pickOnlyReviews;