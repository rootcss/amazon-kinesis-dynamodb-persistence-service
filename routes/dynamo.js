var express 		= require('express');
var router 			= express.Router();
var dynamo_models 	= require('../services/dynamodb_models.js');
var dynamodb 		= require('../services/dynamodb.js');

router.get('/', function(req, res, next) {
	res.render('dynamo', {title: 'DynamoDB Home'});
});

// "SCAN" WITH AN ID
router.get('/scan/:id', function(req, res, next) {
	var ddb = new dynamodb(req, res, dynamo_models.TimelineEvents);
	ddb.scan(where='EventID', equals=req.params.id);
});

// "QUERY" WITH AN ID
router.get('/query/:id', function(req, res, next) {
	var ddb = new dynamodb(req, res, dynamo_models.TimelineEvents);
	ddb.query(req.params.id);
});

// "ORDERED QUERY"
router.get('/oquery/:id', function(req, res, next) {
	var ddb = new dynamodb(req, res, dynamo_models.TimelineEvents);
	ddb.queryByKeyOrdered(key=req.params.id, null, order='ASC', limit=5);
});

// "DESTROY" A RECORD
router.get('/destroy/:partition/:sort', function(req, res, next) {
		var ddb = new dynamodb(req, res, dynamo_models.TimelineEvents);
		ddb.destroy(req.params.partition, req.params.sort);
});

// "INSERT" A RECORED
router.get('/insert', function(req, res, next) {
	var ddb = new dynamodb(req, res, dynamo_models.TimelineEvents);
	var n = 10;
	var data = {
        EventID: '0bb4ac97-55ad-4712-9dfa-78099eacff95',
        EventTimestamp: n+"_12:34:23:3434.3343",
        EventName: n+"ShekharSinghSINGH",
    }
    ddb.insert(data);
});

// Get "COUNT" of a parameter by its key - (partition, index, sort)
router.get('/count/:partition/:index/:sort', function(req, res, next){
	var ddb = new dynamodb(req, res, dynamo_models.TimelineEvents);
	var ret = ddb.checkIfRecordExists(req.params.partition, req.params.index, req.params.sort);
	console.log(ret);
	res.render('dynamo', {title: 'DynamoDB Get Count', dynamodb: ret});
});

// Get "COUNT" of a parameter by its key - (partition, index, sort)
router.get('/count/:partition', function(req, res, next){
	var ddb = new dynamodb(req, res, dynamo_models.TimelineEvents);
	ddb.checkIfRecordExists(req.params.partition, req.params.index, req.params.sort, function(err, data){
		console.log("dATAAAA: ", data);
		res.render('dynamo', {title: 'DynamoDB Get Count', dynamodb: data});
	});
});

module.exports = router;
