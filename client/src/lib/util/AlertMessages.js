import React, { Component } from 'react';
import { BrowserRouter as Router, Link, NavLink, Redirect, Prompt } from 'react-router-dom';
import './AlertMessages.css';

const AlertMessages = ({ message }) => {
    return (
        <div className="alert alert-success" role="alert">
            {message}
        </div>
    );
}
export default AlertMessages;