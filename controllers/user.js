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
  request('http://api.nal.usda.gov/ndb/search/?format=json&q=' + req.params.item + '&sort=r&max=10&offset=0&api_key=' + process.env.DATA_GOV_KEY, //api call to USDA
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
      console.log('it works in getting calories of user')
      console.log(user.calories);
      console.log(user);
      res.send({calories: user.calories, username: user.username});
    }
  })
})

// Edit User Info
router.put('/edit/', function(req, res) {
  console.log('edit user info route reached');
  console.log(req.body)
  User.findById(req.user.id).then(function(user) { //finds user by ID
    console.log(user)
    user.username = req.body.username;  //Changes username
    // user.password = req.body.password;  //Changes password might need hash
    user.email = req.body.email;        //Changes email
    user.calories = req.body.calories   //Changes calories
    console.log(user);
    user.save(function(err, user) {
      if (err) {
        console.log(err)
      } else {
        console.log('saved user')
        console.log(user);
      }
    });
  })
});

// Create a date of meal for the user
router.post('/createdate/:month/:day/:year', function(req, res) {
  console.log('created date');
  var date = new Date(req.params.month + ' ' + req.params.day + ', ' + req.params.year);
  var newData = {
    date: date
  }

  User.findById(req.user.id).then(function(user){
    var counter = 0;

    console.log(user.meals.length);

    user.meals.forEach(function(meal){
      console.log(meal.date)
      if (date.getTime() != meal.date.getTime()) {
          counter++;
      }
      if (counter === user.meals.length) {
        user.meals.push(newData);
        user.save(function(err) {
          if (err){
            console.log(err)
          } else {
            console.log('saved the new date');
          }
        })
      }



    // user.meals.forEach(function(meal){
    //   console.log(meal.date)
    //   if (date.getTime() != meal.date.getTime()){
    //     user.meals.push(newData);
    //     user.save(function(err) {
    //       if (err){
    //         console.log(err)
    //       } else {
    //         console.log('saved the new date');
    //       }
    //     });
    //   } else {
    //     console.log('date already exists')
    //   }
    // })
    //   console.log(user);
    // 
    })
  })
})

// Adds food to individual meals on selected dates
router.put('/addfood/:month/:day/:year/:meal', function(req, res) {
  console.log('add food route reached');
  // res.send('it works');
  // console.log(req.body);
  console.log(req.params.month)
  console.log(req.params.year)
 console.log('why wont heroku work')

  var date = new Date(req.params.month + ' ' + req.params.day + ', ' + req.params.year);
   var newMeal = {
            date: date,
            food: req.body.name,
            calories: req.body.food.value,
            qty: req.body.food.qty,
            measurement: req.body.food.label}

  console.log(newMeal);
  // console.log(date);
  // var date1 = new Date("October 13, 2014"); // sample date for testing
  // date1 = Date.parse(d); // parses date to string
  // console.log(d);
  User.findById(req.user.id).then(function(user) { //finds user by ID
    // res.send(user);
    console.log('add food user')
    console.log(user);
    if (user.meals.length == 0) {
      user.meals.push(newMeal)
      if (req.params.meal === 'breakfast') {
        console.log("meal breakfast")
        console.log(user);
      }
        //adding some weird comment here to push to heroku
    }


    user.meals.forEach(function(meal){ //searches through user meals
      // console.log("this is the meal " + meal);
      // console.log(typeof meal.date);
      // console.log(typeof date);
      console.log("date one is " + date.getTime());
      console.log("date two is " + meal.date.getTime())
      var mealTime = req.params.meal;
      // console.log('This is the meal time ' + mealTime)
      // console.log(mealTime);
      // console.log(meal.breakfast)
      // console.log(typeof d);
      if(meal.date.getTime() == date.getTime() && mealTime === 'breakfast'){ //compares the date
        // console.log('this is breakfast ' + meal.breakfast)
        // console.log(meal.breakfast)
        console.log('we hit the breakfast save route')
        meal.breakfast.push(newMeal)
        console.log(meal);
        // meal.save();
        // user.meals.breakfast.push(newMeal);
        console.log(user);
        user.save()
        res.send(meal.breakfast);
        // console.log(meal);
      } else if(meal.date.getTime() == date.getTime() && mealTime === 'lunch'){ //compares the date
        // console.log(meal.lunch)
        console.log('we hit the lunch save route')
        meal.lunch.push(newMeal)
        console.log(meal);
        // meal.save();
        // user.meals.breakfast.push(newMeal);
        console.log(user);
        user.save()
        res.send(meal.lunch);
        // console.log(meal);
      } else if(meal.date.getTime() == date.getTime() && mealTime === 'dinner'){ //compares the date
        // console.log(meal.dinner)
        console.log('we hit the dinner save route')
        meal.dinner.push(newMeal)
        console.log(meal);
        // meal.save();
        // user.meals.breakfast.push(newMeal);
        console.log(user);
        user.save()
        res.send(meal.dinner);
        // console.log(meal);
      } else if (meal.date.getTime() == date.getTime() && mealTime === 'snacks'){ //compares the date
        // console.log(meal.snacks)
        console.log('we hit the snacks save route')
        meal.snacks.push(newMeal)
        console.log(meal);
        // meal.save();
        // user.meals.breakfast.push(newMeal);
        console.log(user);
        user.save()
        res.send(meal.snacks);
        // console.log(meal);
      }

    })
  })
})

