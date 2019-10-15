import React from 'react';
import _ from 'lodash';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import { getQuestions } from '../../hardcoded';
import styles from './Feed.module.scss';
import { Link } from 'react-router-dom';

interface FeedProps {}

function Feed(props: FeedProps) {
  const docs = getQuestions();

  return (
    <div className={styles.feedPage}>
      <div className={styles.feedTabs}>
        <div className={styles.feedTabActive}>Technical Skill</div>
        <div>Team Fit</div>
        <div>Personal Motivation</div>
        <div>Fun / Other</div>
      </div>

      {_.map(docs, ({ question, description, id }) => (
        <Link to="/post" className={styles.item} key={id}>
          <div className={styles.vote}>
            <IoIosArrowUp />
            <span>26</span>
            <IoIosArrowDown />
          </div>

          <div className={styles.itemContent}>
            <div className={styles.itemHeader}>
              <span>{question}</span>
            </div>
            <div className={styles.itemDescription}>{description}</div>
            <div className={styles.itemActions}>
              <span className={styles.itemComment}>17 comments</span>
              <span>2 hours ago</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Feed;
