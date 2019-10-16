import React, { Suspense, lazy } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Axios from 'axios';
import Navbar from './layouts/Navbar/Navbar';
import Footer from './components/Footer/Footer';

const Home = lazy(() => import('./layouts/Home/Home'));
const QuestionPage = lazy(() => import('./layouts/QuestionPage/QuestionPage'));

function App() {
  return (
    <React.Fragment>
      <Navbar />

      <div className="page-container">
        <Suspense fallback={null}>
          <Switch>
            <Route
              path="/question:question"
              render={props => {
                const { question } = props.match.params;
                return question && <QuestionPage question={question} />;
              }}
            />
            <Route exact path="/question" render={props => <Home />} />

            <Route render={() => <Redirect to="/question" />} />
          </Switch>
        </Suspense>
      </div>

      <Footer />
    </React.Fragment>
  );
}

const axios = Axios.create();

export { App, axios };
