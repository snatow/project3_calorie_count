//=========================================================================
//  Global Variables
//=========================================================================
var month = 'January'
var day = '1'
var year = '2016'
var meal = 'breakfast'

// var today = new Date();
// //console.log("today: " + today);
// var month = 'January';
// var day = '1';
// var year = 2016;

//=========================================================================
  //  Main Component - this will render all of the react classes for the app
//=========================================================================
var CalorieApp = React.createClass({
  // callback: function() {
  //   var toggler = !(this.state.toggle);
  //   this.setState({toggle: toggler});
  // },
  //this is for user auth - it will check for the cookie in the browser
  getInitialState: function() {
    var cookieCheck;
    if(document.cookie) {
      cookieCheck = true;
    } else {
      cookieCheck = '';
    }
    return {
      authenticatedUser: cookieCheck,
      username: "",
      logOutShow: true,
      toggle: false
    };
  },
  //brings forward the username for user experience
  changeLogin: function(data) {
    this.setState({
      authenticatedUser: true,
      username: data.username
    })
  },
  logOutSubmit: function() {
    this.setState({
      authenticatedUser: "",
    })
  },
  logOutToggle: function() {
    var newLogOut = !this.state.logOutShow;
    this.setState({logOutShow: newLogOut})
  },
  render: function() {
    // console.log('authenticatedUser: ', this.state.authenticatedUser);
    // console.log('---------------------');
    // console.log('cookie:', document.cookie);
    if(this.state.authenticatedUser === true) {
      return (
        <div>
          <EditUser logOutToggle={this.logOutToggle} callback={this.callback}/>
          <LogOutComponent 
            username={this.state.username}
            logOutShow={this.state.logOutShow}
            logOutSubmit={this.logOutSubmit} />
          <img src="./images/fork_logo.png"/>
          <h3>The Best Fwoarking Calorie Counting App</h3>
          <Calories username={this.state.username} logOutToggle={this.logOutToggle}/>
          <div className="activity-div">
            <DatePicker />
            <MealParentComponent user={this.state.username} />
          </div>
          {/*<div className="activity-div">
                      <SearchBar user={this.state.username} /> 
                    </div>*/}
        </div>
      )
    } else {
      return (
        <div>
          <LogInSignUp 
            initialLoginCheck={this.state.authenticatedUser} 
            onChange={this.changeLogin} />
          <img src="./images/fork_logo.png"/>
          <h3 className="name">The Best Fwoarking Calorie Counting App</h3>
          <SearchBarPublic />
        </div>
      )
    }
  }
});

//=========================================================================
  //  This is the date picker
