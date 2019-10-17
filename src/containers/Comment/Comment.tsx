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
import CommentBox from '../CommentBox/CommentBox';
import { Button } from '../../components/Button/Button';

interface CommentProps {
  comment: number;
  allComments: CommentDoc[];
  commentDoc?: CommentDoc;
  loadDocsAction?: Function;
}

function Comment(props: CommentProps) {
  const { comment, allComments, commentDoc, loadDocsAction } = props;
  const [collapsed, setCollapsed] = useState(false);
  const [replying, setReplying] = useState(false);
  const toggleCollapsed = () => setCollapsed(!collapsed);
  const toggleReplying = () => setReplying(!replying);

  const { result } = useAxiosGet(
    '/api/comment',
    { id: comment },
    { cachedResult: commentDoc },
  );

  useLoadDocs({ collection: 'comments', result, loadDocsAction });

  if (!commentDoc) {
    return null;
  }

  const { author_id, content, created_at, question_id } = commentDoc;
  const childrenComments = _.filter(
    allComments,
    ({ id, parent_id }) => id !== comment && parent_id === comment,
  );

  const afterSubmit = () => {
    toggleReplying();
  };

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
              <div className={styles.reply} onClick={toggleReplying}>
                Reply
              </div>
              <div className={styles.timestamp}>
                <TimeAgo timestamp={created_at} />
              </div>
            </div>

            {replying && (
              <div className={styles.replyBox}>
                <CommentBox
                  question={question_id}
                  parent_id={comment}
                  actions={<Button onClick={toggleReplying}>Cancel</Button>}
                  afterSubmit={afterSubmit}
                />
              </div>
            )}

            {_.map(childrenComments, ({ id }) => (
              <ConnectedComment
                comment={id}
                allComments={allComments}
                key={id}
              />
            ))}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

const ConnectedComment = connect(
  createDocSelector({
    collection: 'comments',
    id: 'comment',
    prop: 'commentDoc',
  }),
  { loadDocsAction },
)(Comment);

export default ConnectedComment;
