import React, { Component } from 'react';
import { BrowserRouter as Router, Link, NavLink, Redirect, Prompt } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import SearchResult from './SearchResult';
const uuidv1 = require('uuid/v1');

const SearchResults = props => {
    console.debug('results from porps ' + props.results);
    const resultsLists = props.results.map(v =>
        <SearchResult key={uuidv1()}
            content={v} />
    );
    console.debug('results list ' + resultsLists.length);
    return (
        <section className="container">
            {resultsLists}
        </section>
    );
}
//
export default SearchResults;
