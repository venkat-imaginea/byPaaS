
var debug = require('debug')('kc-FC:source:fc');
var config = require('../../../config').root;
var request = require('request');

var fcKey = config.supported_apps.fullcontact.key;

exports.source = function fetchFC (req, callback) {
    var email = req.query.email || "";
	// hit the API to get data
  	getFullContact(email, function(err, data){
      if(err) {
        debug('There was an error in checking full contact data for - ', err.message, err.stack);
        if (err.statusCode && err.ttl) {
          // pushing to DLX webhook retry queue with some ttl to try again later
          
        }
      }
      callback(null, data);
    });
}

function getFullContact(email, cb){
  var fullContactUrl = 'https://api.fullcontact.com/v2/person.json?apiKey=' + fcKey + '&prettyPrint=false&email=';
  var fcUrl = fullContactUrl+encodeURIComponent(email); // 'person' api
  debug('Fetching FullContact data from - ', fcUrl);
  request.get({url: fcUrl, timeout: 4000}, function(err, resp, body){
    if(err){
      debug('Error in FullContact request', err, err.stack);
      cb(err);
      return;
    }
    try{
      if(resp.statusCode === 200){ // 200 - OK Processed
        var fcdoc = {full_contact: JSON.parse(body)};
        cb(null, fcdoc);
      }else if(resp.statusCode === 202){ // 202 - Req is in progress
        debug('Got status code 202 from FullContact for ', email.id);
        // FullContact returned 202 for an email - retry after 2 minutes
        var retryErr = new Error('FullContact is being processed. Needs retry for result.');
        retryErr.statusCode = 202;
        retryErr.ttl = 120000;
        cb(retryErr);
      }else if(resp.statusCode === 403){ // 403 - Ratelimit exceeded
        debug('Got status code 403 from FullContact for ', email.id);
        var limitRemaining = resp.headers['x-rate-limit-remaining'];
        var limitReset = resp.headers['x-rate-limit-reset']; // time to Retry-After
        if (isNaN(limitReset) === false) {
          limitReset = limitReset * 1000;
        } else {
          limitReset = 60000;
        }
        var retryErr = new Error('Rate limit exceeded. Retry after - ' + limitReset);
        retryErr.statusCode = 403;
        retryErr.ttl = limitReset;
        debug('Status 403 from FullContact for ', email.id, '. Rate limit exceeded.. Submitted for retry after - ', limitReset);
        cb(retryErr); // not passing Error obj, as this is not a kind of 'error'
      }else if(resp.statusCode === 404){ // Not found - req was searched in the past 24hrs
        debug('Status 404 from FullContact for ', email.id, '. Info is not provided from fullcontact service');
        var fcdoc = {full_contact: JSON.parse(body)};
        cb(null, fcdoc);
      }else if(resp.statusCode === 503){ // Service temp unavailable.
        debug('Status 503 - FullContact service temporarily unavailable...');
        // FullContact service temporarily unavailable
        var retryAfter = resp.headers['retry-after'] || resp.headers['Retry-After'];
        if(isNaN(retryAfter)){
          // if retry-after header is not set, set it to 1 minute
          retryAfter = 60000;
        } else {
          retryAfter = retryAfter * 1000;
        }
        var retryErr = new Error('Status 503 - FullContact service temporarily unavailable...');
        retryErr.statusCode = 503;
        retryErr.ttl = retryAfter;
        cb(retryErr);
      }else if(resp.statusCode === 422){ // 422 - invalid api key or missing query params
        debug('Invalid email ID - ', email.id);
        var fcdoc = {full_contact: JSON.parse(body)};
        cb(null, fcdoc);
      }else{
        var err = {
          message: 'Error fetching FullContact data for ' + email.id,
          code: resp.statusCode,
          body: body
        };
        cb(new Error(err));
      }  
    }catch(e){
      cb(e);
    }    
  });
}