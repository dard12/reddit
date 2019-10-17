import React from 'react';
import { Link } from 'react-router-dom';
import history from '../../history';

export default function SignUp() {
  const onClick = () => {
    const page = history.location.pathname;
    localStorage.setItem('redirect', page);
  };

  return (
    <span>
      <Link className="link pink" to="/register" onClick={onClick}>
        Sign up
      </Link>
      {' or '}
      <Link className="link pink" to="/login" onClick={onClick}>
        Login
      </Link>
    </span>
  );
}
