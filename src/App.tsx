import React, { Suspense, lazy } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Axios from 'axios';
import Navbar from './layouts/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import { getQueryParams } from './history';

const TopQuestions = lazy(() => import('./layouts/TopQuestions/TopQuestions'));
const QuestionPage = lazy(() => import('./layouts/QuestionPage/QuestionPage'));
const Login = lazy(() => import('./layouts/Login/Login'));
const Profile = lazy(() => import('./layouts/Profile/Profile'));
const RecentQuestions = lazy(() =>
  import('./layouts/RecentQuestions/RecentQuestions'),
);

function App() {
  return (
    <React.Fragment>
      <Navbar />

      <div className="page-container">
        <Suspense fallback={null}>
          <Switch>
            <Route
              exact
              path="/questions/recent"
              render={() => <RecentQuestions />}
            />
            <Route
              exact
              path="/questions/top"
              render={() => {
                const query = getQueryParams('query');
                const tag = getQueryParams('tag');
                const company = getQueryParams('company');

                return (
                  <TopQuestions
                    query={query}
                    tag={tag}
                    company={company}
                    tagFilter={{ approved: true }}
                  />
                );
              }}
            />
            <Route
              path="/question/:question"
              render={props => {
                const { question } = props.match.params;
                const type = getQueryParams('type');
                return (
                  question && <QuestionPage question={question} type={type} />
                );
              }}
            />
            <Route
              exact
              path="/profile/:username"
              render={props => (
                <Profile targetUsername={props.match.params.username} />
              )}
            />

            <Route
              path="/profile/:username/:page"
              render={props => (
                <Profile
                  targetUsername={props.match.params.username}
                  page={props.match.params.page}
                />
              )}
            />

            <Route exact path="/login" render={props => <Login {...props} />} />
            <Route
              exact
              path="/register"
              render={props => <Login {...props} />}
            />

            <Route render={() => <Redirect to="/questions" />} />
          </Switch>
        </Suspense>
      </div>

      <Footer />
    </React.Fragment>
  );
}

const axios = Axios.create();

export { App, axios };
