import { connect } from "react-redux";
import Command from './Command';

function mapStateToProps(state, urlParams) {

  //console.log('commandIdParam ', JSON.stringify(urlParams.match.params.commandId));
  return {
    state: state,
    commandIdParam: urlParams.match.params.commandId
  };
};

const VisibleCommand = connect(mapStateToProps, null)(Command);

export default VisibleCommand;
