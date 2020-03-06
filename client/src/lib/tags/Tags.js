import React, { useEffect, useState } from "react";
import Load from './../util/Load';

const uuidv1 = require('uuid/v1');
const SEARCH_TAG_CONTENT_URL = "/api/tags/";
const SEARCH_COMMANDS_BY_TAG = "/api/tips/tags/";

const Tags = ({ title, processTagsResult }) => {

  title = title || 'Check this tags to search.';

  useEffect(() => {
    setShowTagLoad(true);
    fetch(SEARCH_TAG_CONTENT_URL).then(result => result.json()).then((data) => {
      console.debug('setting tags %j', data);
      setTags(data.tags);
      setShowTagLoad(false);
    }, (error) => {
      setShowTagLoad(false);
      console.error(error);
    })
  }, []);

  const doCheckTags = value => {
    setShowTagLoad(true);
    fetch(SEARCH_COMMANDS_BY_TAG + value).then(result => result.json()).then((data) => {
      if (data) {
        setShowTagLoad(false);
        processTagsResult(data.commands);
      }
      setShowTagLoad(false);
    }, (error) => {
      setShowTagLoad(false);
      console.error(error);
    });
  }

  const [showTagLoad, setShowTagLoad] = useState(false);
  const [tags, setTags] = useState([]);

  return (
    <div>
      <div className="row">
        <h3 className="ml-3">{title}</h3>
      </div>
      <div className="row">
        {tags.length > 0 && tags.map(t => {
          return (<span key={uuidv1()} className="ml-3 mt-2 badge badge-warning pointer" onClick={() => doCheckTags(t.value)}>{t.value}</span>)
        })}
      </div>
      {showTagLoad &&
        <Load />
      }
    </div>
  )
}


export default Tags;
/*
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
*/