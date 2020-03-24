import React, { useState } from "react";
import { Redirect } from 'react-router-dom';
import './LoginPage.css';
import LoginService from './LoginService';

const LoginPage = ({ user, addUserName }) => {

    const handleLogin = () => {

        if (email.length > 0 && pass.length > 0) {
            let user = {}
            LoginService.login(email, pass)
                .then(userResponse => {
                    console.debug('user found %O', userResponse);
                    user.uid = userResponse.user.uid;
                    user.email = userResponse.user.email;
                    user.loginTime = new Date().getTime();
                    return LoginService.recoverTokenId();
                })
                .then(token => {
                    //console.log('adding token response %O', token);
                    user.token = token;
                    //console.log('adding user name %O', user);
                    addUserName(user);
                })
                .catch(err => {
                    console.log('error %j', err.message);
                });
        } else {
            setEmailErrorMessage(email.length == 0 ? 'Email is required.' : '');
            setPassErrorMessage(pass.length == 0 ? 'Password is required.' : '');
        }
    }

    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passErrorMessage, setPassErrorMessage] = useState('');
    if (user) {
        const checkLogin = LoginService.verifyToken(user);
    }
    return (
        <div className="center-block">
            {user && user.token && <Redirect to="/" />}
            <div className="row">
                <div className="card w-25 center-div">
                    <div className="card-body input-field">
                        <div className="md-form">
                            <input type="text" id="email" name="email" value={email} onChange={e => setEmail(e.target.value)}
                                className={`form-control ${emailErrorMessage.length > 0 ? " is-invalid" : ""}`} />
                            <label htmlFor="email" data-error="wrong" data-success="right">Email</label>
                            <div className="invalid-feedback">
                                {emailErrorMessage}
                            </div>
                        </div>
                        <div className="md-form">
                            <input type="password" id="pass" name="pass"
                                onChange={e => setPass(e.target.value)}
                                value={pass}
                                className={`form-control ${passErrorMessage.length > 0 ? " is-invalid" : ""}`} />
                            <label htmlFor="pass">Password</label>
                            <div className="invalid-feedback">
                                {passErrorMessage}
                            </div>
                        </div>
                        <div className="text-center">
                            <a href="#" onClick={handleLogin} className="btn btn-dark btn-sm waves-effect waves-light">Login</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;