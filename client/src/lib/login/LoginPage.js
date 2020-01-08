import React from "react";
import Load from '../Load';
import NavBar from './../NavBar';
import loginService from './loginService';

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            pass: '',
            emailErrorMessage: '',
            passErrorMessage: ''
        };

        this.handleLogin = this.handleLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleLogin = (event) => {
        let email = this.state.email;
        let pass = this.state.pass;

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
            this.setState({
                emailErrorMessage: email.length == 0 ? 'Email is required.' : ''
            });
            this.setState({
                passErrorMessage: pass.length == 0 ? 'Password is required.' : ''
            });
        }
    }

    render() {
        console.log('rendering ->');
        return (
            <main>
                <NavBar />
                <div className="container text-center">
                    <form className="">
                        <div className="card w-25">
                            <div className="card-body input-field">
                                <div className="md-form">
                                    <input type="text" id="form1" name="email"
                                        value={this.state.email}
                                        onChange={this.handleChange}
                                        className={`form-control ${this.state.emailErrorMessage.length > 0 ? " is-invalid" : ""}`} />
                                    <label htmlFor="form1" data-error="wrong" data-success="right">Email</label>
                                    <div className="invalid-feedback">
                                        {this.state.emailErrorMessage}
                                    </div>
                                </div>
                                <div className="md-form">
                                    <input type="password" id="form2" name="pass" onChange={this.handleChange}
                                        value={this.state.pass}
                                        className={`form-control ${this.state.passErrorMessage.length > 0 ? " is-invalid" : ""}`} />
                                    <label htmlFor="form2">Password</label>
                                    <div className="invalid-feedback">
                                        {this.state.passErrorMessage}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <a href="#" onClick={this.handleLogin} className="btn btn-dark btn-sm waves-effect waves-light">Login</a>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        )
    }
}

export default LoginPage;