// //Removes food from a specific meal on a specific day
// router.put('/removefood/:month/:day/:year/:meal', function(req, res) {
//   console.log("inside put route to delete")
//   console.log(req.body.food.food);
//   var counter = 0;
//   var mealName = req.params.meal;
//   // console.log(mealName);
//   User.findById(req.user.id).then(function(user) {
//     console.log("searching for the user")
//     // console.log(user);
//     user.meals.forEach(function(meal){
//       // console.log("meal");
//       // console.log(meal);
//       if (mealName == "breakfast") { 
//         meal.breakfast.forEach(function(foodItem) {
//           console.log("food Item");
//           console.log(foodItem);
//           if (req.body.food.food == foodItem.food && counter === 0) { // if the food item in the request body matches the food item looped through in breakfast on that day
//             console.log("inside If statement")
//             console.log(foodItem);
//             console.log(meal.breakfast);

//             var index = meal.breakfast.indexOf(foodItem);
//             console.log("this is the index: ");
//             console.log(index);
//             meal.breakfast.splice(index, 1) //removes the food item that matches the one in the request
//             user.save();
//             counter++;
//             res.send(true);
//           }
//         })
//       } else if (mealName == "lunch") {
//         meal.lunch.forEach(function(foodItem) {
//           console.log("food Item");
//           console.log(foodItem);
//           if (req.body.food.food == foodItem.food && counter === 0) {
//             console.log("inside If statement")
//             console.log(foodItem);
//             console.log(meal.lunch);

//             var index = meal.lunch.indexOf(foodItem);
//             console.log("this is the index: ");
//             console.log(index);
//             meal.lunch.splice(index, 1)
//             user.save();
//             counter++;
//             res.send(true);
//           }
//         })
//       } else if (mealName == "dinner") {
//         meal.dinner.forEach(function(foodItem) {
//           console.log("food Item");
//           console.log(foodItem);
//           if (req.body.food.food == foodItem.food) {
//             console.log("inside If statement snacks")
//             console.log(foodItem);
//             console.log(meal.dinner);

//             var index = meal.dinner.indexOf(foodItem);
//             console.log("this is the index: ");
//             console.log(index);
//             meal.dinner.splice(index, 1)
//             user.save();
//             counter++;
//             res.send(true);
//           }
//         })
//       } else if (mealName == "snacks") {
//         meal.snacks.forEach(function(foodItem) {
//           console.log("food snacks Item");
//           console.log(foodItem);
//           if (req.body.food.food == foodItem.food && counter === 0) {
//             console.log("inside If snacks statement")
//             console.log(foodItem);
//             console.log(meal.snacks);

//             var index = meal.snacks.indexOf(foodItem);
//             console.log("this is the index: ");
//             console.log(index);
//             meal.snacks.splice(index, 1)
//             user.save();
//             counter++;
//             res.send(true);
//           }
//         })
//       }
//     })
//   })
// })

