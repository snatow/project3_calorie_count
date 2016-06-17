// Dependencies
var express = require('express');
var app = express();
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost/calorie_count_app_dev";
var port = process.env.PORT || 3000

// Middleware
app.use(logger('dev'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.use(cookieParser());

mongoose.connect(MONGO_URI);

// Controllers
var userController = require('./controllers/user.js');
app.use('/user', userController);

// use /auth route to login. POST method /auth
var authController = require('./controllers/auth.js')
app.use('/auth', authController);

var seedController = require('./controllers/seed.js');
app.use('/seed', seedController);






// Listener
app.listen(port, function() {
  console.log('we are listening on ' + port)
})