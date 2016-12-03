// var PORT = '8080';
// var SERVER_URL = "http://localhost:" + PORT;
SERVER_URL = ''
var socket = io.connect(SERVER_URL);

socket.on('connect', function() {
    document.getElementById('connected').innerHTML = '<span style="color:green;">Connected!</span>';
});

socket.on('disconnect', function(){
   document.getElementById('connected').innerHTML = '<span style="color:red;">Disconnected!</span>';
});

socket.on("datadump", function(tweet) {
    var stuff = "";
    stuff = '<a target="_blank" style="text-decoration:none;" href="'+ SERVER_URL +'/dynamo/query/' + tweet.eventId + '">\
            <div id="data-tab" title="Data: ' + tweet.data + '">\
                <span id="eventid"><span id="etitle">EventID </span>' + tweet.eventId + '</span>\
                <span id="eventtimestamp">' + tweet.eventTimestamp + '<span id="etitle"> EventTimestamp</span></span>\
                <br>\
                <!--<center><span style="color:#000;">' + tweet.data + '</span></center>-->\
                <span id="eventname"><span id="etitle">EventName </span>' + tweet.eventName + '</span>\
                \
                <span id="shradid">' + tweet.shardId + '<span id="etitle"> ShardId</span></span>\
            </div>\
            </a>';
    document.getElementById('content').innerHTML = stuff + document.getElementById('content').innerHTML;
});


var chart;  // Keep this global here.
$(document).ready(function() {
  Highcharts.setOptions({
    global: {
        useUTC: false
    }
  });
  chart = new Highcharts.Chart({
    chart: {
      renderTo: 'container',
      defaultSeriesType: 'line',
      events: {
        load: requestData
      }
    },
    title: {
      text: ''
    },
    xAxis: {
      type: 'datetime',
      // dateTimeLabelFormats: { day: '%H:%M:%S' },
      tickPixelInterval: 150,
      maxZoom: 20 * 1000
    },
    yAxis: {
      minPadding: 0.2,
      maxPadding: 0.2,
      title: {
        text: 'Dump Size',
        margin: 20
      }
    },
    series: [{
      name: 'Kinesis Data Dump',
      data: []
    }]
  });
});

function requestData() {
  socket.on("datadump", function(dumper) {
    var x = JSON.stringify(dumper);
    var len = x.length;
    var rand = Math.floor((Math.random() * 100) + 1);
    var data = len+rand;
    var y = [(new Date().getTime()), data];
    // dont touch anything below this x-(
    var series = chart.series[0];
    var shift = series.data.length > 20;
    chart.series[0].addPoint(eval(y), true, shift, {tooltip:'hello'});
  });
}
