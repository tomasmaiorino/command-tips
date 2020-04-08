import React, { useState, useEffect, useLayoutEffect } from "react";
import Autosuggest from "react-autosuggest";
import { Redirect } from 'react-router-dom';
import theme from './../search/SearchCommand.css';
import AlertMessage from './../util/AlertMessages';
import Config from './../../config/config';

const Command = (props) => {

    const user = props.state.user;
    let isLogged = props.state.user && props.state.user.token && props.state.user.token !== '';
    const commandIdParam = props.commandIdParam;

    const SERVER_HOST = Config.server.url;
    const SEARCH_TAGS_QUERY_CONTENT_URL = "/api/tags/search/";
    const CREATE_COMMAND_URL = SERVER_HOST + '/admin/api/commands';
    const DELETE_COMMAND_URL = SERVER_HOST + '/admin/api/commands/';
    const GET_COMMAND_URL = SERVER_HOST + '/api/tips/';

    const getSuggestionValue = suggestion => suggestion.value;

    const renderSuggestion = suggestion => {
        let tags = suggestion.value;
        return (<div className="site-font">{tags && <span className="ml-3 badge badge badge-warning pointer site-font">{tags}</span>}</div>);
    }

    const handleDeleteCommand = (pCommandId) => {

        fetch(DELETE_COMMAND_URL + pCommandId, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            }
        })
            .then(rawResponse => {
                if (rawResponse.status == 204) {
                    setMessageResponse('Command \"' + title + '\" has been removed.');
                    handleShowCreateCommand();
                }
            })
            .catch(error => {
                console.log('Error ' + error);
            });
    }

    const handleCreateCommand = (userParam) => {

        if (command.length == 0 || tags.length == 0 || title.length == 0) {
            setCommandErrorMessage(command.length == 0 ? 'Command is required.' : '');
            setTitleErrorMessage(title.length == 0 ? 'Title is required.' : '');
            setTagsErrorMessage(tags.length == 0 ? 'Tags is required.' : '');
        }

        fetch(CREATE_COMMAND_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userParam.token
            },
            body: JSON.stringify({ tags: tags, command, description, title })
        })
            .then(rawResponse => {
                if (rawResponse.status == 201) {
                    setMessageResponse('Command \"' + title + '\" created.');
                    handleShowCreateCommand();
                }
            })
            .catch(error => {
                console.log('Error ' + error);
            });
    }

    const onSuggestionsFetchRequested = ({ value }) => {

        if (value.length >= 3) {

            fetch(SEARCH_TAGS_QUERY_CONTENT_URL + value)
                .then(result => result.json())
                .then((data) => {
                    if (data && data.length > 0) {
                        setSuggestions(data);
                    } else {
                        setTags(value);
                    }
                }, (error) => {
                    setIsLoaded(false);
                    //setError(error);
                    console.log(error);
                });
        } else {
            setTags(value);
        }
    }

    const onChange = (event, { newValue, }) => {
        setValue(newValue);
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const onSuggestionSelected = (event, result) => {
        setTags(suggestions[result.suggestionIndex].value);
        return suggestions[result.suggestionIndex];
    }

    const handleShowCreateCommand = () => {
        setShowCreateCard(!showCreateCard);
        setTitle('');
        setDescription('');
        setCommand('');
        setTags('');
        setCommandErrorMessage('');
        setTitleErrorMessage('');
        setTagsErrorMessage('');
        setSuggestions([]);
    }

    const [count, setCount] = useState(0);
    const [showCreateCard, setShowCreateCard] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [command, setCommand] = useState('');
    const [tags, setTags] = useState('');
    const [commandErrorMessage, setCommandErrorMessage] = useState('');
    const [titleErrorMessage, setTitleErrorMessage] = useState('');
    const [tagsErrorMessage, setTagsErrorMessage] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [value, setValue] = useState('');
    const [messageResponse, setMessageResponse] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [commandId, setCommandId] = useState(commandIdParam);

    useEffect(() => {
        if (commandId) {
            let isMounted = false;
            fetch(GET_COMMAND_URL + commandId)
                .then(result => result.json())
                .then((data) => {
                    if (!isMounted) {
                        setShowCreateCard(true);
                        const commandParam = data.command;
                        setTitle(commandParam.title);
                        setCommand(commandParam.command);
                        setDescription(commandParam.description || "");
                        // setTags(commandParam.tags);
                    }
                }, (error) => {
                    console.log(error);
                });
            return () => {
                isMounted = true;
            };
        }

    }, []);

    const inputProps = {
        placeholder: "Search for the tags to add",
        value,
        onChange: onChange,
        className: 'form-control search site-font input-field',
        id: 'tagInput'
    };

    let content = (
        <div className="text-center">
            <a href="#" onClick={handleShowCreateCommand} className="btn btn-dark btn-sm waves-effect waves-light">Create Command</a>
        </div>)

    if (showCreateCard) {
        content = (
            <div className="container">
                <form className="">
                    <div className="card w-50">
                        <div className="card-body input-field">
                            <div className="md-form">
                                <input type="text" id="title" name="title"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className={`form-control ${titleErrorMessage.length > 0 ? " is-invalid" : ""}`} />
                                <label htmlFor="title" data-error="wrong" data-success="right">Title</label>
                                <div className="invalid-feedback">
                                    {titleErrorMessage}
                                </div>
                            </div>
                            <div className="md-form">
                                <input type="text" id="description" name="description"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="form-control" />
                                <label htmlFor="description" data-error="wrong" data-success="right">Description</label>
                                <div className="invalid-feedback">
                                </div>
                            </div>
                            <div className="md-form">
                                <input type="text" id="command" name="command"
                                    value={command}
                                    onChange={e => setCommand(e.target.value)}
                                    className={`form-control ${commandErrorMessage.length > 0 ? " is-invalid" : ""}`} />
                                <label htmlFor="command" data-error="wrong" data-success="right">Command</label>
                                <div className="invalid-feedback">
                                    {commandErrorMessage}
                                </div>
                            </div>
                            <div className="tag-input md-form mt-0 form-li-pointer input-field">
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
                                <label htmlFor="tagInput" data-error="wrong" data-success="right"></label>
                                <div className="invalid-feedback">
                                    {tagsErrorMessage}
                                </div>
                            </div>
                            <div className="text-center">
                                <a href="#" onClick={() => { handleCreateCommand(user) }} className="btn btn-dark btn-sm waves-effect waves-light">Do Create Command</a>
                                <a href="#" onClick={handleShowCreateCommand} className="btn btn-dark btn-sm waves-effect waves-light">Cancel</a>
                                {(isLogged && commandId) && <a href="#" onClick={() => handleDeleteCommand(commandId)} className="btn btn-dark btn-sm waves-effect waves-light">Delete</a>}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <div className="text-center margin-top: 30px">
            {!isLogged && <Redirect to="/login" />}
            {messageResponse.length > 0 && <AlertMessage message={messageResponse} />}
            {content}
        </div>
    )
}
export default Command;