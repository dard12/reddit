import React, { useState, useEffect } from 'react';
import { Button } from '../Button/Button';
import styles from './Truncate.module.scss';

interface TruncateProps {
  children?: any;
  shouldTruncate?: boolean;
}

function Truncate(props: TruncateProps) {
  const { children, shouldTruncate } = props;
  const [truncated, setTruncated] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!truncated && shouldTruncate) {
      setTruncated(true);
    }
  }, [truncated, shouldTruncate]);

  const toggleExpanded = (event: any) => {
    event.preventDefault();
    setExpanded(!expanded);
  };

  return (
    <React.Fragment>
      {truncated && !expanded && (
        <div className={styles.truncateContainer}>
          <div className={styles.verticalTruncate}>{children}</div>

          <Button className={styles.toggleLink} onClick={toggleExpanded}>
            See More
          </Button>
        </div>
      )}

      {(!truncated || expanded) && children}
    </React.Fragment>
  );
}

export default Truncate;
