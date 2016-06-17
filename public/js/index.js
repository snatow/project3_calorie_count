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
          <LoginComponent
          initialLoginCheck={this.state.authenticatedUser} 
          onChange={this.changeLogin} />
          <SignUpComponent />
          <SearchBar />
        </div>
      )
    }
  }
});

//=========================================================================
  //  These elements will handle user sign up and log in
//=========================================================================

//This component will initially render a log in link on initial state and will
//render a log in form once that link is clicked
var LoginComponent = React.createClass({
  getInitialState: function() {
    return {
      username: this.props.initialLoginCheck,
      password: this.props.initialLoginCheck,
      loginStatus: this.props.initialLoginCheck,
      needLogInForm: false
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
  logInState: function() {
    this.setState({needLogInForm: true})
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
    if (!this.state.needLogInForm) {
      //this renders the log in link (or what will look like a link to the user)
      return(
        <div className="link log-in-link">
          <p onClick={this.logInState}>Log In</p>
        </div>)
    } else {
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
    } 
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
      signup: false
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
    this.setState({
      username: "",
      email: "",
      password: "",
      calories: "",
      signup: false
    })
  },
  signUpState: function() {
    this.setState({signup: true})
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
    if (!this.state.signup) {
      return (
        <div className="link">
          <p onClick={this.signUpState}>Sign Up</p>
        </div>)
    } else {
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
      data: null
    }
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
        //need to render something with the data - send as props to a child component
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
            onChange={this.searchChange}/><br/>
            <input className="button" type="submit"/>
        </form>
        <FirstList data={this.state.data}/>
      </div>)
  }
})


//Div to render initial search results - foods based on search term
var FirstList = React.createClass({
  render: function() {
    if (this.props.data) {
      var createItems = function(item) {
        // console.log(item);
        return(
          <NamesItem ndbno={item.ndbno}>{item.name}</NamesItem>)
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
        <div>
        <RenderFoodContainer data={this.state.data} />
        </div>
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
      return(<div><RenderFood food={this.props.data} /></div>)
      // var createFoods = function(food) {
      //   console.log(food);
      //   return(<div><RenderFood food={food} /></div>)
      // }
      {/*return(
              <div className="food-container">
                {this.props.data.calories.map(createFoods)}
              </div>)*/}
    } else {
      return(<div> doesn't work</div>)
    }
  }
})

var RenderFood = React.createClass({
  render: function() {
    console.log('renderfood works')
    console.log(this.props.food);
    var calories = this.props.food.calories.map(function(measurement) {
      console.log(measurement.qty)
      return (<li>{measurement.qty} of {measurement.label} is {measurement.value} calories</li>)
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
