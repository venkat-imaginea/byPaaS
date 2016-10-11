var express = require('express');
var router = express.Router();
var misc = require('../src/misc');
var config = require('../src/config').root;
var debug = require('debug')('kc-bypaas:routes:core');
var Core = require('../src/core.sjs');



// /bypaas /['appId']/['appType']?nearby=chennai&applyrules=true

// e.g.
// http://localhost:1234/bypaas /places/restaurant?nearby=chennai
// http://localhost:1234/bypaas /fullcontact/person?email=venkat.crescentian@gmail.com     
router.get('/:appId/:appType', misc.route(trigger_source));
task trigger_source(req, res) {
  debug(req.params, 'req.params');
  debug(req.query, 'req.query');

  // var Core = require('../src/core.sjs');
  
  var shouldRulesBeApplied = req.query.applyrules === 'true' ? true : false;
  result <- Core.init(req, shouldRulesBeApplied);

  res.json({
    status: 'success',
    result: result
  });
}

module.exports = router;
