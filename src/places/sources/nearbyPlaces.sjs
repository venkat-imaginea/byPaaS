var debug = require('debug')('kc-places:source:nearbyPlaces');
var config = require('../../config').root;
var utils = require('../utils.sjs');

var GooglePlaces = require("googleplaces");
var googlePlaces = new GooglePlaces(config.google.places.key, config.google.places.output_format);

// Search for the Places nearby the 'location' provided
task fetchNearbyPlaces (data) {
  catch (e) {
    throw e;
  }
  var searchType = [data.params.type];
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
  // console.log('Search Results - ', response.results);  
  // console.log('=======================');
  // console.log('Totally Results fetched - ', response.results.length);

  return response.results;


};

exports.source = fetchNearbyPlaces;
