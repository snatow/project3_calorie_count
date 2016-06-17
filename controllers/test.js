var express = require('express');
var router = express.Router();
var request = require('request');
var User = require('../models/user.js');
var Meal = require('../models/meal.js');


router.get('/', function(req, res) {
  console.log(process.env.DATA_GOV_KEY);
  request('http://api.nal.usda.gov/ndb/reports/?ndbno=01145&type=f&format=json&api_key=' + process.env.DATA_GOV_KEY, function(error, repsonse, body){
    console.log(typeof body);
    var test = JSON.parse(body)
    console.log(test.report.food.nutrients[1]);
  })
});

router.get('/:id', function(req, res) {
  var d = new Date("October 13, 2014");
  d = Date.parse(d);
  // console.log(d);
  User.findById(req.params.id).then(function(user) {
    // res.send(user);
    // console.log(user);
    user.meal.forEach(function(meal){
      // console.log(meal);
      // console.log(typeof meal.date);
      // console.log(typeof d);
      if(Date.parse(meal.date) == d){
        console.log('this is the meal ' + meal)
        // console.log(meal);
      }
    })
    // user.findOne({meal: })
  })
  Meal.findById("57641288a0516df0e63347b0").then(function(meal) {
    // console.log(meal);
  })
})



module.exports = router;