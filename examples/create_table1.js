'use strict';

var vogels = require('vogels'),
    AWS = vogels.AWS,
    Joi = require('joi');

var dynamodb = new AWS.DynamoDB({
    endpoint: new AWS.Endpoint('http://localhost:8000')
});
vogels.dynamoDriver(dynamodb);

var create = false;
var write = false;
var TimelineEvents = vogels.define('api_events_development', {
    hashKey: 'eventId',
    // rangeKey: 'eventName',
    timestamps: true,
    schema: {
        eventId: vogels.types.timeUUID(),
        eventTimestamp: Joi.number(),
        eventName: Joi.string(),
        payload: Joi.string(),
        sequenceNumber: Joi.string(),
        shardId: Joi.string()
    },
    tableName: 'api_events_development',
    // indexes : [{
    //     hashKey : 'eventId',
    //     rangeKey : 'eventTimestamp',
    //     name : 'eventTimestampIndex',
    //     type : 'local'
    // }]
});


p("Creating table(s)..")
vogels.createTables({
    'api_events_development': {readCapacity: 20, writeCapacity: 30},
}, function(err) {
    if (err) {
        pp('Error creating tables!');
        pp(err);
        process.exit(1);
    }
});


function p(data) {
    console.log(data);
}

function pp(data) {
    console.log(JSON.stringify(data, null, 2));
}