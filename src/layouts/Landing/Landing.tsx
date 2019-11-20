import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './Landing.module.scss';
import Navbar from '../Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { userSelector } from '../../redux/selectors';
import QuestionListPage from '../../containers/QuestionListPage/QuestionListPage';

interface LandingProps {
  user?: string;
}

function Landing(props: LandingProps) {
  const { user } = props;

  if (user) {
    return <Redirect to="/questions/recent" />;
  }

  return (
    <React.Fragment>
      <Navbar />

      <div>
        <div className={styles.landingHeader}>
          <div className={styles.landingContent}>
            <div className={styles.landingTitle}>
              Find out how to answer interview questions.
            </div>

            <Link to="/register" className="ctaButton">
              Try it — {"It's"} Free!
            </Link>
          </div>
        </div>

        <div className={styles.landingSlide}>
          <div className={styles.landingContent}>
            <h2>1. Explore soft interview questions.</h2>
            <h2>2. Discuss different answers.</h2>
            <h2>3. Find the best answers to questions.</h2>

            <Link to="/register" className="ctaButton">
              Sign Up
            </Link>

            <Link to="/questions/top" className="ctaButtonSecondary">
              See Top Questions
            </Link>
          </div>
        </div>

        <div className={styles.landingFeed}>
          <div className={styles.landingReviews}>Recent Questions</div>

          <QuestionListPage params={{ sort: 'featured', pageSize: 3 }} />

          <div className={styles.landingFeedCTA}>
            <Link to="/register" className="ctaButton">
              Sign Up
            </Link>

            <Link to="/questions/recent" className="ctaButtonSecondary">
              See More
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    </React.Fragment>
  );
}

export default connect(userSelector)(Landing);
