import React, { useState } from "react";
import { connect } from "react-redux";
import loginService from './loginService';
import LoginPage from "./LoginPage";

const Login = () => {

    const handleLogin = () => {

        if (email.length > 0 && pass.length > 0) {
            loginService.login(email, pass)
                .then(user => {
                    return loginService.recoverTokenId();
                })
                .then(token => {
                    console.log('token response %j', token);
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

    return (
        <form className="">
            <div className="card w-25">
                <div className="card-body input-field">
                    <div className="md-form">
                        <input type="text" id="form1" name="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className={`form-control ${emailErrorMessage.length > 0 ? " is-invalid" : ""}`} />
                        <label htmlFor="form1" data-error="wrong" data-success="right">Email</label>
                        <div className="invalid-feedback">
                            {emailErrorMessage}
                        </div>
                    </div>
                    <div className="md-form">
                        <input type="password" id="form2" name="pass"
                            onChange={e => setPass(e.target.value)}
                            value={pass}
                            className={`form-control ${passErrorMessage.length > 0 ? " is-invalid" : ""}`} />
                        <label htmlFor="form2">Password</label>
                        <div className="invalid-feedback">
                            {passErrorMessage}
                        </div>
                    </div>
                    <div className="text-center">
                        <a href="#" onClick={handleLogin} className="btn btn-dark btn-sm waves-effect waves-light">Login</a>
                    </div>
                </div>
            </div>
        </form>
    )
}
export default connect(null)(Login);