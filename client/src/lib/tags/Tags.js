import React from "react";
import Load from '../Load';
const uuidv1 = require('uuid/v1');

const SEARCH_TAG_CONTENT_URL = "/api/tags/";

class TagsPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tags: []
    };
  }

  componentDidMount() {
    // returns a promise object
    fetch(SEARCH_TAG_CONTENT_URL).then(result => result.json()).then((data) => {
      console.debug('setting tags %j', data);
      this.setState({
        tags: data.tags,
      })
    }, (error) => {
      this.setState({ isLoaded: false, error: error });
      console.error(error);
    });
  }

  render() {

    const { tags } = this.state;
    const title = this.props.title || 'Check this tags to search.';

    return (
        <div>
          <div className="row">
            <h3 className="ml-3">{title}</h3>
          </div>
          {!this.state.tags && 
            <Load />
          }
          <div className="row">
            {this.state.tags && this.state.tags.map(t => {
              return (<span key={uuidv1()} className="ml-3 mt-2 badge badge-warning pointer" onClick={() => this.doCheckTags(t.value)}>{t.value}</span>)
            })}
          </div>
      </div>
    )
  }
}
export default TagsPage;