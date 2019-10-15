import React, { useState } from 'react';
import { IoIosArrowUp, IoIosArrowDown, IoIosAddCircle } from 'react-icons/io';
import styles from './Comment.module.scss';

interface CommentProps {
  children?: any;
}

function Comment(props: CommentProps) {
  const { children } = props;
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => setCollapsed(!collapsed);

  return (
    <div className={styles.comment}>
      {collapsed && (
        <React.Fragment>
          <div className={styles.vote}>
            <IoIosAddCircle onClick={toggleCollapsed} />
          </div>
          <div className={styles.collapsed}>
            <span className={styles.author}>Username</span>
            <span className={styles.collapse} onClick={toggleCollapsed}>
              [+2]
            </span>
          </div>
        </React.Fragment>
      )}

      {!collapsed && (
        <React.Fragment>
          <div className={styles.vote}>
            <IoIosArrowUp />
            <IoIosArrowDown />
            <div className={styles.threadLine} onClick={toggleCollapsed} />
          </div>
          <div className={styles.commentContent}>
            <div>
              <span className={styles.author}>Username</span>
              <span className={styles.collapse} onClick={toggleCollapsed}>
                [-]
              </span>
            </div>

            <div>
              Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
              commodo consequat. Duis aute irure dolor. Quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat. Duis aute irure dolor. Quis nostrud exercitation
              ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
              irure dolor.
            </div>

            <div className={styles.commentFooter}>
              <div className={styles.reply}> Reply </div>
              <div className={styles.timestamp}>2 hours ago</div>
            </div>

            {children}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default Comment;
