import React from 'react';
import { hydrate, render } from 'react-dom';
import './index.scss';
import 'normalize.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { App } from './App.tsx';
import { Router, Route, Switch } from 'react-router-dom';
import history from './history';
import { withTracker } from './components/WithTracker/WithTracker';
import * as Sentry from '@sentry/browser';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import LegalPrivacy from './layouts/LegalPrivacy/LegalPrivacy';
import LegalTerms from './layouts/LegalTerms/LegalTerms';
import LegalGuidelines from './layouts/LegalGuidelines/LegalGuidelines';

Sentry.init({
  dsn: 'https://08a2f9f0d5874e3686d6c1fe312db70c@sentry.io/1817673',
});

const rootElement = document.getElementById('root');
const init = rootElement.hasChildNodes() ? hydrate : render;

init(
  <Provider store={store}>
    <Router history={history}>
      <ScrollToTop>
        <Switch>
          <Route exact path="/legal/privacy-policy" component={LegalPrivacy} />
          <Route exact path="/legal/terms-of-use" component={LegalTerms} />
          <Route
            exact
            path="/legal/user-guidelines"
            component={LegalGuidelines}
          />
          <Route
            component={withTracker(App, {
              userId: localStorage.getItem('id'),
              username: localStorage.getItem('username'),
            })}
          />
        </Switch>
      </ScrollToTop>
    </Router>
  </Provider>,
  rootElement,
);
