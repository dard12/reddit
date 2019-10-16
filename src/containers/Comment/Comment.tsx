import React, { useState } from 'react';
import { IoIosAddCircle } from 'react-icons/io';
import { connect } from 'react-redux';
import _ from 'lodash';
import styles from './Comment.module.scss';
import { CommentDoc } from '../../../src-server/models';
import { loadDocsAction } from '../../redux/actions';
import { createDocSelector } from '../../redux/selectors';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import UserName from '../UserName/UserName';
import TimeAgo from '../../components/TimeAgo/TimeAgo';
import CommentVote from '../CommentVote/CommentVote';
import commentVoteStyles from '../CommentVote/CommentVote.module.scss';

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

  useLoadDocs({ collection: 'comments', result, loadDocsAction });

  if (!commentDoc) {
    return null;
  }

  const { author_id, content, created_at } = commentDoc;
  const childrenComments = _.filter(allComments, { parent_id: comment });
  const childrenIds = _.without(_.map(childrenComments, 'id'), comment);

  console.log({ allComments });
  console.log({ childrenComments, childrenIds });

  return (
    <div className={styles.comment}>
      {collapsed && (
        <React.Fragment>
          <div className={commentVoteStyles.vote}>
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
          <CommentVote
            comment={comment}
            threadLine={
              <div className={styles.threadLine} onClick={toggleCollapsed} />
            }
          />

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
              <Comment comment={id} allComments={allComments} key={id} />
            ))}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default connect(
  createDocSelector({
    collection: 'comments',
    id: 'comment',
    prop: 'commentDoc',
  }),
  { loadDocsAction },
)(Comment);
