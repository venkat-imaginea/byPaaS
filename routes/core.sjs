var express = require('express');
var router = express.Router();
var misc = require('../src/misc');
var config = require('../src/config').root;
var debug = require('debug')('kc-bypaas:routes:core');
var Core = require('../src/core.sjs');



// /bypaas /['appId']/['appParam']?nearby=chennai&applyrules=true
// e.g. http://localhost:1234/bypaas /places/hospital?nearby=hyderabad
router.get('/:appId/:appType', misc.route(trigger_source));
task trigger_source(req, res) {
  var shouldRulesBeApplied = req.query.applyrules || false;
  result <- Core.trigger(req, shouldRulesBeApplied);

  res.json({
    status: 'success',
    result: result
  });
}

module.exports = router;
