import React from "react";
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';
import { cleanStorage } from './../util/StateStorage';
import { logoutAction } from './../redux/actions/Actions';

const Logout = ({ user, logoutAction }) => {

    if (user.token) {
        cleanStorage();
        logoutAction();
    }

    return (
        <Redirect to="/" />
    )
}

function mapStateToProps(state) {
    return state;
};

export default connect(mapStateToProps, { logoutAction })(Logout);