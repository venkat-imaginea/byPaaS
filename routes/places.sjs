var express = require('express');
var router = express.Router();
var misc = require('../src/misc');
var config = require('../src/config').root;
var debug = require('debug')('kc-places:routes:places.sjs');
var Places = require('../src/places.sjs');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/search', misc.route(searchPlaces));
task searchPlaces(req, res) {
	
	results <- Places.search(req.query);
	
	if (results.length) {
		res.json(results);
	}
	else {
		res.json({status: 'failure', msg: 'No restaurants are found nearby!'});
	}
	
}

router.get('/reviews', misc.route(getReviews));
task getReviews(req, res) {
	
	results <- Places.getReviews(req.query);

	if (results.reviews) {
		res.json(results.reviews);	
	}
	else {
		res.json({status: 'failure', msg: 'No reviews for the given restaurant!'});
	}
}

// http://localhost:1234/places/source/restaurants/?nearby=chennai&
router.get('/source/:id', misc.route(trigger_source));
task trigger_source(req, res) {
  var shouldRulesBeApplied = !req.query.norules;
  result <- Places.trigger(req, shouldRulesBeApplied);

  res.json({
    status: 'success',
    result: result
  });
}

module.exports = router;
