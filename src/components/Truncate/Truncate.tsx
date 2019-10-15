import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Button } from '../Button/Button';
import styles from './Truncate.module.scss';

interface TruncateProps {
  content?: any;
}

function Truncate(props: TruncateProps) {
  const { content } = props;
  const [truncated, setTruncated] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const charLength = _.size(content);
  const newlines = _.size(content.match(/\n/g));

  useEffect(() => {
    const shouldTruncate = charLength > 200 || newlines > 3;

    if (!truncated && shouldTruncate) {
      setTruncated(true);
    }

    if (truncated && !shouldTruncate) {
      setTruncated(false);
    }
  }, [charLength, newlines, truncated]);

  const toggleExpanded = (event: any) => {
    event.preventDefault();
    setExpanded(!expanded);
  };

  return (
    <React.Fragment>
      {truncated && !expanded && (
        <React.Fragment>
          {_.truncate(_.replace(content, /\n/g, ' '), { length: 200 })}

          <Button className={styles.toggleLink} onClick={toggleExpanded}>
            See More
          </Button>
        </React.Fragment>
      )}

      {(!truncated || expanded) && content}

      {expanded && (
        <React.Fragment>
          <Button className={styles.toggleLink} onClick={toggleExpanded}>
            See Less
          </Button>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default Truncate;
