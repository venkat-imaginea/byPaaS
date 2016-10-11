var debug = require('debug')('kc-places:source:nearbyPlaces');
var config = require('../../../config').root;
var utils = require('../utils.sjs');

var GooglePlaces = require("googleplaces");
var googlePlaces = new GooglePlaces(config.supported_apps.google.places.key, config.supported_apps.google.places.output_format);

// Search for the Places nearby the 'location' provided
task fetchNearbyPlaces (data) {
  catch (e) {
    throw e;
  }
  var searchType = [data.params.appType];
  geoInfo <- utils.geoCode(data.query.nearby);
  var latLong = [geoInfo[0].latitude, geoInfo[0].longitude];
  console.log('GeoCode - ', latLong);

  var parameters = {
    location: latLong,
    types: searchType
  };

  error, response <<- googlePlaces.placeSearch(parameters);
  if (error) {
    console.log(error);
    throw error;
  } 

  return response.results;


};

exports.source = fetchNearbyPlaces;
