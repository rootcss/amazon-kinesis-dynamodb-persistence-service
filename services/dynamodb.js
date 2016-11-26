'use strict';

var async   = require('async');
var vogels  = require('vogels'),
    AWS     = vogels.AWS,
    config  = require('config');

var dumper;

class Dynamodb{
    constructor(request, response, model){
        this.req = request;
        this.res = response;
        this.connect();
        this.model = model;
    }

    connect(){
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
    }

    scan(where, equals) {
        var self = this;
        this.model.scan()
        .where(where).equals(equals)
        .exec(function(err, data) {
            if (err) dumper = err;
            else dumper = JSON.stringify(data, null, '\t');
            self.res.render('dynamo', {title: 'DynamoDB Scan', dynamodb: dumper});
        });
    }

    query(key) {
        var self = this;
        this.model.query(key)
        .loadAll()
        .exec(function(err, data) {
            if (err) dumper = err;
            else dumper = JSON.stringify(data, null, '\t');
            self.res.render('dynamo', {title: 'DynamoDB Query', dynamodb: dumper});
        });
    };

    destroy(partition, sort) {
      var self = this;
      if(sort == null) {
        this.model.destroy(partition, function (err) {
          if(err) { dumper = err; }
          else { dumper = 'Row deleted!'; }
          self.res.render('dynamo', {title: 'DynamoDB Destroy', dynamodb: dumper});
        });
      } else {
        this.model.destroy(partition, sort, function (err) {
          if(err) { dumper = err; }
          else { dumper = 'Row deleted!'; }
          self.res.render('dynamo', {title: 'DynamoDB Destroy', dynamodb: dumper});
        });
      }
    }

    insert(data) {
        var self = this;
        var dumper;
        this.model.create(data, function (err, data) {
            if (err) {
                dumper = 'Error inserting data. Make sure DynamoDB server is running.';
                dumper = dumper + err.toString();
                log.info(dumper);
                console.log(dumper);
                process.exit(1);
            }else {
                dumper = 'Inserted into DynamoDB.';
                console.log(dumper);
                log.info(dumper);
            }
            if(self.res) {
                self.res.render('dynamo', {title: 'DynamoDB Insert Data', dynamodb: dumper});
            }
        });
    }

    queryByKeyOrdered(key, index, order, limit) {
        var self = this;
        if(limit == null) limit = 15;
        if(order == null) order = 'ASC';
        if(index == null) {
          if(order == 'ASC') {
              this.model.query(key).limit(limit).ascending().exec(function(err, data) {
                  if (err) dumper = err;
                  else dumper = JSON.stringify(data, null, '\t');
                  self.res.render('dynamo', {title: 'DynamoDB Ordered Query', dynamodb: dumper});
              });
          }
          else {
              this.model.query(key).limit(limit).descending().exec(function(err, data) {
                  if (err) dumper = err;
                  else dumper = JSON.stringify(data, null, '\t');
                  self.res.render('dynamo', {title: 'DynamoDB Ordered Query', dynamodb: dumper});
              });
          }
        } else {
          if(order == 'ASC')
              this.model.query(key).usingIndex(index).limit(limit).ascending().loadAll().exec(function(err, data) {
                  if (err) dumper = err;
                  else dumper = JSON.stringify(data, null, '\t');
                  self.res.render('dynamo', {title: 'DynamoDB Ordered Query', dynamodb: dumper});
              });
          else
              this.model.query(key).usingIndex(index).limit(limit).descending().loadAll().exec(function(err, data) {
                  if (err) dumper = err;
                  else dumper = JSON.stringify(data, null, '\t');
                  self.res.render('dynamo', {title: 'DynamoDB Ordered Query', dynamodb: dumper});
              });
        }
    }

    // index could be sort key as well
    // index and sort could be null as well
    getCount(model, partition, index, sort, fnCallback) {
      async.series([
        function(callback) {
          var self = this;
          if(index == null || sort == null) {
            model.query(partition).select('COUNT').exec(function(err, data){
              return callback(err, data);
            });
          } else {
            model.query(partition).where(index).equals(sort).select('COUNT').exec(function(err, data){
              return callback(err, data);
            });
          }
        },
      ], function(err, data) {
        return fnCallback(err, data);
      });
    }

    // checkIfRecordExists(partition, index, sort) {
    //   this.getCount(this.model, partition, index, sort, function(err, data) {
    //     if(err) { console.log(err); }
    //     else {
    //         var count = Number(data[0]['Count']);
    //         if(count >= 1) {
    //             console.log("Record Exists!");
    //             return false;
    //         } else {
    //             console.log("Record doesn't Exist!");
    //             return true;
    //         }
    //     }
    //   });
    // };


}

module.exports = Dynamodb;
