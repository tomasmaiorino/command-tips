import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux'
import reducers from './lib/redux/store/Store'
import registerServiceWorker from './registerServiceWorker';

import '../node_modules/font-awesome/css/font-awesome.min.css';
import './load.css';
import './mdb.css';
import './style.css';
import './index.css';
import App from './App';
import { loadState, saveState } from './lib/util/StateStorage';


const oldState = loadState();
const store = createStore(reducers, oldState);
store.subscribe(() => {
    saveState(store.getState());
});

ReactDOM.render(<App store={store} />, document.getElementById('root'));

registerServiceWorker();
