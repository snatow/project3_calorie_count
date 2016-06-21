![alt text](https://github.com/snatow/project3_calorie_count/blob/master/public/images/fork_logo_small.png)
## The Best Fwarking Calorie Counting App 

[The Best Fwarking Calorie Counting App](https://fork-calorie-counter-app.herokuapp.com/)

### Description


### Tech Used
- HTML
- CSS
- Node.js
- Express.js
- React
- jQuery
- Passport
- Jwt Tokens
- USDA API

### Features

Without User Authentication
- Visitors to the app can search through the USDA database for individual foods based on key word searches. A list of results will render, and the visitor can click on individual intems in the results to see different portion sizes and the number of calories in each portion. 

With User Authentication
- Visitors can become users by creating user accounts with unique usernames, emails and passwords and record the maximum number of calories that they wish to consume in a given day. A user, once logged in, will see how many calories they would like to consume on a given day plus a date picker that will allow them to select a day for which to create a food log. 
- Once a date is selected, the user can choose between different food logs for Breakfast, Lunch, Dinner and Snacks. With a particular meal displaying, the user can query the USDA database for foods they are eating for those meals on that day and click on the portion size to add that amount of that food to that meal for that day. If a food is added in err, the user can click on that food in the meal and remove it from the meal in the database. 
- Each meal displayed will also include the number of calories represented by all of the foods logged in that meal, as well as the total number of calories logged for that day across all meals. As foods are added and removed from meals, both totals will automatically update. 
- At any given time a user can retrieve days from the past to see what they logged into their meals on those days and make updates as they deem necessary. 

### Future Implementations
- Future versions of this app will utilize the email supplied by the user to send a final food report at the end of each day to the user's inbox. Additionally, days in the past will be viewable, but not editable. 