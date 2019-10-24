import React, { useState } from 'react';
import { IoIosAddCircle } from 'react-icons/io';
import { connect } from 'react-redux';
import _ from 'lodash';
import { createSelector } from 'redux-starter-kit';
import styles from './Comment.module.scss';
import { CommentDoc } from '../../../src-server/models';
import { loadDocsAction } from '../../redux/actions';
import {
  createDocSelector,
  createTreeChildSelector,
  createTreeCountSelector,
} from '../../redux/selectors';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import TimeAgo from '../../components/TimeAgo/TimeAgo';
import CommentVote from '../CommentVote/CommentVote';
import commentVoteStyles from '../CommentVote/CommentVote.module.scss';
import CommentBox from '../CommentBox/CommentBox';
import { Button } from '../../components/Button/Button';
import UserLink from '../../components/UserLink/UserLink';
import Skeleton from '../../components/Skeleton/Skeleton';

interface CommentProps {
  comment: number;
  depth: number;
  question: number;
  type: 'response' | 'meta';
  hideChildren?: boolean;
  subTreeCount?: number;
  childrenComments?: CommentDoc[];
  commentDoc?: CommentDoc;
  loadDocsAction?: Function;
}

function Comment(props: CommentProps) {
  const {
    comment,
    depth,
    hideChildren,
    subTreeCount,
    childrenComments,
    commentDoc,
    loadDocsAction,
  } = props;

  const [collapsed, setCollapsed] = useState(depth % 6 === 5);
  const [replying, setReplying] = useState(false);
  const toggleCollapsed = () => setCollapsed(!collapsed);
  const toggleReplying = () => setReplying(!replying);

  const { result } = useAxiosGet(
    '/api/comment',
    { id: comment },
    { name: 'Comment' },
  );

  useLoadDocs({ collection: 'comments', result, loadDocsAction });

  if (!commentDoc) {
    return <Skeleton count={3} />;
  }

  const { author_name, content, created_at, question_id, type } = commentDoc;

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
              <UserLink user_name={author_name} />
            </span>
            <span className={styles.collapseText} onClick={toggleCollapsed}>
              See More [ +{(subTreeCount || 0) + 1} ]
            </span>
          </div>
        </React.Fragment>
      )}

      {!collapsed && (
        <React.Fragment>
          <CommentVote
            comment={comment}
            threadLine={
              <div
                className={styles.threadLineContainer}
                onClick={toggleCollapsed}
              >
                <div className={styles.threadLine} />
              </div>
            }
          />

          <div className={styles.commentContent}>
            <div>
              <span className={styles.author}>
                <UserLink user_name={author_name} />
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
                  onSubmit={toggleReplying}
                  type={type}
                />
              </div>
            )}

            {!hideChildren &&
              _.map(childrenComments, ({ id }) => (
                <ConnectedComment
                  question={question_id}
                  type={type}
                  comment={id}
                  depth={depth + 1}
                  key={id}
                />
              ))}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

const mapStateToProps = createSelector(
  [
    createDocSelector({
      collection: 'comments',
      id: 'comment',
      prop: 'commentDoc',
    }),
    createTreeChildSelector(),
    createTreeCountSelector(),
  ],
  (a, b, c) => ({ ...a, ...b, ...c }),
);

const ConnectedComment = connect(
  mapStateToProps,
  { loadDocsAction },
)(Comment);

export default ConnectedComment;
