var express = require('express');
var router = express.Router();
var misc = require('../src/misc');
var places = require('../src/places.sjs');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/search', misc.route(searchPlaces));
task searchPlaces(req, res) {
	
	results <- places.search(req.query);

	res.json(results);
}

router.get('/reviews', misc.route(getReviews));
task getReviews(req, res) {
	
	results <- places.getReviews(req.query);

	if (results.reviews) {
		res.json(results.reviews);	
	}
	else {
		res.json({status: 'failure', msg: 'No reviews for the given restaurant!'});
	}
}

module.exports = router;
