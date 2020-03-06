import React, { useState } from "react";
import theme from './SearchCommand.css';
import Autosuggest from "react-autosuggest";
const SEARCH_CONTENT_URL = "/api/tips/search/";

const SearchCommand = ({ processResult }) => {

    // When suggestion is clicked, Autosuggest needs to populate the input
    // based on the clicked suggestion. Teach Autosuggest how to calculate the
    // input value for every given suggestion.
    const getSuggestionValue = suggestion => suggestion.title;

    // Use your imagination to render suggestions.
    const renderSuggestion = suggestion => {
        let tags = '';
        if (suggestion.tags !== undefined) {
            tags = suggestion.tags.indexOf(" ") !== -1 ? suggestion.tags.split(" ")[0] : suggestion.tags;
        }
        return (<div className="site-font">{suggestion.title} {tags && <span className="ml-3 badge badge badge-warning pointer site-font">{tags}</span>}</div>);
    }

    const onSuggestionSelected = (event, result) => {
        processResult(suggestions[result.suggestionIndex]);
    }

    const onChange = (event, { newValue }) => {
        setValue(newValue);
    };

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    const onSuggestionsFetchRequested = ({ value }) => {
        console.log('searching for ' + value);
        if (value.length > 3) {

            fetch(SEARCH_CONTENT_URL + value)
                .then(result => result.json())
                .then((data) => {
                    if (data) {
                        //commands = data.commands;
                        setSuggestions(data.commands);
                    }
                }, (error) => {
                    setShowLoad(false);
                    console.log(error);
                });
        }
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showLoad, setShowLoad] = useState(false);

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
        placeholder: "Search for the command that you may need. e.g: taskkill",
        value,
        onChange: onChange,
        className: 'form-control search site-font input-field'
    };

    return (
        <div className="tag-input md-form mt-10 form-li-pointer input-field">
            <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                onSuggestionSelected={onSuggestionSelected}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
                theme={theme}
            />
        </div>
    )
}

export default SearchCommand;
