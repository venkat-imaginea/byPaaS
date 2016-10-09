// Configs for Places
var config = require('../../config').root; // framework config
var GooglePlaces = require("googleplaces");

exports.googlePlaces = new GooglePlaces(config.supported_apps.google.places.key, config.supported_apps.google.places.output_format);


// Client-App config
exports.App = {
	bizid: "user1",
	sources: [{
		id: 'places',
		service: { // specifying one of the framework subscribed services
 			id: 'google', 
 			type: 'places',
 			userContext: { // if user-context level, else framework config can be used (optional)
 				credentials: { 
					key: "AIzaSyBuAACZdJOJqcpzVtLicGCqgaVzT9d9HvE",
					output_format: "json"
				},
				ratelimit: {
					max: 300,
					duration: 60000
				}
 			}
		},
		fetch: {
			input: {

			},
			mode: "poll", // poll/push
			frequency: 3000, // 3s
			page: 2, // paging
 			skip: 100, // skipping off initial 99 records
 			backfill: true // boolean to decide backfill the fetch or not
		},
		handler: require('./sources/nearbyPlaces.sjs')
	}],
	rules: {
		places: {
			restaurant: {
				type: "waterfall", // waterfall/parallel mode of execution
				set: [{
					id: '',
					handler: require('./rules/details.sjs'),
					type: ''
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
			 
		}
	},
	db: {
	   "url": "any remote db endpoint that the user specifies"
	},
	queue: {
		id: "rabbitmq",
		details: {}
	},
	webhooks: {
		url: ""	
	}
};