var mongoose = require('mongoose');

var MealSchema = mongoose.Schema({
  calorie: Number,
  calorieMax: Number,
  date: Date,
  breakfast: Array,
  lunch: Array,
  dinner: Array,
  snacks: Array
});

var Meal = mongoose.model('Meal', MealSchema);

module.exports = Meal;