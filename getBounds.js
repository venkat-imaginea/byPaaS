
var config = require("./config.js");
var async = require("async");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
 
  // Optional depending on the providers 
  httpAdapter: 'https', // Default 
  apiKey: config.apiKey, // for Mapquest, OpenCage, Google Premier 
  formatter: 'json'         // 'gpx', 'string', ... 
};
 
var geocoder = NodeGeocoder(options);
 
// Using callback 
exports.geocode = function (place, done) {
	geocoder.geocode(place, function(err, res) {
	  done(err, res);
	  // console.log('GeoCode - ', res);
	});
};