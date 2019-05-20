import React from "react";
import Autosuggest from "react-autosuggest";
import theme from './SearchCommand.css';

const SEARCH_CONTENT_URL = "/api/tips/search/";


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
