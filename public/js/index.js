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
        <SignUpComponent />
        <LoginForm 
          initialLoginCheck={this.state.authenticatedUser} 
          onChange={this.changeLogin} />
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
      loginStatus: this.props.initialLoginCheck
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
          <input className="username-login-form" type="text" value={this.state.username} onChange={this.handleLoginFormChange.bind(this, 'username')}/>
          <br/>
          <label htmlFor="password">Password</label>
          <input className="password-login-form" type="text" value={this.state.password} onChange={this.handleLoginFormChange.bind(this, 'password')}/>
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
    this.signupAJAX(username, email, password);
    this.setState({
      username: "",
      email: "",
      password: "",
      calories: ""
    })
  },
  signUpState: function() {
    this.setState({signup: true})
  },
  signupAJAX: function(username, email, password) {
    $.ajax({
      url: '/users',
      method: "POST",
      data: {
        username: username,
        email: email,
        password: password
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
        <p className="blue" onClick={this.signUpState}>Sign Up</p>)
    } else {
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
              type="text" 
              value={this.state.password} 
              onChange={this.handleSignupFormChange.bind(this, 'password')}/><br/>
              <label htmlFor="password">Password</label>
            <label htmlFor="calories">Max Calories Per Day</label>
            <input 
              type="text" 
              value={this.state.calories} 
              onChange={this.handleSignupFormChange.bind(this, 'calories')}/><br/>
              <input className="button" type="submit"/>
          </form>
        </div>)
    }
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

