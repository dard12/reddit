import React, { useState } from 'react';
import { IoIosArrowUp, IoIosArrowDown, IoIosAddCircle } from 'react-icons/io';
import { connect } from 'react-redux';
import _ from 'lodash';
import styles from './Comment.module.scss';
import { CommentDoc } from '../../../src-server/models';
import { loadDocsAction } from '../../redux/actions';
import { createDocSelector } from '../../redux/selectors';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import UserName from '../UserName/UserName';
import TimeAgo from '../../components/TimeAgo/TimeAgo';

interface CommentProps {
  comment: number;
  allComments: CommentDoc[];
  commentDoc?: CommentDoc;
  loadDocsAction?: Function;
}

function Comment(props: CommentProps) {
  const { comment, allComments, commentDoc, loadDocsAction } = props;
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => setCollapsed(!collapsed);

  const { result } = useAxiosGet('/api/comment', { id: comment });

  useLoadDocs({ collection: 'comment', result, loadDocsAction });

  if (!commentDoc) {
    return null;
  }

  const { author_id, content, created_at } = commentDoc;
  const childrenComments = _.filter(allComments, { parent_id: comment });
  const childrenIds = _.map(childrenComments, 'id');

  return (
    <div className={styles.comment}>
      {collapsed && (
        <React.Fragment>
          <div className={styles.vote}>
            <IoIosAddCircle
              className={styles.collapseIcon}
              onClick={toggleCollapsed}
            />
          </div>
          <div className={styles.collapsed}>
            <span className={styles.author}>
              <UserName user={author_id} />
            </span>
            <span className={styles.collapseText} onClick={toggleCollapsed}>
              [ +2 ]
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
              <span className={styles.author}>
                <UserName user={author_id} />
              </span>
              <span className={styles.collapseText} onClick={toggleCollapsed}>
                [ - ]
              </span>
            </div>

            <div>{content}</div>

            <div className={styles.commentFooter}>
              <div className={styles.reply}> Reply </div>
              <div className={styles.timestamp}>
                <TimeAgo timestamp={created_at} />
              </div>
            </div>

            {_.map(childrenIds, id => (
              <Comment comment={id} allComments={allComments} />
            ))}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default connect(
  createDocSelector({
    collection: 'comment',
    id: 'comment',
    prop: 'commentDoc',
  }),
  { loadDocsAction },
)(Comment);
