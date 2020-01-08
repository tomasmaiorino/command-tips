import React, { Component } from 'react';
//import Footer from './lib/Footer';
import HomePage from './lib/HomePage';
import Login from './lib/login/LoginPage';
import LoginBKP from './lib/login/LoginPageBKP';
import CommandsPage from './lib/commands/CommandsPage'
import { Route, IndexRoute } from 'react-router'

import {
  BrowserRouter as Router
} from 'react-router-dom';

import './App.css';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={HomePage} />
          <Route path="/login" component={Login} />
          <Route path="/loginBkp" component={LoginBKP} />
          <Route path="/commands" component={CommandsPage} />
        </div>
      </Router>
    );
  }
}

export default App;
