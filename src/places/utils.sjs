
var config = require('../config').root;
var debug = require('debug')('kc-places:utils');

var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
 
  // Optional depending on the providers 
  httpAdapter: 'https', // Default 
  apiKey: config.google.places.key, // for Mapquest, OpenCage, Google Premier 
  formatter: config.google.places.output_format // 'gpx', 'string', ... 
};
 
var geocoder = NodeGeocoder(options);
 
// Finds GeoCode for the given location
task geoCode (place) {
  err, res <<- geocoder.geocode(place);
  if (err)
    throw err;
  return res;
};

exports.geoCode = geoCode;
