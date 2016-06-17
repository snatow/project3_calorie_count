var express = require('express');
var router = express.Router();
var request = require('request');



router.get('/', function(req, res) {
  console.log(process.env.DATA_GOV_KEY);
  request('http://api.nal.usda.gov/ndb/reports/?ndbno=01145&type=f&format=json&api_key=' + process.env.DATA_GOV_KEY, function(error, repsonse, body){
    console.log(typeof body);
    var test = JSON.parse(body)
    console.log(test.report.food.nutrients[1]);
  })



});

module.exports = router;