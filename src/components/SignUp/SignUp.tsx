import React from 'react';
import { Link } from 'react-router-dom';
import history from '../../history';

interface SignUpProps {
  onClick?: any;
}

export default function SignUp(props: SignUpProps) {
  const { onClick: propOnClick } = props;
  const onClick = () => {
    const page = history.location.pathname;
    localStorage.setItem('redirect', page);
    propOnClick && propOnClick();
  };

  return (
    <span>
      <Link className="link primary" to="/register" onClick={onClick}>
        Sign up
      </Link>
      {' or '}
      <Link className="hoverLink" to="/login" onClick={onClick}>
        Login
      </Link>
    </span>
  );
}
