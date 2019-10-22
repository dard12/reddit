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
  createDocListSelector,
} from '../../redux/selectors';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import TimeAgo from '../../components/TimeAgo/TimeAgo';
import CommentVote from '../CommentVote/CommentVote';
import commentVoteStyles from '../CommentVote/CommentVote.module.scss';
import CommentBox from '../CommentBox/CommentBox';
import { Button } from '../../components/Button/Button';
import UserLink from '../../components/UserLink/UserLink';
import { getQueryParams } from '../../history';

interface CommentProps {
  comment: number;
  depth: number;
  childrenFilter: any;
  childrenComments?: CommentDoc[];
  commentDoc?: CommentDoc;
  loadDocsAction?: Function;
}

function Comment(props: CommentProps) {
  const {
    comment,
    depth,
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
    return null;
  }

  const { author_name, content, created_at, question_id } = commentDoc;

  const type = getQueryParams('type');
  const commentOnSubmit = () => {
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
              <UserLink user_name={author_name} />
            </span>
            <span className={styles.collapseText} onClick={toggleCollapsed}>
              [ See More +2 ]
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
                  onSubmit={commentOnSubmit}
                  type={type}
                />
              </div>
            )}

            {_.map(childrenComments, ({ id }) => (
              <ConnectedComment
                comment={id}
                depth={depth + 1}
                childrenFilter={{ parent_id: id }}
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
    createDocListSelector({
      collection: 'comments',
      filter: 'childrenFilter',
      prop: 'childrenComments',
    }),
  ],
  (a, b) => ({ ...a, ...b }),
);

const ConnectedComment = connect(
  mapStateToProps,
  { loadDocsAction },
)(Comment);

export default ConnectedComment;
