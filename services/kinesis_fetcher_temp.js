var KinesisStreamFetcher    = require('kinesis_stream_fetcher');
var dynamo_models           = require('./dynamodb_models.js');
var dynamo                  = require('./dynamodb.js');
var utility                 = require('./utility.js');
var _                       = require('lodash');
var config                  = require('config');
var http                    = require('http');
var io                      = require('socket.io');
var app                     = require('../app.js');
var socketio;

var fetchDataAndInsertIntoDynamo = function(streamConfig) {
    var ksf = new KinesisStreamFetcher(streamConfig);
    ksf.fetch();
    createSocketServer();
    log.info("Fetching data from Kinesis stream..");
    ksf.on('message', onMessage);
}

var createSocketServer = function() {
    socketio = io.listen(server);
    log.info("Listening to server @ localhost:8081");
    return server;
}

var onMessage = function(data) {
    dumper = convertPayloadIntoData(data);
    dynamo.dynamo_insert_data(null, null, model=dynamo_models.TimelineEvents, data=dumper);
    socketio.emit("datadump", dumper);
}

var convertPayloadIntoData = function(data) {
    var dumper = {}
    if (data && data.payload && data.payload.records) {
        _.map(data.payload.records, function(record) {
            dumper['data'] = new Buffer(record.Data.data).toString('utf8');
            dumper['SequenceNumber'] = record.SequenceNumber.toString('utf8')
        })
    }
    dumper['shardId'] = data.payload.shardId.toString('utf8')
    // extra data is temprary. Need to change later when data will be actual data
    dumper['EventID'] = utility.generateUUID().toString();
    dumper['EventTimestamp'] = new Date().toLocaleString().toString();
    dumper['EventName'] = "EventName" + new Date().toLocaleString().toString();

    log.info("[*] " + dumper['SequenceNumber']);
    return dumper
}

module.exports = {
  fetchDataAndInsertIntoDynamo: fetchDataAndInsertIntoDynamo
}