//removes from breakfast
router.put('/removefood/:month/:day/:year/breakfast', function(req, res) {
  console.log("inside put route to delete")
  console.log(req.body.food.food);
  var counter = 0;
  var mealName = req.params.meal;
  // console.log(mealName);
  User.findById(req.user.id).then(function(user) {
    console.log("searching for the user")
    // console.log(user);
    user.meals.forEach(function(meal){
      // console.log("meal");
      // console.log(meal);
      meal.breakfast.forEach(function(foodItem) {
        console.log("food Item");
        console.log(foodItem);
        if (req.body.food.food == foodItem.food && counter === 0) { // if the food item in the request body matches the food item looped through in breakfast on that day
          console.log("inside If statement")
          console.log(foodItem);
          console.log(meal.breakfast);

          var index = meal.breakfast.indexOf(foodItem);
          console.log("this is the index: ");
          console.log(index);
          meal.breakfast.splice(index, 1) //removes the food item that matches the one in the request
          user.save();
          counter++;
          res.send(true);
          }
        })
    })
  })
})

//removes from lunch
router.put('/removefood/:month/:day/:year/lunch', function(req, res) {
  console.log("inside put route to delete")
  console.log(req.body.food.food);
  var counter = 0;
  var mealName = req.params.meal;
  // console.log(mealName);
  User.findById(req.user.id).then(function(user) {
    console.log("searching for the user")
    // console.log(user);
    user.meals.forEach(function(meal){
      // console.log("meal");
      // console.log(meal);
      meal.lunch.forEach(function(foodItem) {
        console.log("food Item");
        console.log(foodItem);
        if (req.body.food.food == foodItem.food && counter === 0) {
          console.log("inside If statement")
          console.log(foodItem);
          console.log(meal.lunch);

          var index = meal.lunch.indexOf(foodItem);
          console.log("this is the index: ");
          console.log(index);
          meal.lunch.splice(index, 1)
          user.save();
          counter++;
          res.send(true);
        }
      })
    })
  })
})

//removes from dinner
router.put('/removefood/:month/:day/:year/dinner', function(req, res) {
  console.log("inside put route to delete")
  console.log(req.body.food.food);
  var counter = 0;
  var mealName = req.params.meal;
  // console.log(mealName);
  User.findById(req.user.id).then(function(user) {
    console.log("searching for the user")
    // console.log(user);
    user.meals.forEach(function(meal){
      // console.log("meal");
      // console.log(meal);
      meal.dinner.forEach(function(foodItem) {
        console.log("food Item");
        console.log(foodItem);
        if (req.body.food.food == foodItem.food) {
          console.log("inside If statement snacks")
          console.log(foodItem);
          console.log(meal.dinner);

          var index = meal.dinner.indexOf(foodItem);
          console.log("this is the index: ");
          console.log(index);
          meal.dinner.splice(index, 1)
          user.save();
          counter++;
          res.send(true);
        }
      })
    })
  })
})

//removes from snacks
router.put('/removefood/:month/:day/:year/:meal', function(req, res) {
  console.log("inside put route to delete")
  console.log(req.body.food.food);
  var counter = 0;
  var mealName = req.params.meal;
  // console.log(mealName);
  User.findById(req.user.id).then(function(user) {
    console.log("searching for the user")
    // console.log(user);
    user.meals.forEach(function(meal){
      // console.log("meal");
      // console.log(meal);
      meal.snacks.forEach(function(foodItem) {
        console.log("food snacks Item");
        console.log(foodItem);
        if (req.body.food.food == foodItem.food && counter === 0) {
          console.log("inside If snacks statement")
          console.log(foodItem);
          console.log(meal.snacks);

          var index = meal.snacks.indexOf(foodItem);
          console.log("this is the index: ");
          console.log(index);
          meal.snacks.splice(index, 1)
          user.save();
          counter++;
          res.send(true);
        }
      })
    })
  })
})

// Get User 
router.get('/user', function(req, res) {
  console.log('get the users meal');
  User.findById(req.user.id).then(function(user) {
    console.log(user);
    res.send(user);
  })
})

// Get user meals
router.get('/user/:id/meal', function(req, res) {
  console.log('get the users meal');
  User.findById(req.params.id).then(function(user) {
    // console.log(user);
    res.send(user);

  })
})

