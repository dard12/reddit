import React from 'react';
import { Link } from 'react-router-dom';

interface UserLinkProps {
  user_name: string;
  displayName?: string;
}

function UserLink(props: UserLinkProps) {
  const { user_name, displayName } = props;
  return (
    <Link className="hoverLink" to={`/profile/${user_name}`}>
      {displayName || user_name}
    </Link>
  );
}
export default UserLink;
