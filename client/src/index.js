import React from 'react';
import ReactDOM from 'react-dom';
import './load.css';
import './mdb.css';
import './style.css';
import './index.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import App from './App';
import { Provider } from 'react-redux'
import store from './redux/store/store'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();
