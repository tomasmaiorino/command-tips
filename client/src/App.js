import React, { Component } from 'react';
import NavBar from './lib/NavBar';
//import Footer from './lib/Footer';
import HomePage from './lib/HomePage';
//import Login from './lib/login/Login';
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
            <NavBar/>
            <HomePage/>
        </div>
      </Router>
    );
  }
}

export default App;
