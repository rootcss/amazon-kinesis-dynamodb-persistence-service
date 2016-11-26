// Dynamo config and libs
var vogels    = require('vogels'),
    AWS       = vogels.AWS,
    Joi       = require('joi'),
    config    = require('config');

var params = {}
try {
    params = { endpoint: new AWS.Endpoint(config.get('Dynamo.endpoint')) }
    console.log('Using the local end-point: ', config.get('Dynamo.endpoint'));
} catch(err) {
    console.log('Endpoint is not provided. Assuming this is meant to be.')
    params = {}
}

var dynamodb = new AWS.DynamoDB(params);
vogels.dynamoDriver(dynamodb);

// Model for TimelineEvents table
var timeline_events_table_name = config.get('Dynamo.TimelineEvents.tableName');
exports.TimelineEvents = vogels.define(timeline_events_table_name, {
    hashKey: 'eventId',
    // rangeKey: 'eventName',
    timestamps: true,
    schema: {
        eventId: vogels.types.uuid(),
        eventTimestamp: Joi.number(),
        eventName: Joi.string(),
        payload: Joi.string(),
        sequenceNumber: Joi.string(),
        shardId: Joi.string()
    },
    tableName: timeline_events_table_name,
    // indexes : [{
    //     hashKey : 'eventId',
    //     rangeKey : 'eventTimestamp',
    //     name : 'eventTimestampIndex',
    //     type : 'local'
    // }]
});
