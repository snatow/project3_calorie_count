var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var MealSchema = require('./meal.js').schema;

var UserSchema = mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String },
  calories: Number,
  meals: [MealSchema]
});

UserSchema.pre('save', function(next) {
  if(this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

UserSchema.methods.authenticate = function(passwordTry) {
  return bcrypt.compareSync(passwordTry, this.password);
};

var User = mongoose.model('User', UserSchema);
module.exports = User;
