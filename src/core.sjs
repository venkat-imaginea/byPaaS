var debug = require('debug')('kc-bypaas:src:core');
var async = require("async");
var config = require('./config').root; // framework config

var clientPath = './clients/';
// var manifest = require('./places/manifest'); 
// var App = manifest.App; // Client-App config
// var utils = require('./places/utils.sjs');



task init (req, triggerRules) {
  
  var options = req.params;

  var manifest = require(clientPath + options.appId + '/manifest'); 
  var App = manifest.App; // Client-App config
  var Sources = App.sources;
  // var Rules = App.rules;
  // var utils = require('./places/utils.sjs');

  if (!Sources.length) {
    throw new Error("No source list definition");
  }
  
  sourceData <- Sources[0].handler.source(req);

  if (triggerRules) {
    results <- invokeSourceRules(options, sourceData, null);
    return results;
  }

  return sourceData;
}

task triggerSource () {

}

function invokeSourceRules(app, sourceData, options, callback) {
    var triggered = [];
    var rule = null;
    // How was this rule triggered?
    // Can be source or webhook
    var trigger = 'source';

    // Rules is a list of lambda function names
    fetchRulesForSource(app, function(err, rules) {
        if (err) {
            return callback(err);
        }
        var ruleHandlers = rules.set.map(function(d) { // Extracting the handlers of a Rule
        	return d.handler.process
        });
        ruleHandlers.unshift(function(cb) { // Initiating the waterfall with input data
        	cb(null, sourceData);
        });

        if (rules.type === 'waterfall') { // waterfall flow of execution
            debug(ruleHandlers);
        	async.waterfall(ruleHandlers, function(err, result) {
	        	debug('collective waterfall res - ', result);
	        	callback(null, result);
	        });	
        } else { // parallel flow of execution
        	async.parallel(ruleHandlers, function(err, result) {
        		debug('collective parallel res - ', result);
	        	callback(null, result);
        	});
        }
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

task fetchRulesForSource(app) {
  var id = app.appId;
  var type = app.appType;
  var App = require(clientPath + id + '/manifest').App; // Client-App config

  return App.rules[id][type] || [];
}


exports.init = init;
exports.invokeSourceRules = invokeSourceRules;

