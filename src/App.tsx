import React, { Suspense, lazy } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Axios from 'axios';
import Navbar from './layouts/Navbar/Navbar';
import Footer from './components/Footer/Footer';

const Questions = lazy(() => import('./layouts/Questions/Questions'));
const QuestionPage = lazy(() => import('./layouts/QuestionPage/QuestionPage'));
const Login = lazy(() => import('./layouts/Login/Login'));
const Profile = lazy(() => import('./layouts/Profile/Profile'));
const RecentComments = lazy(() =>
  import('./layouts/RecentComments/RecentComments'),
);

function App() {
  return (
    <React.Fragment>
      <Navbar />

      <div className="page-container">
        <Suspense fallback={null}>
          <Switch>
            <Route exact path="/" render={props => <RecentComments />} />
            <Route exact path="/home" render={props => <RecentComments />} />
            <Route exact path="/question" render={props => <Questions />} />
            <Route
              path="/question/:question"
              render={props => {
                const { question } = props.match.params;
                return question && <QuestionPage question={question} />;
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
