import { connect } from "react-redux";
import Login from './LoginPage';
import { addUserName } from "./../redux/actions/Actions";

function mapStateToProps(state) {
  return state;
};

const VisibleLogin = connect(
  mapStateToProps,
  { addUserName }
)(Login);

export default VisibleLogin;