import React from 'react';
import { distanceInWordsToNow } from 'date-fns';

interface TimeAgoProps {
  timestamp: Date;
}

function TimeAgo(props: TimeAgoProps) {
  const { timestamp } = props;

  return <React.Fragment>{distanceInWordsToNow(timestamp)}</React.Fragment>;
}

export default TimeAgo;
