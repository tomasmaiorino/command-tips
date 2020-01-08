import React from "react";
import Autosuggest from "react-autosuggest";
import theme from './../search/SearchCommand.css';
import Command from './Command';

const SEARCH_TAGS_QUERY_CONTENT_URL = "/api/tags/search/";

const getSuggestionValue = suggestion => suggestion.value;

const renderSuggestion = suggestion => {
    let tags = suggestion.value;
    return (<div className="site-font">{tags && <span className="ml-3 badge badge badge-warning pointer site-font">{tags}</span>}</div>);
}

class CommandBkp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            description: '',
            command: '',
            tags: '',
            commandErrorMessage: '',
            titleErrorMessage: '',
            tagsErrorMessage: '',
            suggestions: [],
            value: '',
            showCreateCard: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleCreateCommand = this.handleCreateCommand.bind(this);
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleCreateCommand = () => {
        let command = this.state.command;
        let tags = this.state.tags;
        let title = this.state.title;

        if (command.length == 0 || tags.length == 0 || title.length == 0) {
            this.setState({
                commandErrorMessage: command.length == 0 ? 'Command is required.' : '',
                titleErrorMessage: title.length == 0 ? 'Title is required.' : '',
                tagsErrorMessage: tags.length == 0 ? 'Tags is required.' : ''
            });
        }
    }

    onSuggestionsFetchRequested = ({ value }) => {

        if (value.length > 3) {

            fetch(SEARCH_TAGS_QUERY_CONTENT_URL + value)
                .then(result => result.json())
                .then((data) => {
                    console.log('data response %j', data);
                    if (data) {
                        this.setState({
                            suggestions: data
                        });
                    }
                }, (error) => {
                    this.setState({ isLoaded: false, error: error });
                    console.log(error);
                });
        }
    }

    onChange = (event, { newValue, }) => {
        this.setState({
            value: newValue
        });
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    onSuggestionSelected = (event, result) => {
        this.processResult(this.state.suggestions[result.suggestionIndex]);
    }

    handleShowCreateCommand = () => {
        this.setState((prevState, props) => ({
            showCreateCard: !prevState.showCreateCard,
            title: '',
            description: '',
            command: '',
            tags: ''
        }));
    }

    render() {

        const { value, suggestions } = this.state;

        // Autosuggest will pass through all these props to the input.
        const inputProps = {
            placeholder: "Search for the tags to add",
            value,
            onChange: this.onChange,
            className: 'form-control search site-font input-field'
        };

        let showCreateCard = this.state.showCreateCard;

        let content = (<div className="text-center">
            <a href="#" onClick={this.handleShowCreateCommand} className="btn btn-dark btn-sm waves-effect waves-light">Create Command</a>
        </div>)

        if (showCreateCard) {
            content = (
                <form className="">
                    <div className="card w-50">
                        <div className="card-body input-field">
                            <div className="md-form">
                                <input type="text" id="form1" name="title"
                                    value={this.state.title}
                                    onChange={this.handleChange}
                                    className={`form-control ${this.state.titleErrorMessage.length > 0 ? " is-invalid" : ""}`} />
                                <label htmlFor="form1" data-error="wrong" data-success="right">Title</label>
                                <div className="invalid-feedback">
                                    {this.state.titleErrorMessage}
                                </div>
                            </div>
                            <div className="md-form">
                                <input type="text" id="form1" name="description"
                                    value={this.state.description}
                                    onChange={this.handleChange}
                                    className="form-control" />
                                <label htmlFor="form1" data-error="wrong" data-success="right">Description</label>
                                <div className="invalid-feedback">
                                </div>
                            </div>
                            <div className="md-form">
                                <input type="text" id="form1" name="command"
                                    value={this.state.command}
                                    onChange={this.handleChange}
                                    className={`form-control ${this.state.commandErrorMessage.length > 0 ? " is-invalid" : ""}`} />
                                <label htmlFor="form1" data-error="wrong" data-success="right">Command</label>
                                <div className="invalid-feedback">
                                    {this.state.commandErrorMessage}
                                </div>
                            </div>
                            <div className="md-form">
                                <input type="text" id="form1" name="tags"
                                    value={this.state.tags}
                                    onChange={this.handleChange}
                                    className={`form-control ${this.state.tagsErrorMessage.length > 0 ? " is-invalid" : ""}`} />
                                <label htmlFor="form1" data-error="wrong" data-success="right">Tags</label>
                                <div className="invalid-feedback">
                                    {this.state.tagsErrorMessage}
                                </div>
                            </div>
                            <div className="tag-input md-form mt-0 form-li-pointer input-field">
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
                            </div>
                            <div className="text-center">
                                <a href="#" onClick={this.handleCreateCommand} className="btn btn-dark btn-sm waves-effect waves-light">Create Command</a>
                                <a href="#" onClick={this.handleShowCreateCommand} className="btn btn-dark btn-sm waves-effect waves-light">Cancel</a>
                            </div>
                        </div>
                    </div>
                </form>
            )
        }

        return (
            <div className="text-center margin-top: 30px">
                <CommandTemp name="Command temp name" />
                {content}
            </div>
        )
    }
}

export default CommandBkp;