//=========================================================================
var DatePicker = React.createClass({
  getInitialState: function() {
    return({month: month, day: day, year: year})
  },
  handleDateSubmit: function(e) {
    e.preventDefault()
    console.log('handling date');
    console.log(this.state);
    day = this.state.day
    month = this.state.month
    year = this.state.year
    console.log(day, year, month)
    this.createDateAJAX();
  },
  handleMonthChange: function(e) {
    console.log(e.target.value)
    this.setState({month: e.target.value})
  },
  handleDayChange: function(e) {
    console.log(e.target.value);
    this.setState({day: e.target.value})
  },
  handleYearChange: function(e) {
    console.log(e.target.value)
    this.setState({year: e.target.value})
  },
  createDateAJAX: function() {
    $.ajax({
      url: '/user/createdate/' + month + '/' + day + '/' + year, 
      method: "post",
      data: this.state,
      success: function(data) {
        // console.log('success for getting calories');
        // console.log(data);
        // console.log(this.state)
        console.log("set date");
      }.bind(this),
      error: function(xhr, status, err) {
        // console.error(status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return(
      <div>
        <form onSubmit={this.handleDateSubmit}>
          <select name="month" onChange={this.handleMonthChange}>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>

           <select name="day" onChange={this.handleDayChange}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
            <option value="16">16</option>
            <option value="17">17</option>
            <option value="18">18</option>
            <option value="19">19</option>
            <option value="20">20</option>
            <option value="21">21</option>
            <option value="22">22</option>
            <option value="23">23</option>
            <option value="24">24</option>
            <option value="25">25</option>
            <option value="26">26</option>
            <option value="27">27</option>
            <option value="28">28</option>
            <option value="29">29</option>
            <option value="30">30</option>
            <option value="31">31</option>
          </select>

          <select name="year" onChange={this.handleYearChange}>
            <option value="2016">2016</option>
            <option value="2017">2017</option>
            <option value="2018">2018</option>
          </select>
      <input className="button" type="Submit"/>
      </form>
      </div>)
  }
})


//=========================================================================
  //  These elements handle the Calories
//=========================================================================
// This will render the calorie tracker that we get from our user.
var Calories = React.createClass({
  getInitialState: function() { //sets the calories to null
    return {calories: null,
      username: ''}
  },
  changeCalories: function() {
    //need to change the state of calories upon adding a food
  },
  callback: function() {
    console.log('calories callback')
  },
  // test: function() {
  //   console.log('test calories works');
  // },
  editedCalories: function() {
    console.log('edited calories works');
    this.getCaloriesAJAX();
  },
  getCaloriesAJAX: function() { //sets the calories for our user
    $.ajax({
      url: '/user/user/calories',
      method: "get",
      success: function(data) {
        // console.log('success for getting calories');
        console.log(data);
        this.setState({calories: data.calories,
                      username: data.username});
        console.log(this.state)
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    if (this.state.calories !== null) {
      return (
        <div className='calories'>
          Hi {this.state.username}, your total calories are for today are {this.state.calories}. {/*prints out the calories*/}
          {/*<GetCalories callback={this.callback}/>*/}
        </div>)
    }
    return (
      <div>
        {this.getCaloriesAJAX()} {/*gets the calories upon render*/}
      </div>)
  }
})

// var GetCalories = React.createClass({
//   getCaloriesAJAX: function() {
//     // console.log('getcalories ajax')
//     // this.props.callback(2);
//   },
//   render: function() {
//     this.getCaloriesAJAX();
//     return (
//       <div> 
//         your face
//       </div>)
//   }
// })


//=========================================================================
  //  These elements will handle user sign up and log in
//=========================================================================

//This component will manage display of both log in and sign up related elements
var LogInSignUp = React.createClass({
  getInitialState: function() {
    return {
      signup: false,
      needLogInForm: false
    }
  },
  logInState: function() {
    this.setState({needLogInForm: true, signup: false})
  },
  signUpState: function() {
    this.setState({signup: true})
  },
  signUpSubmit: function() {
    this.setState({needLogInForm: true, signup: false})
  },
  render: function() {
    if (!this.state.signup && !this.state.needLogInForm) {
      return(
        <div>
          <div className="link log-in-link">
            <h4 onClick={this.logInState}>Log In</h4>
          </div>
          <div className="link">
          <h4 onClick={this.signUpState}>Sign Up</h4>
        </div>
        </div>)
    } else if (this.state.signup && !this.state.needLogInForm) {
      return(
        <div>
          <SignUpComponent signUpSubmit={this.signUpSubmit} />
          <h4 onClick={this.logInState}>Log In</h4>
        </div>)
    } else if (!this.state.signup && this.state.needLogInForm) {
      return(
        <div>
        <LoginComponent 
          initialLoginCheck={this.props.initialLoginCheck}
          onChange={this.props.onChange} />
        </div>)
    }
  }
})

//This component will initially render a log in link on initial state and will
//render a log in form once that link is clicked
var LoginComponent = React.createClass({
  getInitialState: function() {
    return {
      username: this.props.initialLoginCheck,
      password: this.props.initialLoginCheck,
      loginStatus: this.props.initialLoginCheck,
    };
  },
  handleLoginFormChange: function(stateName, e) {
    var change = {};
    change[stateName] = e.target.value;
    this.setState(change);
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var username = this.state.username.trim();
    var password = this.state.password.trim();
    this.loginAJAX(username, password);
  },
  loginAJAX: function(username, password) {
    $.ajax({
      url: '/auth',
      method: "POST",
      data: {
        username: username,
        password: password
      },
      success: function(data) {
        console.log('Cookie Monster');
        Cookies.set('jwt_token', data.token);
        console.log(data);
        this.props.onChange(data)
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="login-form" >
        <h3>Please Login</h3>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="username">Username</label>
          <input type="text" value={this.state.username} onChange={this.handleLoginFormChange.bind(this, 'username')}/>
          <br/>
          <label htmlFor="password">Password</label>
          <input type="password" value={this.state.password} onChange={this.handleLoginFormChange.bind(this, 'password')}/>
          <br/>
          <input className="button" type="submit"/>
        </form>
      </div>
    )
  }
})

//This component will initially render a sign up link on initial state and will
//render a sign up form once that link is clicked
var SignUpComponent = React.createClass({
  getInitialState: function() {
    return {
      username: "",
      email: "",
      password: "",
      calories: "",
    };
  },
  handleSignupFormChange: function(stateName, e) {
    var change = {};
    change[stateName] = e.target.value;
    this.setState(change);
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var username = this.state.username.trim();
    var email = this.state.email.trim();
    var password = this.state.password.trim();
    var calories = this.state.calories.trim();
    this.signupAJAX(username, email, password, calories);
    this.props.signUpSubmit();
    this.setState({
      username: "",
      email: "",
      password: "",
      calories: "",
      signup: false
    })
  },
  signupAJAX: function(username, email, password, calories) {
    $.ajax({
      url: '/user',
      method: "POST",
      data: {
        username: username,
        email: email,
        password: password,
        calories: calories
      },
      success: function(data) {
        console.log('new user created');
        console.log(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="signup-form">
        <h3>Sign Up</h3>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="username">Username</label>
          <input 
            type="text" 
            value={this.state.username} 
            onChange={this.handleSignupFormChange.bind(this, 'username')}/><br/>
          <label htmlFor="email">Email</label>
          <input 
            type="text" 
            value={this.state.email} 
            onChange={this.handleSignupFormChange.bind(this, 'email')}/><br/>
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            value={this.state.password} 
            onChange={this.handleSignupFormChange.bind(this, 'password')}/><br/>
          <label htmlFor="calories">Max Calories Per Day</label>
          <input 
            type="number" 
            value={this.state.calories} 
            onChange={this.handleSignupFormChange.bind(this, 'calories')}/><br/>
            <input className="button" type="submit"/>
        </form>
      </div>)
  }
})

//=========================================================================
  //  This element will allow the user to edit his or her user account
//=========================================================================

var EditUser = React.createClass({
  getInitialState: function() {
    return {
      editForm: false,
      id: "",
      username: "",
      email: "",
      calories: ""
    }
  },
  handleSignupFormChange: function(stateName, e) {
    var change = {};
    change[stateName] = e.target.value;
    this.setState(change);
    console.log(this.state);
  },
  handleFormSubmit: function(e) {
    e.preventDefault();
    this.props.logOutToggle();
    var id = this.state.id;
    console.log("this is id: " + id)
    var username = this.state.username.trim();
    var email = this.state.email.trim();
    var calories = this.state.calories.trim();
    this.editUserAJAX(username, email, calories);
    this.setState({
      username: "",
      email: "",
      calories: "",
      editForm: false
    })
  },
  editUserAJAX: function(username, email, calories) {
    $.ajax({
      url: '/user/edit/',
      method: "PUT",
      data: {
        username: username,
        email: email,
        calories: calories
      },
      success: function(data) {
        console.log('user updated');
        console.log(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  },
  showEditForm: function() {
    this.props.logOutToggle();
    var self = this;
    $.ajax({
      url: "/user/user",
      method: "GET",
      success: function(data) {
        console.log(data);
        var number = data.calories.toString();
        console.log(number);
        self.setState({
          id: data.id,
          username: data.username,
          email: data.email,
          calories: number
        })
      }//.bind(this)
    })
    this.setState({editForm: true})
  },
  handleSubmit: function() {
    console.log("submit");
    // this.props.callback();
  },
  render: function() {
    if (this.state.editForm) {
      return(
        <div>
          <h4>Edit</h4>
          <form onSubmit={this.handleFormSubmit}>
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              value={this.state.username} 
              onChange={this.handleSignupFormChange.bind(this, 'username')}/><br/>
            <label htmlFor="email">Email</label>
            <input 
              type="text" 
              value={this.state.email} 
              onChange={this.handleSignupFormChange.bind(this, 'email')}/><br/>
            <label htmlFor="calories">Max Calories Per Day</label>
            <input 
              type="number" 
              value={this.state.calories} 
              onChange={this.handleSignupFormChange.bind(this, 'calories')}/><br/>
              <input className="button" type="submit"/>
          </form>
        </div>)
    } else {
      return(
        <div className="edit-link">
          <h4 onClick={this.showEditForm}>Edit Your Account</h4>
        </div>)
    }
  }
})

//=========================================================================
  //  This is the log out element
//=========================================================================

var LogOutComponent = React.createClass({
  getInitialState: function() {
    return {
      loggedIn: true,
      username: this.props.username
    }
  },
  logOut: function() {
    console.log("logout")
    Cookies.remove("jwt_token")
    this.setState({
      loggedIn: false
    })
    this.props.logOutSubmit();
  },
  render: function() {
    if (this.state.loggedIn && this.props.logOutShow) {
      return (
        <div className="log-out">
          <h4 onClick={this.logOut}>Log Out</h4>
        </div>
      )
    } else if (this.state.loggedIn && !this.props.logOutShow) {
      return (
        <div>
        </div>
      )
    } else {
      return(<div></div>)
    }
  }
})

//=========================================================================
  //  These elements will render a user's meals - they are only visable on
  //if the user is logged in
//=========================================================================

var MealParentComponent = React.createClass({
  changeInitialCalories: function (){
    console.log('change initial calories');
    console.log(this.state.meal);
    var cals = 0;
    this.state.meal.forEach(function(meal) {
      cals += parseInt(meal.calories)
    });
    console.log(cals);
    this.setState({calories: cals})
  },
  // changeTotalCalories: function (){
  //   console.log('change total calories');
  //   console.log(this.state.meal);
   
  //   console.log(cals);
  //   this.setState({calories: cals})
  // },
  callback: function() {
    console.log('meal parent callback')
    // var toggler = !(this.state.toggle);
    // console.log(toggler)
    // this.setState({toggle: toggler})
    console.log(this.state)
    if (this.state.showBreakfast == true) {
      this.showBreakfastToggle();
    } else if (this.state.showLunch == true){
       this.showLunchToggle();
    } else if (this.state.showDinner == true){
       this.showDinnerToggle();
    } else if (this.state.showSnacks == true){
       this.showSnacksToggle();
    }
  },
  getInitialState: function() {
    return {
      showBreakfast: false,
      showLunch: false,
      showDinner: false,
      showSnacks: false,
      meal: [],
      calories: 0,
      totalCalories: 0,
      toggle: false,
      refreshser: this.props.toggle,
    }
  },
  showBreakfastToggle: function() {
    //console.log('breakfast toggle')
    this.setState({
      showBreakfast: true,
      showLunch: false,
      showDinner: false,
      showSnacks: false
    })
    meal = 'breakfast';
    this.getMealsAJAX()
  },
  showLunchToggle: function() {
    this.setState({
      showBreakfast: false,
      showLunch: true,
      showDinner: false,
      showSnacks: false
    })
    meal = 'lunch';
    this.getMealsAJAX()
  },
  showDinnerToggle: function() {
    this.setState({
      showBreakfast: false,
      showLunch: false,
      showDinner: true,
      showSnacks: false
    })
    meal = 'dinner'
    this.getMealsAJAX()
  },
  showSnacksToggle: function() {
    this.setState({
      showBreakfast: false,
      showLunch: false,
      showDinner: false,
      showSnacks: true
    })
    meal = 'snacks';
    this.getMealsAJAX()
  },
  getTotalCaloriesAJAX: function() {
    $.ajax({
      url: '/user/user/mealcalories/' + month + '/' + day + '/' + year + '/' + meal,
      method: "get"}).done(function(data) {
        console.log('the data for total calories is ' + data);
        console.log(data);
        this.setState({totalCalories: data})
        console.log(this.state);
        // this.changeInitialCalories();
        // this.changeTotalCalories();
        // this.getTotalCaloriesAJAX();
      }.bind(this)).fail(function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this))
  },
  getMealsAJAX: function() {
    $.ajax({
      url: '/user/user/meal/' + month + '/' + day + '/' + year + '/' + meal,
      method: "get"}).done(function(data) {
        console.log(data);
        this.setState({meal: data})
        console.log(this.state);
        this.changeInitialCalories();
        // this.changeTotalCalories();
        this.getTotalCaloriesAJAX();
      }.bind(this)).fail(function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this))
  },
  render: function() {
    if (!this.state.showBreakfast && !this.state.showLunch && !this.state.showDinner && !this.state.showSnacks) {
      return(
        <div className="meals-all">
          <div className="meal-nav-bar">
            <div className="meal-label" onClick={this.showBreakfastToggle}>Breakfast</div>
            <div className="meal-label" onClick={this.showLunchToggle}>Lunch</div>
            <div className="meal-label" onClick={this.showDinnerToggle}>Dinner</div>
            <div className="meal-snacks" onClick={this.showSnacksToggle}>Snacks</div>
          </div>
          <div className="search-empty">
            <div className="empty"></div>
            <SearchBar 
              user={this.props.username}
              callback={this.callback} />
          </div>
        </div>)
    } 
    else if (this.state.showBreakfast) {
      return(
        <div className="meals-all">
          <div className="meal-nav-bar">
            <div className="meal-label" onClick={this.showBreakfastToggle}>Breakfast</div>
            <div className="meal-label" onClick={this.showLunchToggle}>Lunch</div>
            <div className="meal-label" onClick={this.showDinnerToggle}>Dinner</div>
            <div className="meal-snacks" onClick={this.showSnacksToggle}>Snacks</div>
          </div>
          <BreakfastComponent meal={this.state.meal} 
                          calories={this.state.calories} 
                          callback={this.callback}
                          totalCalories={this.state.totalCalories} />
          <SearchBar 
            user={this.props.username}
            callback={this.callback} />
        </div>)
    } 
    else if (this.state.showLunch) {
      return(
        <div className="meals-all">
          <div className="meal-nav-bar">
            <div className="meal-label" onClick={this.showBreakfastToggle}>Breakfast</div>
            <div className="meal-label" onClick={this.showLunchToggle}>Lunch</div>
            <div className="meal-label" onClick={this.showDinnerToggle}>Dinner</div>
            <div className="meal-snacks" onClick={this.showSnacksToggle}>Snacks</div>
          </div>
          <LunchComponent meal={this.state.meal} 
                    calories={this.state.calories} 
                    callback={this.callback}
                    totalCalories={this.state.totalCalories} />
          <SearchBar 
            user={this.props.username}
            callback={this.callback} />
        </div>)
    } else if (this.state.showDinner) {
      return(
        <div className="meals-all">
          <div className="meal-nav-bar">
            <div className="meal-label" onClick={this.showBreakfastToggle}>Breakfast</div>
            <div className="meal-label" onClick={this.showLunchToggle}>Lunch</div>
            <div className="meal-label" onClick={this.showDinnerToggle}>Dinner</div>
            <div className="meal-snacks" onClick={this.showSnacksToggle}>Snacks</div>
          </div>
          <DinnerComponent meal={this.state.meal} 
                        calories={this.state.calories} 
                        callback={this.callback}
                        totalCalories={this.state.totalCalories} />
          <SearchBar 
            user={this.props.username}
            callback={this.callback} />
        </div>)
    } else if (this.state.showSnacks) {
      return(
        <div className="meals-all">
          <div className="meal-nav-bar">
            <div className="meal-label" onClick={this.showBreakfastToggle}>Breakfast</div>
            <div className="meal-label" onClick={this.showLunchToggle}>Lunch</div>
            <div className="meal-label" onClick={this.showDinnerToggle}>Dinner</div>
            <div className="meal-snacks" onClick={this.showSnacksToggle}>Snacks</div>
          </div>
          <SnacksComponent meal={this.state.meal} 
                        calories={this.state.calories} 
                        callback={this.callback}
                        totalCalories={this.state.totalCalories} />
          <SearchBar 
            user={this.props.username}
            callback={this.callback} />
        </div>)
    }
  }
})

var BreakfastComponent = React.createClass({
  callback: function() {
    console.log('breakfast callback')
    // var toggler = !(this.state.toggle);
    // console.log(toggler)
    // this.setState({toggle: toggler})
    // console.log(this.state.toggle)
    this.props.callback();
  },
  getInitialState: function() {
    return {calories: 0,
            toggle: false}
  },
  changeInitialCalories: function (){
    console.log('change initial calories');
    console.log(this.props.meal);
    this.setState({calories: this.props.calories})
  },
  render: function() {
    //console.log("in the breakfast component: ");
    //console.log(this.props.meal);
    //console.log(this.state)
    //console.log(this.props.calories);
    var self = this;
    // this.changeInitialCalories();
    var mealList = this.props.meal
    var renderMealList = function(item) {
      return(
        <BreakfastList callback={self.callback}>{item}</BreakfastList>)
    }
    return (
      <div className="meal-display">
        <p>Breakfast List</p>
        <ul>{mealList.map(renderMealList)}</ul>
        <p>Total calories from breakfast: {this.props.calories}</p>
        <p>Total calories consumed for the day: {this.props.totalCalories}</p>
      </div>)
  }
})

var LunchComponent = React.createClass({
  callback: function() {
    console.log('lunch callback')
    // var toggler = !(this.state.toggle);
    // console.log(toggler)
    // this.setState({toggle: toggler})
    // console.log(this.state.toggle)
    this.props.callback();
  },
  render: function() {
    console.log("in the lunch component: ")
    console.log(this.props.meal);
    var self = this;
    var mealList = this.props.meal
    var renderMealList = function(item) {
      return(
        <LunchList callback={self.callback}>{item}</LunchList>)
    }
    return (
      <div className="meal-display">
        <p>Lunch List</p>
        <ul>{mealList.map(renderMealList)}</ul>
        <p>Total calories from lunch: {this.props.calories}</p>
        <p>Total calories consumed for the day: {this.props.totalCalories}</p>
      </div>)
  }
})

var DinnerComponent = React.createClass({
  callback: function() {
    console.log('dinner callback')
    // var toggler = !(this.state.toggle);
    // console.log(toggler)
    // this.setState({toggle: toggler})
    // console.log(this.state.toggle)
    this.props.callback();
  },
  render: function() {
    console.log("in the dinner component: ")
    console.log(this.props.meal);
    var self = this;
    var mealList = this.props.meal
    var self = this;
    var renderMealList = function(item) {
      return(
        <DinnerList callback={self.callback}>{item}</DinnerList>)
    }
    return (
      <div className="meal-display">
        <p>Dinner List</p>
        <ul>{mealList.map(renderMealList)}</ul>
        <p>Total calories from dinner: {this.props.calories}</p>
        <p>Total calories consumed for the day: {this.props.totalCalories}</p>
      </div>)
  }
})

var SnacksComponent = React.createClass({
  callback: function() {
    console.log('breakfast callback')
    // var toggler = !(this.state.toggle);
    // console.log(toggler)
    // this.setState({toggle: toggler})
    // console.log(this.state.toggle)
    this.props.callback();
  },
  getInitialState: function() {
    return {calories: 0}
  },
  render: function() {
    console.log("in the snacks component: ")
    console.log(this.props.meal);
    var mealList = this.props.meal
    var self = this;
    var renderMealList = function(item) {
      return(
        <SnackList callback={self.callback}>{item}</SnackList>)
    }
    return (
      <div className="meal-display">
        <p>Snacks List</p>
        <ul>{mealList.map(renderMealList)}</ul>
        <p>Total calories from snacks: {this.props.calories}</p>
        <p>Total calories consumed for the day: {this.props.totalCalories}</p>
      </div>)
  }
})

// var MealList = React.createClass({
//   callback: function() {
//     console.log('meallist callback');
//     // var toggler = !(this.state.toggle);
//     // console.log(toggler)
//     // this.setState({toggle: toggler})
//     this.props.callback();
//   },
//   getInitialState: function() {
//     return {toggle: false}
//   },
//   removeFood: function() {
//     console.log("removing");
//     console.log(this.props.children);
//     var self = this;
//     //var timeOutId = 0;
//     $.ajax({
//       url: '/user/removefood/' + month + '/' + day + '/' + year + '/' + meal,
//       method: 'put',
//       data: {food: this.props.children},
//       success: function(){
//         console.log('success')
//         self.callback();
//       },
//       // timeout: 1
//     })
//   },
//   render: function() {
//     var foodItem = this.props.children.food;
//     console.log(this.props.children);
//     return(
//       <div>
//         <li onClick={this.removeFood}> {this.props.children.qty} {this.props.children.measurement} of {this.props.children.food} is {this.props.children.calories} calories
//         </li>
//       </div>)
//   }
// })

var BreakfastList = React.createClass({
  callback: function() {
    console.log('breakfast callback');
    // var toggler = !(this.state.toggle);
    // console.log(toggler)
    // this.setState({toggle: toggler})
    this.props.callback();
  },
  getInitialState: function() {
    return {toggle: false}
  },
  removeFood: function() {
    console.log("removing from breakfast");
    console.log(this.props.children);
    var self = this;
    //var timeOutId = 0;
    $.ajax({
      url: '/user/removefood/' + month + '/' + day + '/' + year + '/breakfast',
      method: 'put',
      data: {food: this.props.children},
      success: function(){
        console.log('success')
        self.callback();
      },
      // timeout: 1
    })
  },
  render: function() {
    var foodItem = this.props.children.food;
    console.log(this.props.children);
    return(
      <div>
        <li onClick={this.removeFood}> {this.props.children.qty} {this.props.children.measurement} of {this.props.children.food} is {this.props.children.calories} calories
        </li>
      </div>)
  }
})

var LunchList = React.createClass({
  callback: function() {
    console.log('lunch callback');
    // var toggler = !(this.state.toggle);
    // console.log(toggler)
    // this.setState({toggle: toggler})
    this.props.callback();
  },
  getInitialState: function() {
    return {toggle: false}
  },
  removeFood: function() {
    console.log("removing from breakfast");
    console.log(this.props.children);
    var self = this;
    //var timeOutId = 0;
    $.ajax({
      url: '/user/removefood/' + month + '/' + day + '/' + year + '/lunch',
      method: 'put',
      data: {food: this.props.children},
      success: function(){
        console.log('success')
        self.callback();
      },
      // timeout: 1
    })
  },
  render: function() {
    var foodItem = this.props.children.food;
    console.log(this.props.children);
    return(
      <div>
        <li onClick={this.removeFood}> {this.props.children.qty} {this.props.children.measurement} of {this.props.children.food} is {this.props.children.calories} calories
        </li>
      </div>)
  }
})

var DinnerList = React.createClass({
  callback: function() {
    console.log('dinner callback');
    // var toggler = !(this.state.toggle);
    // console.log(toggler)
    // this.setState({toggle: toggler})
    this.props.callback();
  },
  getInitialState: function() {
    return {toggle: false}
  },
  removeFood: function() {
    console.log("removing from breakfast");
    console.log(this.props.children);
    var self = this;
    //var timeOutId = 0;
    $.ajax({
      url: '/user/removefood/' + month + '/' + day + '/' + year + '/dinner',
      method: 'put',
      data: {food: this.props.children},
      success: function(){
        console.log('success')
        self.callback();
      },
      // timeout: 1
    })
  },
  render: function() {
    var foodItem = this.props.children.food;
    console.log(this.props.children);
    return(
      <div>
        <li onClick={this.removeFood}> {this.props.children.qty} {this.props.children.measurement} of {this.props.children.food} is {this.props.children.calories} calories
        </li>
      </div>)
  }
})


var SnackList = React.createClass({
  callback: function() {
    console.log('snacks callback');
    // var toggler = !(this.state.toggle);
    // console.log(toggler)
    // this.setState({toggle: toggler})
    this.props.callback();
  },
  getInitialState: function() {
    return {toggle: false}
  },
  removeFood: function() {
    console.log("removing from breakfast");
    console.log(this.props.children);
    var self = this;
    //var timeOutId = 0;
    $.ajax({
      url: '/user/removefood/' + month + '/' + day + '/' + year + '/snacks',
      method: 'put',
      data: {food: this.props.children},
      success: function(){
        console.log('success')
        self.callback();
      },
      // timeout: 1
    })
  },
  render: function() {
    var foodItem = this.props.children.food;
    console.log(this.props.children);
    return(
      <div>
        <li onClick={this.removeFood}> {this.props.children.qty} {this.props.children.measurement} of {this.props.children.food} is {this.props.children.calories} calories
        </li>
      </div>)
  }
})


//=========================================================================
  //  These are the search elements
//=========================================================================


//Search bar when you are logged in
var SearchBar = React.createClass({
  getInitialState: function() {
    return {
      searchTerm: "",
      data: null,
      foodList: null,
      refresher: false,
    }
  },
  showMealParent: function() {
    this.setState({refresher: true});
    console.log(this.state)
  },
  foodListStateChange: function(data) {
    //console.log('hey we made it back to searchbar ');
    //console.log(data);
    this.setState({foodList: data})
  },
  searchChange: function(e) {
    this.setState({searchTerm: e.target.value})
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var searchTerm = this.state.searchTerm.trim();
    console.log(searchTerm);
    this.searchTermAjax(searchTerm);
    this.setState({searchTerm: ""})
  },
  //ajax to server get request for API
  searchTermAjax: function(item) {
    $.ajax({
      url: "/user/search/" + item,
      method: "GET",
      success: function(data) {
        console.log(data);
        this.setState({data: data})
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    })
  },
  render: function() {
    //console.log('props of user ')
    //console.log(this.props.user);
    //this renders the search bar
    if (this.state.refresher === false) {
      return(
        <div className="search-bar">
         {/*<MealParentComponent toggle={this.state.refresher}/>*/}
          <form onSubmit={this.handleSubmit}>
            <label className="search-label" htmlFor="search">Search Foods</label>
            <input 
              type="text" 
              placeholder="search term"
              value={this.state.searchTerm} 
              onChange={this.searchChange}/>
            <input className="search-button" type="submit"/>
          </form>
          <FirstList 
            data={this.state.data}
            onSubmit={this.foodListStateChange}/>
          <RenderFoodContainer 
            data={this.state.foodList} 
            callback={this.showMealParent}
            callback2={this.props.callback} />
        </div>)
    } else {
      return(
        <div className="search-bar">
        {/*<MealParentComponent toggle={this.state.refresher}/>*/}
          <form onSubmit={this.handleSubmit}>
            <label className="search-label" htmlFor="search">Search Foods</label>
            <input 
              type="text" 
              placeholder="search term"
              value={this.state.searchTerm} 
              onChange={this.searchChange}/>
            <input className="search-button" type="submit"/>
          </form>
          <FirstList 
            data={this.state.data}
            onSubmit={this.foodListStateChange}/>
          <RenderFoodContainer 
            data={this.state.foodList} 
            callback={this.showMealParent}
            callback2={this.props.callback} />
        </div>)
    }
  }
})

// Search bar when not logged in
var SearchBarPublic = React.createClass({
  getInitialState: function() {
    return {
      searchTerm: "",
      data: null,
      foodList: null,
      refresher: false,
    }
  },
  foodListStateChange: function(data) {
    //console.log('hey we made it back to searchbar ');
    //console.log(data);
    this.setState({foodList: data})
  },
  searchChange: function(e) {
    this.setState({searchTerm: e.target.value})
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var searchTerm = this.state.searchTerm.trim();
    console.log(searchTerm);
    this.searchTermAjax(searchTerm);
    this.setState({searchTerm: ""})
  },
  //ajax to server get request for API
  searchTermAjax: function(item) {
    $.ajax({
      url: "/user/search/" + item,
      method: "GET",
      success: function(data) {
        console.log(data);
        this.setState({data: data})
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    })
  },
  render: function() {
    console.log('props of user ')
    console.log(this.props.user);
    //this renders the search bar
    if (this.state.refresher === false) {
      return(
        <div className="search-bar-public">
          <form onSubmit={this.handleSubmit}>
            <label className="search-label" htmlFor="search">Search Foods</label>
            <input 
              type="text" 
              placeholder="search term"
              value={this.state.searchTerm} 
              onChange={this.searchChange}/>
            <input className="button" type="submit"/>
          </form>
          <FirstList 
            data={this.state.data}
            onSubmit={this.foodListStateChange}/>
          <RenderFoodContainer data={this.state.foodList} />
        </div>)
    } else {
      return(
        <div className="search-bar">
          <form onSubmit={this.handleSubmit}>
            <label className="search-label" htmlFor="search">Search Foods</label>
            <input 
              type="text" 
              placeholder="search term"
              value={this.state.searchTerm} 
              onChange={this.searchChange}/>
            <input className="button" type="submit"/>
          </form>
          <FirstList 
            data={this.state.data}
            onSubmit={this.foodListStateChange}/>
          <RenderFoodContainer data={this.state.foodList} />
        </div>)
    }
  }
})

//Div to render initial search results - foods based on search term
var FirstList = React.createClass({
  sendDataToSearchBar: function(data) {
    console.log('first list data is:')
    console.log(data);
    this.props.onSubmit(data)
  },
  render: function() {
    var self = this;
    if (this.props.data) {
      var createItems = function(item) {
        // console.log(item);
        return(
          <NamesItem onSubmit={self.sendDataToSearchBar} ndbno={item.ndbno}>{item.name}</NamesItem>)
      }
      return(
      <div className="first-results">
        {this.props.data.map(createItems)}
      </div>)
    } else {
      return(<div></div>)
    }
    
  }
})

var NamesItem = React.createClass({
  getInitialState: function() {
    return{
      click: false,
      data: null
    }
  },
  sendDataToFirstList: function(data) {
    console.log(data);
    this.props.onSubmit(data)
  },
  handleClick: function(e) {
    e.preventDefault();
    console.log(this.props.ndbno);
    this.secondAjax(this.props.ndbno);
  },
  secondAjax: function(id) {
    $.ajax({
      url: "/user/search/item/" + id,
      method: "GET",
      success: function(data) {
        console.log(data);
        console.log(typeof data);
        this.setState({data: data})
        this.sendDataToFirstList(data);
        console.log(this.state);
      }.bind(this)
      //need error handling
    })
  },
  render: function() {
    return(
      <div>
        <div>
        <p onClick={this.handleClick}>{this.props.children}</p>
        </div>
      </div>)
  }
})

//Div to render secondary search results - portions with calories
var RenderFoodContainer = React.createClass({
  callback: function() {
    console.log('RenderFoodContainer callback');
    this.props.callback();
  },
  callback2: function() {
    this.props.callback2();
  },
  render: function() {
    // console.log(this.props.data);
    if (this.props.data) {
      console.log("inside render food container");
      console.log(this.props.data);
      return(<div className="Food-container"><RenderFood food={this.props.data} callback={this.callback} callback2={this.callback2}/></div>)
    } else {
      return(<div></div>)
    }
  }
})

var RenderFood = React.createClass({
  callback: function() {
    console.log('render food callback')
    this.props.callback();
  },
  callback2: function() {
    this.props.callback2();
  },
  appendMeal: function(qty) {
    console.log("adding to current meal");
    // console.log(qty, label, calorie)
    //we need to invoke a callback here that goes to meal parent component
  },
  render: function() {
    console.log('renderfood works')
    console.log(this.props.food);
    var self = this;
    var calories = this.props.food.calories.map(function(measurement) {
      console.log(measurement)
      return(
        <RenderFood2 food={measurement} name={self.props.food.name} callback={self.callback} callback2={self.callback2}/>)
      // return (<li 
      //           data-label={measurement.label} 
      //           onClick={self.appendMeal}
      //         >{measurement.qty} {measurement.label} is {measurement.value} calories</li>)
    })
    return(
      <div>
        <p>Name: {this.props.food.name}</p>
        <p>Calories: <ul>{calories}</ul> </p>
      </div>)
  }
})

var RenderFood2 = React.createClass({
  callback: function() {
    console.log('renderfood2 callback');
    this.props.callback();
  },
  callback2: function() {
    this.props.callback2();
  },
  // findUser: function() {
  //   $.ajax({
  //     url: '/user/user',
  //     method: 'get',
  //     success: function(data){
  //       console.log('this is the user: ')
  //       console.log(data);
  //     }
  //   })
  // },
  foodData: function() {
    var self = this;
    console.log(this.props.food);

    $.ajax({
      url: '/user/addfood/' + month + '/' + day + '/' + year + '/' + meal,
      method: 'put',
      data: {food: this.props.food, 
            name: this.props.name}
          }).done(function(data){
        console.log('success')
        console.log(data);
        self.callback();
        self.callback2();
      }
    )
  },
  render: function() {
    return(
      <li onClick={this.foodData}>
        {this.props.food.qty} {this.props.food.label} is {this.props.food.value} calories
      </li>)
  }
})


ReactDOM.render(<CalorieApp/>, document.getElementById('main-container'));
