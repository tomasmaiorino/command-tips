import React from 'react';
import ListCommand from './ListCommand';
const uuidv1 = require('uuid/v1');

const ListCommands = props => {
    console.debug('results from porps ' + props.results);
    const resultsLists = props.results.map(v =>
        <ListCommand key={uuidv1()}
            content={v} />
    );
    //console.debug('results list ' + resultsLists.length);
    return (
        <React.Fragment>
            <hr className="mb-5"></hr>
            <section className="container">
                {resultsLists}
            </section>
        </React.Fragment>
    );
}
//
export default ListCommands;
