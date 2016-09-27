var config = require('./config').root;

var async = require("async");

var GooglePlaces = require("googleplaces");
var googlePlaces = new GooglePlaces(config.google.places.key, config.google.places.output_format);
var utils = require('./places/utils.sjs');

var Sources = {
  'restaurants': require('./places/sources/nearbyPlaces.sjs')
};

var Rules = {
  reviews: [{
    id: 'restaurant_reviews',
    handler: require('./places/rules/restaurant_reviews.sjs'),
    type: 'Event'
  }]
};


// @param sourceId: ID of the source
// @param triggerRules: Boolean to indicate if the rules tied to
//   source have to be triggered
//
// @returns generated source data if triggerRules is false, else
//    array of rules triggered with their status
task sourceTrigger(req, triggerRules) {
  
  var sourceId = req.params.id;
  if (!Sources[sourceId]) {
    throw new Error("Feed source " + sourceId + " unknown");
  }
  
  sourceData <- Sources[sourceId].source(req);

  // console.log('from src output', sourceData);

  if (triggerRules) {
    // results <- invokeSourceRules(sourceId, sourceData, null);
    return results;
  }

  return sourceData;
}


// Search for the Places nearby the 'location' provided
task search (data) {
	catch (e) {
		throw e;
	}
	var searchType = [data.type];
	geoInfo <- utils.geoCode(data.place);
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
	console.log('=======================');
	console.log('Totally Results fetched - ', response.results.length);
	return response.results;

}

// Get Reviews for the given 'restaurant place_id'
task getReviews (data) {
	catch (e) {
		throw e;
	}
	searchRes <- search(data);

	var place_id = searchRes[1].place_id;
	var reference = searchRes[1].reference;
	err, response <<- googlePlaces.placeDetailsRequest({reference: reference});

	if (err) {
		console.log(err);
		throw err;
	}
	// if (response.result.reviews) {
 	//    console.log(JSON.stringify(response.result), ' - Detailed Reviews');
	// }
    return response.result;
}

exports.trigger = sourceTrigger;
// exports.invokeSourceRules = invokeSourceRules;
exports.search = search;
exports.getReviews = getReviews;

