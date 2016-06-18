//=========================================================================
  //  Main Component - this will render all of the react classes for the app
//=========================================================================
var CalorieApp = React.createClass({
  //this is for user auth - it will check for the cookie in the browser
  getInitialState: function() {
    var cookieCheck;
    if(document.cookie) {
      cookieCheck = true;
    } else {
      cookieCheck = '';
    }
    return {
      puppies: [],
      authenticatedUser: cookieCheck,
      username: ""
    };
  },
  //brings forward the username for user experience
  changeLogin: function(data) {
    this.setState({
      authenticatedUser: true,
      username: data.username
    })
  },
  render: function() {
    // console.log('authenticatedUser: ', this.state.authenticatedUser);
    // console.log('---------------------');
    // console.log('cookie:', document.cookie);
    if(this.state.authenticatedUser === true) {
      return (
        //this is placeholder for now - used homework example
        <HelloUser username={this.state.username} />
      )
    } else {
      return (
        <div>
          <LogInSignUp 
            initialLoginCheck={this.state.authenticatedUser} 
            onChange={this.changeLogin} />
          {/*<SignUpComponent />
                    <LoginComponent
                    initialLoginCheck={this.state.authenticatedUser} 
                    onChange={this.changeLogin} />*/}
          <h3 className="name">The Best Fwoarking Calorie Counting App</h3>
          <img src="./images/fork_logo.png"/>
          <SearchBar />
        </div>
      )
    }
  }
});

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
    this.setState({needLogInForm: true})
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
      // needLogInForm: false
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
  // logInState: function() {
  //   this.setState({needLogInForm: true})
  // },
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
    // if (!this.state.needLogInForm) {
    //   //this renders the log in link (or what will look like a link to the user)
    //   return(
    //     <div className="link log-in-link">
    //       <h4 onClick={this.logInState}>Log In</h4>
    //     </div>)
    // } else {
      //This renders the log in form
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
   // } 
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
      // signup: false
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
  // signUpState: function() {
  //   this.setState({signup: true})
  // },
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
    // if (!this.state.signup) {
    //   return (
    //     <div className="link">
    //       <h4 onClick={this.signUpState}>Sign Up</h4>
    //     </div>)
    // } else {
      //This renders the sign up form
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
 // }
})

//=========================================================================
  //  This element will allow the user to edit his or her user account
//=========================================================================

var EditUser = React.createClass({
  getInitialState: function() {
    return {editForm: false}
  },
  showEditForm: function() {
    this.setState({editForm: true})
  },
  render: function() {
    if (this.state.editForm) {
      return(
        <div>something</div>)
    } else {
      return(
        <div className="edit-link">
          <h4 onClick={this.showEditForm}>Edit Your Account</h4>
        </div>)
    }
  }
})

//=========================================================================
  //  These are the search elements
//=========================================================================


//Search bar
var SearchBar = React.createClass({
  getInitialState: function() {
    return {
      searchTerm: "",
      data: null,
      foodList: null
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
    //this renders the search bar
    return(
      <div className="search-bar">
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="search">Search</label>
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
{/*        <div>
        <RenderFoodContainer data={this.state.data} />
        </div>*/}
      </div>)
  }
})

//Div to render secondary search results - portions with calories
var RenderFoodContainer = React.createClass({
  render: function() {
    // console.log(this.props.data);
    if (this.props.data) {
      console.log("inside render food container");
      console.log(this.props.data);
      return(<div className="Food-container"><RenderFood food={this.props.data} /></div>)
    } else {
      return(<div></div>)
    }
  }
})

var RenderFood = React.createClass({
  render: function() {
    console.log('renderfood works')
    console.log(this.props.food);
    var calories = this.props.food.calories.map(function(measurement) {
      //console.log(measurement.qty)
      return (<li>{measurement.qty} {measurement.label} is {measurement.value} calories</li>)
    })
    return(
      <div>
        <p>Name: {this.props.food.name}</p>
        <ul>
        </ul>
        <p>Calories: {calories} </p>
      </div>)
  }
})


//=========================================================================
  //  These are other elements 
//=========================================================================

//This is just for testing stuff right now
var HelloUser = React.createClass({
  getInitialState: function() {
    return {
      loggedIn: true
    }
  },
  logOut: function() {
    console.log("logout")
    Cookies.remove("jwt_token")
    this.setState({
      loggedIn: false
    })
  },
  render: function() {
    if (this.state.loggedIn) {
      return (
        <div>
          <h1>Hello {this.props.username}</h1>
          <button onClick={this.logOut}>Log Out</button>
        </div>
      )
    } else {
      return (
        <div>
          <h1>Goodbye {this.props.username}</h1>
        </div>
      )
    }
  }
})


ReactDOM.render(<CalorieApp/>, document.getElementById('main-container'));
