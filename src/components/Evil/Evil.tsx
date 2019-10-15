import React from 'react';
import styles from './Evil.module.scss';

interface EvilProps {
  spamText: string;
  spamCheck: boolean;
  setSpamText: Function;
  setSpamCheck: Function;
}

function Evil(props: EvilProps) {
  const { spamText, spamCheck, setSpamCheck, setSpamText } = props;

  return (
    <React.Fragment>
      <input
        name="website"
        type="text"
        className={styles.evil}
        autoComplete="off"
        value={spamText}
        onChange={event => setSpamText(event.currentTarget.value)}
      />

      <input
        name="url"
        type="text"
        className={styles.evil}
        autoComplete="off"
        value={spamText}
        onChange={event => setSpamText(event.currentTarget.value)}
      />

      <input
        name="evil"
        type="checkbox"
        className={styles.evil}
        checked={spamCheck}
        onChange={event => setSpamCheck(event.target.checked)}
      />
    </React.Fragment>
  );
}

export default Evil;
