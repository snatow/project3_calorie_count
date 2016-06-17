var express = require('express');
var app = express();
var logger = require('morgan');
var port = process.env.PORT || 3000

app.use(logger('dev'));


var testController = require('./controllers/test.js');
app.use('/', testController);


app.listen(port, function() {
  console.log('we are listening on ' + port)
})