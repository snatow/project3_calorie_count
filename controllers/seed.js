var express = require('express');
var mongoose = require('mongoose');
var db = process.env.MONGODB_URI || "mongodb://localhost/calorie_count_app_dev";
var router = express.Router();
var User = require('../models/user.js');
var Meal = require('../models/meal.js');

router.get('/', function(req, res) {

  var user1 = new User({
    username: 'Joe Jung',
    email: 'joe@joe.com',
    password: 'password',
    calories: 2500
  });

  var meal1 = new Meal({
    date: new Date("October 13, 2016"),
    breakfast: ["cat", "dog"],
    lunch: ["cat", "dog"],
    dinner: ["cat", "dog"],
    snacks: ["cat", "dog"]
  });

  var meal2 = new Meal({
    date: new Date("January 1, 2017"),
    breakfast: ['dog', 'cat'],
    lunch: ['dog', 'cat'],
    dinner: ['dog', 'cat'],
    snacks: ['dog', 'cat']
  });

  user1.save();
  meal1.save();
  meal2.save();
  user1.meals.push(meal1);
  user1.meals.push(meal2);
  user1.save();

  console.log('-----------------------');
  console.log("SEED COMPRETE")
  console.log('-----------------------');
  res.end();
});

module.exports = router;