var express = require('express');
var router = express.Router();
var request = require('request');
var User = require('../models/user.js');
var Meal = require('../models/meal.js');

// Calls the USDA food API
router.get('/', function(req, res) {
  request('http://api.nal.usda.gov/ndb/reports/?ndbno=01145&type=f&format=json&api_key=' + process.env.DATA_GOV_KEY, //api call to USDA
    function(error, repsonse, body){
    // console.log(typeof body);
    var test = JSON.parse(body) //parses the string to json
    console.log(test.report.food.nutrients[1]); //gets the calories and portion
  })
});

// Gets user and get the meal
router.get('/:id', function(req, res) {
  var date1 = new Date("October 13, 2014"); // sample date for testing
  date1 = Date.parse(d); // parses date to string
  // console.log(d);
  User.findById(req.params.id).then(function(user) { //finds user by ID
    // res.send(user);
    // console.log(user);
    user.meal.forEach(function(meal){ //searches through user meals
      // console.log(meal);
      // console.log(typeof meal.date);
      // console.log(typeof d);
      if(Date.parse(meal.date) == date1){ //compares the date
        console.log('this is the meal ' + meal) 
        // console.log(meal);
      }
    })
    // user.findOne({meal: })
  })
})



module.exports = router;