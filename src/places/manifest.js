// Configs for Places
var config = require('../config').root; // framework config
var GooglePlaces = require("googleplaces");

exports.googlePlaces = new GooglePlaces(config.google.places.key, config.google.places.output_format);

exports.Sources = {
  places: require('./sources/nearbyPlaces.sjs')
};

exports.Rules = {
  places: {
  	restaurants: [{
	    id: 'details',
	    handler: require('./rules/details.sjs'),
	    type: 'Event'
	  },
	  {
	    id: 'filter',
	    handler: require('./rules/filter.sjs'),
	    type: 'Event'
	  },
	  {
	    id: 'pick',
	    handler: require('./rules/pick.sjs'),
	    type: 'Event'
	}]	
  }
};