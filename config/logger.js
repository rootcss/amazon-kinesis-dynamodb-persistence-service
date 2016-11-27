var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'Kinesis_dynamodb_app'});

module.exports = log;
