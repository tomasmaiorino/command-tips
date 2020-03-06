import { connect } from "react-redux";
import Command from './Command';

function mapStateToProps(state) {
  return state;
};

const VisibleCommand = connect(mapStateToProps, null)(Command);

export default VisibleCommand;
