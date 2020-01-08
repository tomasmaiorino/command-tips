import React from "react";
import './HomePage.css';
import NavBar from './NavBar';
import SearchCommand from './search/SearchCommand';
import SearchResults from './search/SearchResults';
import Load from './Load';

const uuidv1 = require('uuid/v1');
const SEARCH_COMMANDS_BY_TAG = "/api/tips/tags/";
const SEARCH_TAG_CONTENT_URL = "/api/tags/";

class HomePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchResults: []
    };
  }

  componentDidMount() {
    // returns a promise object
    fetch(SEARCH_TAG_CONTENT_URL).then(result => result.json()).then((data) => {
      console.debug('setting tags ' + data.tags.length);
      this.setState({
        tags: data.tags,
      })
    }, (error) => {
      this.setState({ isLoaded: false, error: error });
      console.error(error);
    });
  }

  doProcessResult = (commands) => {
    this.setState({
      searchResults: [].concat(commands)
    });
  }

  doCheckTags = value => {
    fetch(SEARCH_COMMANDS_BY_TAG + value).then(result => result.json()).then((data) => {
      if (data) {
        this.doProcessResult(data.commands);
      }
    }, (error) => {
      this.setState({ isLoaded: false, error: error });
      console.error(error);
    });
  }

  render() {

    const { searchResults, tags } = this.state.searchResults;

    return (
      <main>
        <NavBar/>
        <div className="container">
          <div className="md-form mt-0 form-li-pointer input-field">
            <SearchCommand
              processResult={this.doProcessResult.bind(this)} />
          </div>

          <div className="row">
            <h3 className="ml-3">Check this tags to search.</h3>
          </div>
          {!this.state.searchResults && 
            <Load />
          }
          <div className="row">
            {this.state.tags && this.state.tags.map(t => {
              return (<span key={uuidv1()} className="ml-3 mt-2 badge badge-warning pointer" onClick={() => this.doCheckTags(t.value)}>{t.value}</span>)
            })}
          </div>
          <hr className="mb-5" />
          {!this.state.searchResults && 
            <Load />
          }          
          <SearchResults results={this.state.searchResults} />
        </div>
      </main>
    )
  }
}
export default HomePage;