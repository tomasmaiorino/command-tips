import React from 'react';
import { connect } from "react-redux";
import './NavBar.css';

function mapStateToProps(state) {
    return state;
};

const NavBar = ({ user }) => {

    let isLogged = user && user.token && user.token !== '';

    return (
        <nav className="mb-1 navbar navbar-expand-lg navbar-dark override-bar">
            <div className="container">
                <a className="navbar-brand waves-effect" href="/">
                    <img src="assets/img/logo-header.png" />
                </a>
                <div className="collapse navbar-collapse" id="navbarSupportedContent-4">
                    <ul className="navbar-nav ml-auto">
                        {!isLogged &&
                            <li className="nav-item active">
                                <a className="nav-link" href="/login"><span>Login</span>
                                </a>
                            </li>}
                        {isLogged &&
                            <React.Fragment>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" id="navbarDropdownMenuLink-4" data-toggle="dropdown"
                                        aria-haspopup="true" aria-expanded="false">
                                        <i className="fas fa-user"></i> {user.email} </a>
                                    <div className="dropdown-menu dropdown-menu-right dropdown-info" aria-labelledby="navbarDropdownMenuLink-4">
                                        <a className="dropdown-item" href="/commands">Commands</a>
                                        <a className="dropdown-item" href="/logout">Log out</a>
                                    </div>
                                </li>
                            </React.Fragment>}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
export default connect(mapStateToProps, null)(NavBar);
