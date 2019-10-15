import React from 'react';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import TextareaAutosize from 'react-textarea-autosize';
import styles from './PostPage.module.scss';
import feedStyles from '../Feed/Feed.module.scss';
import Comment from '../../containers/Comment/Comment';

interface PostPageProps {}

function PostPage(props: PostPageProps) {
  const question = 'What makes a good manager?';
  const description =
    'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor.';

  return (
    <div className={styles.postPage}>
      <div className={feedStyles.item}>
        <div className={feedStyles.vote}>
          <IoIosArrowUp />
          <span>26</span>
          <IoIosArrowDown />
        </div>

        <div className={feedStyles.itemContent}>
          <div className={feedStyles.itemHeader}>
            <span>{question}</span>
          </div>
          <div className={feedStyles.itemDescription}>{description}</div>
          <div className={feedStyles.itemActions}>
            <span>2 hours ago</span>
          </div>
        </div>
      </div>

      <div className={styles.responseSection}>
        <div className={styles.heading}>Your Comment</div>
        <div className={styles.commentBox}>
          <TextareaAutosize
            placeholder="What do you think?"
            minRows={5}
            autoFocus
          />
        </div>
        <div className={styles.commentRow}>
          <button className={styles.commentBtn} type="button">
            Comment
          </button>
        </div>
      </div>

      <div>
        <Comment>
          <Comment>
            <Comment />
          </Comment>
          <Comment />
        </Comment>
        <Comment />
        <Comment />
      </div>
    </div>
  );
}

export default PostPage;
