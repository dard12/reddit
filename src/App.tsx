import React, { Suspense, lazy } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Axios from 'axios';
import Navbar from './layouts/Navbar/Navbar';
import Footer from './components/Footer/Footer';

const Feed = lazy(() => import('./layouts/Feed/Feed'));
const Questions = lazy(() => import('./layouts/Questions/Questions'));
const Profile = lazy(() => import('./layouts/Profile/Profile'));
const PostPage = lazy(() => import('./layouts/PostPage/PostPage'));

function App() {
  return (
    <React.Fragment>
      <Navbar />

      <div className="page-container">
        <Suspense fallback={null}>
          <Switch>
            <Route
              exact
              path="/profile/:user"
              render={props => <Profile user={props.match.params.user} />}
            />
            <Route exact path="/questions" render={props => <Questions />} />
            <Route exact path="/post" render={props => <PostPage />} />
            <Route exact path="/feed" render={props => <Feed />} />

            <Route render={() => <Redirect to="/profile/lihsing-lung" />} />
          </Switch>
        </Suspense>
      </div>

      <Footer />
    </React.Fragment>
  );
}

const axios = Axios.create();

export { App, axios };