// get calories of meals
router.get('/user/mealcalories/:month/:day/:year/:meal', function(req, res) {
  console.log('inside get calories of meal')
  // console.log(req.body)
  var date = new Date(req.params.month + ' ' + req.params.day + ', ' + req.params.year);
  // console.log(date);
  // var date1 = new Date("October 13, 2014"); // sample date for testing
  // date1 = Date.parse(d); // parses date to string
  // console.log(d);
  User.findById(req.user.id).then(function(user) { //finds user by ID
    // res.send(user);
    // console.log(user);
    user.meals.forEach(function(meal){ //searches through user meals
      var totalCalories = 0;
      var counter = 0;
      if (meal.date.getTime() == date.getTime() && counter === 0){
        console.log('this is the meal for the user for that day ' + meal);
        for (i = 0; i < meal.dinner.length; i++) {
          // console.log(meal.dinner[i].calories);
          totalCalories += parseInt(meal.dinner[i].calories)
        }
        for (i = 0; i < meal.lunch.length; i++) {
          // console.log(meal.dinner[i].calories);
          totalCalories += parseInt(meal.lunch[i].calories)
        }
        for (i = 0; i < meal.breakfast.length; i++) {
          // console.log(meal.dinner[i].calories);
          totalCalories += parseInt(meal.breakfast[i].calories)
        }
        for (i = 0; i < meal.snacks.length; i++) {
          // console.log(meal.dinner[i].calories);
          totalCalories += parseInt(meal.snacks[i].calories)
        }
        counter++;
        console.log('this is total calories for the day ' + totalCalories);
        res.send(totalCalories.toString())
      }
    })
  })
});




// Gets user and get the specific meal by the date and mealtime
router.get('/user/meal/:month/:day/:year/:meal', function(req, res) {
  // console.log(req.body)
  var date = new Date(req.params.month + ' ' + req.params.day + ', ' + req.params.year);
  // console.log(date);
  // var date1 = new Date("October 13, 2014"); // sample date for testing
  // date1 = Date.parse(d); // parses date to string
  // console.log(d);
  User.findById(req.user.id).then(function(user) { //finds user by ID
    // res.send(user);
    // console.log(user);
    user.meals.forEach(function(meal){ //searches through user meals

  
      // console.log("this is the meal " + meal);
      // console.log(typeof meal.date);
      // console.log(typeof date);
      // console.log("date one is " + date);
      // console.log("date two is " + meal.date)
      var mealTime = req.params.meal;
      // console.log('This is the meal time ' + mealTime)
      // console.log(mealTime);
      // console.log(meal.breakfast)
      // console.log(typeof d);
      if(meal.date.getTime() == date.getTime() && mealTime === 'breakfast'){ //compares the date
        console.log('this is breakfast ' + meal.breakfast)
        res.send(meal.breakfast);
        // console.log(meal);
      } else if(meal.date.getTime() == date.getTime() && mealTime === 'lunch'){ //compares the date
        console.log('this is lunch ' + meal.lunch) 
        res.send(meal.lunch);
        // console.log(meal);
      } else if(meal.date.getTime() == date.getTime() && mealTime === 'dinner'){ //compares the date
        console.log('this is dinner ' + meal.dinner)
        res.send(meal.dinner); 
        // console.log(meal);
      } else if (meal.date.getTime() == date.getTime() && mealTime === 'snacks'){ //compares the date
        console.log('this is snack ' + meal.snacks) 
        res.send(meal.snacks);
        // console.log(meal);
      }
    })
  })
});

// Gets user and get the specific meal by the date
router.post('/user/date/', function(req, res) {
  // console.log(req.params.date);
  console.log(req.body)
  var date = new Date(req.body.month + ' ' + req.body.day + ', ' + req.body.year);
  console.log(date);
  // var date1 = new Date("October 13, 2014"); // sample date for testing
  // date1 = Date.parse(d); // parses date to string
  // console.log(d);
  User.findById(req.user.id).then(function(user) { //finds user by ID
    // res.send(user);
    console.log(user);
    user.meals.forEach(function(meal){ //searches through user meals
      console.log("this is the meal " + meal);
      console.log(typeof meal.date);
      console.log(typeof date);
      console.log("date one is " + date);
      console.log("date two is " + meal.date)
      // console.log(typeof d);
      if(meal.date = date){ //compares the date
        console.log('this is the meal ' + meal) 
        // console.log(meal);
      }
    })
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