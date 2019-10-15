import React from 'react';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import styles from './Comment.module.scss';

interface CommentProps {
  children?: any;
}

function Comment(props: CommentProps) {
  const { children } = props;
  return (
    <div className={styles.comment}>
      <div className={styles.vote}>
        <IoIosArrowUp />
        <IoIosArrowDown />
        <div className={styles.threadLine} />
      </div>

      <div className={styles.commentContent}>
        <div>
          <span className={styles.author}>Username</span>
        </div>

        <div>
          Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat. Duis aute irure dolor. Quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
          irure dolor. Quis nostrud exercitation ullamco laboris nisi ut aliquip
          ex ea commodo consequat. Duis aute irure dolor.
        </div>

        <div className={styles.commentFooter}>
          <div className={styles.reply}> Reply </div>
          <div className={styles.timestamp}>2 hours ago</div>
        </div>

        {children}
      </div>
    </div>
  );
}

export default Comment;
