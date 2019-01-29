import React from "react";
import Autosuggest from "react-autosuggest";
import theme from './SearchCommand.css';

const SEARCH_CONTENT_URL = "/api/tips/search/";

// Imagine you have a list of languages that you'd like to autosuggest.
const commands = [
  {
    helpfull: 0,
    unhelpfull: 0,
    works: 0,
    doesnt_work: 0,
    comments_counts: 0,
    active: true,
    _id: "5c3f22b62936bc3c765739b8",
    full_description: "Kill a task through a find result.",
    helpfull_links: "",
    tags: "GIT WINDOWS",
    title: "KILLING A TASK USING A FIND RESULT",
    command: "taskkill /F /FI 'PID eq 2856'",
    user_id: "5c3f1d1b1fe49b35a0c7a968",
    updatedAt: "2019-01-16T12:25:26.157Z",
    createdAt: "2019-01-16T12:25:26.157Z",
    __v: 0
  },
  {
    helpfull: 0,
    unhelpfull: 0,
    works: 0,
    doesnt_work: 0,
    comments_counts: 0,
    active: true,
    _id: "5c3f73652ad7965f9af44dbe",
    full_description: "Kill a linux process using pid.",
    helpfull_links: "",
    title: "KILLING A TASK BY PID",
    command: "taskkill /F /PID <process-id>",
    user_id: "5c3f1d1b1fe49b35a0c7a968",
    updatedAt: "2019-01-16T18:09:41.776Z",
    createdAt: "2019-01-16T18:09:41.776Z",
    __v: 0
  }
];

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength < 3 ? [] : doSearchCommand(inputValue);
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.title;

const doSearchCommand = inputValue => {
  console.debug('Searching for command with ' + inputValue);
  fetch(SEARCH_CONTENT_URL + inputValue).then(result => result.json()).then((data) => {
    if (data) {
      commands = data.commands;
    }
  }, (error) => {
    this.setState({ isLoaded: false, error: error });
    console.error(error);
  });
}

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => {
  let tags = '';
  if (suggestion.tags !== undefined) {
    tags = suggestion.tags.indexOf(" ") !== -1 ? suggestion.tags.split(" ")[0] : suggestion.tags;
  }
  return (<div className="site-font">{suggestion.title} {tags && <span className="ml-3 badge badge badge-warning pointer site-font">{tags}</span>}</div>);
}


class SearchCommand extends React.Component {
  constructor(props) {
    super(props);

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: "",
      suggestions: []
    };
    this.processResult = props.processResult;
  }

  processResult(value) { }

  onSuggestionSelected = (event, result) => {
    this.processResult(this.state.suggestions[result.suggestionIndex]);
  }

  onChange = (event, { newValue, }) => {
    this.setState({
      value: newValue
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {

    if (value.length > 3) {

      fetch(SEARCH_CONTENT_URL + value).then(result => result.json()).then((data) => {
        if (data) {
          //commands = data.commands;
          this.setState({
            suggestions: data.commands
          });
        }
      }, (error) => {
        this.setState({ isLoaded: false, error: error });
        console.log(error);
      });

    }

    // this.setState({
    //   suggestions: getSuggestions(value)
    // });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: "Search for the command that you may need. e.g: taskkill",
      value,
      onChange: this.onChange,
      className: 'form-control search site-font input-field'
    };

    //    console.log('input props '+ inputProps.value);
    // Finally, render it!
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        onSuggestionSelected={this.onSuggestionSelected}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        theme={theme}
      />
    );
  }
}
export default SearchCommand;
