'use strict';

var kinesis_fetcher 	= require('../services/kinesis_fetcher');
var dynamodb 			= require('../services/dynamodb.js');
var dynamo_models 		= require('../services/dynamodb_models.js');
global.log 				= require('../config/logger.js');
var config 				= require('config');
var express 			= require('express');
var app 				= express();
var http 				= require('http');

var assert 				= require('assert');
var chai 				= require('chai');
var expect 				= require('chai').expect;


describe('new kinesis_fetcher', function() {


	context('when streamConfig JSON is not provided', function() {
		it('should throw an error', function() {
			expect(function testFunc() {
				new kinesis_fetcher()
			}).to.throw();
		});
	});


	context('when Dynamo object is not provided', function() {
		it('should throw an error', function() {
			expect(function testFunc() {
				var streamConfig = {
					instanceId: 'instance-1',
                    redisUrl: process.env.REDIS_URL,
                    streams: [{
                        name: 'test-transaction_events',
                        partitions: 1
                    }]
                };
				new kinesis_fetcher(streamConfig)
			}).to.throw();
		});
	});


	context('when server object is undefined', function() {
		it('should throw an error', function() {
			expect(function testFunc() {
				var streamConfig = {
					instanceId: 'instance-1',
                    redisUrl: process.env.REDIS_URL,
                    streams: [{
                        name: 'staging-timeline_events',
                        partitions: 1
                    }]
                };
                var ddb = new dynamodb(null, null, dynamo_models.TimelineEvents);
				new kinesis_fetcher(streamConfig, ddb);
			}).to.throw();
		});
	});

	context('when streamConfig, server & Dynamo object are all defined', function() {
		it('should not throw an error', function() {
			expect(function testFunc() {
				var streamConfig = {
					instanceId: 'instance-1',
                    redisUrl: process.env.REDIS_URL,
                    streams: [{
                        name: 'staging-timeline_events',
                        partitions: 1
                    }]
                };
				global.server = http.createServer(app);
				server.listen('19929');
                var ddb = new dynamodb(null, null, dynamo_models.TimelineEvents);
				new kinesis_fetcher(streamConfig, ddb);
			}).not.to.throw();
		});
	});

	context('when everything is properly defined', function() {
		it('should not throw an error', function() {
			expect(function testFunc() {
				var streamConfig = {
					instanceId: 'instance-1',
                    redisUrl: process.env.REDIS_URL,
                    streams: [{
                        name: 'development-transaction_events_2',
                        partitions: 1
                    }]
                };
				global.server = http.createServer(app);
				server.listen('19929');
                var ddb = new dynamodb(null, null, dynamo_models.TimelineEvents);
				var kf = new kinesis_fetcher(streamConfig, ddb);
				kf.streamEvents();
			}).not.to.throw();
		});
	});


});