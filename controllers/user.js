var express = require('express');
var router = express.Router();
var request = require('request');
var passport = require('../config/passport.js');
var User = require('../models/user.js');
var Meal = require('../models/meal.js');

// ------------------------------
// ROUTES THAT DON'T REQUIRE AUTH
// ------------------------------

// Test Route
// router.get('/', function(req, res) {
//   res.send('users controller works for not logged in');
// })

// CREATE A NEW USER
router.post('/', function(req, res) {
  User.create(req.body, function(err, user) {
    if(err) {
      console.log(err); 
      res.status(500);
    } else {
      console.log('user made');
      res.send(true);
    }
  });
});



// Does an unprotected search for an item that the user inputs
router.get('/search/:item', function(req,res) {
  console.log('The search for an item works!')
  console.log(req.params.item);
  request('http://api.nal.usda.gov/ndb/search/?format=json&q=' + req.params.item + '&sort=n&max=5&offset=0&api_key=' + process.env.DATA_GOV_KEY, //api call to USDA
    function(error, repsonse, body){
      if (!error && repsonse.statusCode == 200) {
        var food = JSON.parse(body) //parses the string to json
        console.log(food.list.item);
        res.send(food.list.item) //sends an array of items returned from the search 
      } else {
        res.send('error!');
      }
  });
})

// Does an unprotected search for a specific item by ID
router.get('/search/item/:id', function(req, res) {
  console.log('search for item id');
  request('http://api.nal.usda.gov/ndb/reports/?ndbno=' + req.params.id + '&type=f&format=json&api_key=' + process.env.DATA_GOV_KEY, //API call to USDA
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var food = JSON.parse(body);
        console.log(food.report.food.name);
        var foodName = food.report.food.name;
        console.log(food.report.food.nutrients[1].measures);
        var calories = food.report.food.nutrients[1].measures; //returns array of measures with calories
        res.send({name: foodName, calories: calories})
      } else {
        res.send('error!');
      }
    })
})


// -----------------------------------------------
// ROUTES THAT REQUIRE AUTHENTICATION w/ JWT BELOW
// -----------------------------------------------
router.use(passport.authenticate('jwt', { session: false }));

// Test call to the USDA food API
router.get('/', function(req, res) {
  request('http://api.nal.usda.gov/ndb/reports/?ndbno=01145&type=f&format=json&api_key=' + process.env.DATA_GOV_KEY, //api call to USDA
    function(error, repsonse, body){
      if (!error && response.statusCode == 200) {
        // console.log(typeof body);
        var food = JSON.parse(body) //parses the string to json
        console.log(food.report.food.nutrients[1]); //gets the calories and portion
      }
    })
});

// Gets the calories of the user
router.get('/user/calories', function(req, res) {
  // console.log('getting calories');
  // console.log(req.user.id) //we can get user iq through this with passport
  User.findById(req.user.id).then(function(user, err) {
    if (err) {
      console.log('there is an error');
      console.log(err);
      res.send('error');
    } else {
      console.log('it works')
      console.log(user.calories);
      res.send({calories: user.calories});
    }
  })
})

// Edit User Info
router.put('/edit/:id', function(req, res) {
  console.log('edit user info route reached');
  User.findById(req.params.id).then(function(user) { //finds user by ID
    console.log(user)
    user.username = req.body.username;  //Changes username
    user.password = req.body.password;  //Changes password might need hash
    user.email = req.body.email;        //Changes email
    user.calories = req.body.calories   //Changes calories
  })
});

// Get user meals
router.get('/user/:id', function(req, res) {
  console.log('get the users meal');
  User.findById(req.params.id).then(function(user) {
    console.log(user);
    res.send(user.meal);
  })
})

// Gets user and get the specific meal by the date
router.get('/user/:id/date/:date', function(req, res) {
  console.log(req.params.date);
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
});





// Saving the meal to the user
router.post('/savemeal/:id', function(req, res) {
  console.log('saving meal to user route works')
  // console.log(req.body)
  User.findById(req.params.id).then(function(user) {
    console.log(user);
    // have to .create and save the food for user at given date
    // have to push this food we created to the user array
  })
})




module.exports = router;