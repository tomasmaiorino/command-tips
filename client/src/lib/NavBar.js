import React, { Component } from 'react';

import './NavBar.css';
import { BrowserRouter as Router, Link, NavLink, Redirect, Prompt } from 'react-router-dom';

const NavBar = () => {
    return (
        <div>
            <header>
                <nav className="navbar fixed-top navbar-expand-lg navbar-light white scrolling-navbar override-bar">
                    <div className="container">

                        <a className="navbar-brand waves-effect" href="/">
                            <img src="assets/img/logo-header.png"/>
                        </a>

                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item active">
                                    <a className="nav-link waves-effect" href="/">Home
                                        <span className="sr-only">(current)</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        </div>
    );
}
export default NavBar;
