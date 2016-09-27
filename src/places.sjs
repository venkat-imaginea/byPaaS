var debug = require('debug')('kc-places:places.src');
var config = require('./config').root;

var async = require("async");

var GooglePlaces = require("googleplaces");
var googlePlaces = new GooglePlaces(config.google.places.key, config.google.places.output_format);
var utils = require('./places/utils.sjs');

var Sources = {
  'restaurants': require('./places/sources/nearbyPlaces.sjs')
};

var Rules = {
  restaurants: [{
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
    results <- invokeSourceRules(sourceId, sourceData, null);
    return results;
  }

  return sourceData;
}


// @param sourceId: ID of the source
// @param sourceData: The input data
// @param options: Options, or data returned from the
//   previous dependencies when invoking through async.auto
//
// @returns array of objects with rule id, status and message
function invokeSourceRules(sourceId, sourceData, options, callback) {
    var triggered = [];
    var rule = null;
    // How was this rule triggered?
    // Can be source or webhook
    var trigger = this.trigger || 'source';

    // Rules is a list of lambda function names
    fetchRulesForSource(sourceId, function(err, rules) {
        if (err) {
            return callback(err);
        }
        async.map(rules, async.reflect(async.apply(invokeRule, trigger, sourceData)), function(err, results) {
            debug("invokeSourceRules result: " + JSON.stringify(results));
            results = results.map(function(r, i) {
                try {
                    var message = r.value ? (r.value.error ? r.value.error : r.value) : r.error;
                    if (message.Payload) {
                        message.Payload = JSON.parse(message.Payload);
                    }
                } catch (ex) {}

                return {
                    id: rules[i].id,
                    status: r.value && !r.value.error ? 'success' : 'error',
                    message: message
                }
            });

            callback(null, results);
        });
    });

    task invokeRule(trigger, sourceData, rule) {
        var handler = null;

        catch (e) {
            debug("invokeRule_error: " + (e.message || e.toString()));
            return {
                error: e.message || e.toString()
            };
        }

        switch (trigger) {
            case 'webhook':
                {
                    if (rule.handler && typeof rule.handler.webhookTransform === 'function') {
                        sourceData <- rule.handler.webhookTransform(sourceData);
                        debug("Transformed source: " + JSON.stringify(sourceData));
                    }
                }

            case 'source':
                {
                    if (rule.handler && typeof rule.handler.process === 'function') {
                        handler = async.apply(rule.handler.process);
                    }
                }
        }

        if (!handler) {
            console.log('No Handler...');
            // handler = async.apply(utils.invokeLambda, rule.id, rule.type);
        }

        debug("Invoking rule: " + rule.id + " of type: " + rule.type);
        result <- handler(sourceData);
        return result;
    }
}

task fetchRulesForSource(sourceId) {
  return Rules[sourceId];
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
exports.invokeSourceRules = invokeSourceRules;
exports.search = search;
exports.getReviews = getReviews;

