import React from 'react';
import { Link } from 'react-router-dom';

interface UserLinkProps {
  user_name: string;
}

function UserLink(props: UserLinkProps) {
  const { user_name } = props;
  return (
    <Link className="hoverLink" to={`/profile/${user_name}`}>
      {user_name}
    </Link>
  );
}
export default UserLink;
