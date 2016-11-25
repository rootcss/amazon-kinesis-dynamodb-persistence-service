## Amazon Kinesis - DynamoDB Persistence Service

This service fetches events from Kinesis and dump them into DynamoDB in the defined schema.

### Tech Stack of App:
```
Backend: Nodejs
Framework: Express
View Engine: Jade
Deploy: Capistrano
App Server: Phusion Passenger
CI: circleci
```


## Make sure:
	- Redis server is running.
	- DynamoDB server is running. (command on my PC: dynamo-start)
	- These values are properly set in your system:
		  	- AWS_ACCESS_KEY_ID
		  	- AWS_REGION
		  	- AWS_SECRET_ACCESS_KEY


## Execution:

`export NODE_ENV=development && passenger start --app-type node --startup-file app.js`

or

`export NODE_ENV=development && PORT=8080 DEBUG=kinesis_dynamodb_app:* npm start`

## Execute Test Cases:
Just execute the command: `mocha`
  
## DynamoDB Models:-
<pre>
var timeline_events_table_name = 'staging-timeline_events';
exports.TimelineEvents = vogels.define(timeline_events_table_name, {
    hashKey: 'eventId',
    rangeKey: 'eventName',
    timestamps: true,
    schema: {
        eventId: vogels.types.timeUUID(),
        eventTimestamp: Joi.number(),
        eventName: Joi.string(),
        payload: Joi.string(),
        sequenceNumber: Joi.string(),
        shardId: Joi.string()
    },
    tableName: timeline_events_table_name,
    indexes : [{
        hashKey : 'eventId',
        rangeKey : 'eventTimestamp',
        name : 'eventTimestampIndex',
        type : 'local'
    }]
});
</pre>


Proper and detailed README adding soon! :)