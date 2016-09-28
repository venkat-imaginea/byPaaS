var debug = require('debug')('kc-places:places.src');
var config = require('./config').root; // framework config
var manifest = require('./places/manifest'); // api config

var async = require("async");

// var GooglePlaces = require("googleplaces");
// var googlePlaces = new GooglePlaces(config.google.places.key, config.google.places.output_format);
var utils = require('./places/utils.sjs');

var Sources = manifest.Sources;
var Rules = manifest.Rules;


task sourceTrigger(req, triggerRules) {
  
  var placeType = req.params.type;
  if (!Sources['places']) {
    throw new Error("Place source " + placeType + " unknown");
  }

  sourceData <- Sources['places'].source(req);

  // console.log('from src output', sourceData);

  if (triggerRules) {
    results <- invokeSourceRules(placeType, sourceData, null);
    return results;
  }

  return sourceData;
}


function invokeSourceRules(sourceId, sourceData, options, callback) {
    var triggered = [];
    var rule = null;
    // How was this rule triggered?
    // Can be source or webhook
    var trigger = 'source';

    // Rules is a list of lambda function names
    fetchRulesForSource(sourceId, function(err, rules) {
        if (err) {
            return callback(err);
        }
        var ruleHandlers = rules.map(function(d) { // Extracting the handlers of a Rule
        	return d.handler.process
        });
        ruleHandlers.unshift(function(cb) { // Initiating the waterfall with input data
        	cb(null, sourceData);
        });
        async.waterfall(ruleHandlers, function(err, results) {
        	debug('collective res - ', results);
        	callback(null, results);
        });
        // async.map(rules, async.reflect(async.apply(invokeRule, trigger, sourceData)), function(err, results) {
        //     // debug("invokeSourceRules result: " + JSON.stringify(results));
        //     results = results.map(function(r, i) {
        //         try {
        //             var message = r.value ? (r.value.error ? r.value.error : r.value) : r.error;
        //             if (message.Payload) {
        //                 message.Payload = JSON.parse(message.Payload);
        //             }
        //         } catch (ex) {}

        //         return {
        //             id: rules[i].id,
        //             status: r.value && !r.value.error ? 'success' : 'error',
        //             message: message
        //         }
        //     });

        //     callback(null, results);
        // });
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

        debug(result.length, ' - net output length of rule - ', rule.id);
        
        return result;
    }
}

task fetchRulesForSource(sourceId) {
  return Rules['places'][sourceId] || [];
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

	error, response <<- manifest.googlePlaces.placeSearch(parameters);
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
	err, response <<- manifest.googlePlaces.placeDetailsRequest({reference: reference});

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

