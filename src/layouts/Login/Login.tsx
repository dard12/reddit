import React, { useState } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Link, Redirect } from 'react-router-dom';
import history, { routeIncludes, getQueryParams } from '../../history';
import { loginAction } from '../../redux/actions';
import styles from './Login.module.scss';
import { axios } from '../../App';
import Tooltip from '../../components/Tooltip/Tooltip';
import { Button } from '../../components/Button/Button';
import { userSelector } from '../../redux/selectors';
import Evil from '../../components/Evil/Evil';

interface LoginProps {
  loginAction: Function;
  user?: string;
}

function Login(props: LoginProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [spamText, setSpamText] = useState('');
  const [spamCheck, setSpamCheck] = useState(false);
  const [humanCheck, setHumanCheck] = useState(false);
  const [termsCheck, setTermsCheck] = useState(false);
  const [ageCheck, setAgeCheck] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isLogin = routeIncludes('/login');
  const isLoginFailed = getQueryParams('failed');
  const isLoginSuccess = getQueryParams('success');
  const redirect = localStorage.getItem('redirect') || '/questions/recent';
  const actionText = isLogin ? 'Login' : 'Sign up';
  const isFilled = isLogin
    ? username && password
    : username && password && email && termsCheck && ageCheck;

  const { user, loginAction } = props;

  if (user) {
    return <Redirect to={redirect} />;
  }

  const authError = (errorMessage: string) => {
    setIsLoading(false);
    setErrorMessage(errorMessage);
  };

  if (isLoginSuccess) {
    axios
      .get('/auth/me')
      .then(res => {
        loginAction(res.data);
        history.push(redirect);
      })
      .catch(() => history.push('/login?failed=true'));
    return null;
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (spamCheck || (spamText && !humanCheck)) {
      setErrorMessage('Please check the box to confirm you are human.');
      return;
    }

    if (username.match(/[^a-z0-9]/gi)) {
      setErrorMessage('Please only use letters and numbers in your username.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    if (isLogin) {
      axios
        .post('/login', { username, password })
        .then(() => history.push('/login?success=true'))
        .catch(() => authError('Username and password do not match.'));
    } else {
      axios
        .post('/register', { username, email, password })
        .then(() => history.push('/login?success=true'))
        .catch(() =>
          authError('This username or email already has an account.'),
        );
    }
  };

  return (
    <form onSubmit={onSubmit} className={styles.loginForm}>
      <h1 className={styles.loginHeader}>{isLogin ? 'Login' : 'Sign Up'}</h1>

      <a
        className={classNames('btn', styles.facebookAuth)}
        href="/auth/facebook"
      >
        {actionText} with Facebook
      </a>

      <a className={classNames('btn', styles.googleAuth)} href="/auth/google">
        {actionText} with Google
      </a>

      <div className={styles.loginDivider}> Or </div>

      <div className={styles.loginFields}>
        {!isLogin && (
          <div className="form-field">
            <span className="text-1">Email</span>
            <input
              name="email"
              type="email"
              className={styles.loginInput}
              placeholder="Your Email"
              value={email}
              onChange={event => setEmail(event.currentTarget.value)}
            />
          </div>
        )}

        <div className="form-field">
          <span className="text-1">Username</span>
          <input
            name="username"
            type="text"
            className={styles.loginInput}
            placeholder="Your Username"
            value={username}
            onChange={event => setUsername(event.currentTarget.value)}
          />
        </div>

        <div className="form-field">
          <span className="text-1">Password</span>
          <input
            name="password"
            type="password"
            className={styles.loginInput}
            placeholder="Your Password"
            value={password}
            onChange={event => setPassword(event.currentTarget.value)}
          />
        </div>
      </div>

      <Evil
        spamCheck={spamCheck}
        spamText={spamText}
        setSpamCheck={setSpamCheck}
        setSpamText={setSpamText}
      />

      {spamText && (
        <label className={styles.humanCheck}>
          <input
            name="human"
            type="checkbox"
            checked={humanCheck}
            onChange={event => setHumanCheck(event.target.checked)}
          />
          I am a human
        </label>
      )}

      {!isLogin && (
        <React.Fragment>
          <label className={styles.terms}>
            <input
              type="checkbox"
              checked={ageCheck}
              onChange={event => setAgeCheck(event.target.checked)}
            />
            I am at least 16 years old.
          </label>

          <label className={styles.terms}>
            <input
              type="checkbox"
              checked={termsCheck}
              onChange={event => setTermsCheck(event.target.checked)}
            />
            I have read and accepted the{' '}
            <Link className="link" to="/legal/terms-of-use">
              Terms of Service
            </Link>
            {' and '}
            <Link className="link" to="/legal/privacy-policy">
              Privacy Policy
            </Link>
            .
          </label>
        </React.Fragment>
      )}

      {errorMessage && <div className={styles.loginError}>{errorMessage}</div>}

      {isLoginFailed && (
        <div className={styles.loginError}>Login failed. Please try again.</div>
      )}

      <div className={styles.passwordRow}>
        <Tooltip
          content="Please fill out all fields and checkboxes."
          enabled={!isFilled}
        >
          <Button
            className="btn"
            type="submit"
            disabled={isLoading || !isFilled}
          >
            {actionText}
          </Button>
        </Tooltip>
      </div>

      {isLogin ? (
        <div className={styles.switchContainer}>
          {"Don't"} have an account?
          <a href="/register" className="link primary">
            Sign up
          </a>
        </div>
      ) : (
        <div className={styles.switchContainer}>
          Already have an account?
          <a href="/login" className="link primary">
            Login
          </a>
        </div>
      )}
    </form>
  );
}

export default connect(
  userSelector,
  { loginAction },
)(Login);
