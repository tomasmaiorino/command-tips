import React from 'react';
import HomePage from './lib/HomePage';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import VisibleLogin from './lib/login/VisibleLogin';
import NavBar from './lib/NavBar';
import NotFound from './lib/util/NotFound';
import Logout from './lib/login/Logout';
import VisibleCommand from './lib/commands/VisibleCommand';

import './App.css';

const App = ({ store }) => {
  return (
    <Provider store={store}>
      <Router>
        <main>
          <NavBar />
          <div className="container">
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route path="/login" component={VisibleLogin} />
              <Route path="/logout" component={Logout} />
              <Route path="/commands" component={VisibleCommand} />
              <Route path="/edit/:commandId" component={VisibleCommand} />
              <Route>
                <NotFound />
              </Route>
            </Switch>
          </div>
        </main>
      </Router>
    </Provider>
  );
}

export default App;