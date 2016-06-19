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
    calories: 500,
    maxCalories: 2000,
    date: new Date("October 13, 2016"),
    breakfast: [{food: "cat",
                 calories: 500,
                 qty: 1,
                 measurement: "cup"}, 
                {food: "dog",
                 calories: 500,
                 qty: 1,
                 measurement: "cup"}],
    lunch: [{food: "parrot",
                 calories: 394,
                 qty: 1,
                 measurement: "cup"}, 
                {food: "mayo",
                 calories: 500,
                 qty: 3,
                 measurement: "blah"}],
    dinner: [{food: "dragon",
                 calories: 542}, 
                {food: "burger",
                 calories: 500,
                 qty: 1,
                 measurement: "cup"}],
    snacks: [{food: "freg",
                 calories: 250,
                 qty: 5,
                 measurement: "person"}, 
                {food: "water",
                 calories: 500,
                 qty: 3,
                 measurement: "human"}],
  });

  var meal2 = new Meal({
    calories: 250,
    maxCalories: 2000,
    date: new Date("January 1, 2017"),
    breakfast: [{food: "cat",
                 calories: 394,
                 qty: 1,
                 measurement: "cup"}, 
                {food: "dog",
                 calories: 940,
                 qty: 4,
                 measurement: "basket"}],
    lunch: [{food: "watermelon",
                 calories: 500,
                 qty: 1,
                 measurement: "slice"}, 
                {food: "apple",
                 calories: 500,
                 qty: 1,
                 measurement: "slice"}],
    dinner: [{food: "turtle",
                 calories: 440,
                 qty: 1,
                 measurement: "tsbp"}, 
                {food: "soup",
                 calories: 500,
                 qty: 1,
                 measurement: "tsp"}],
    snacks: [{food: "bread",
                 calories: 530,
                 qty: 2,
                 measurement: "fork"}, 
                {food: "butter",
                 calories: 120,
                 qty: 4,
                 measurement: "spoon"}]
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