import React, { Component } from 'react';
import { BrowserRouter as Router, Link, NavLink, Redirect, Prompt } from 'react-router-dom';

import './AlertMessages.css';

const AlertMessages = (props) => {
    return (
        <div className="alert alert-danger" role="alert">
            A simple info alert with <a href="#" className="alert-link">an example link</a>. Give it a click if you like.
        </div>
    );
}
export default AlertMessages;