import React, { useState } from 'react';
import { IoIosAddCircle } from 'react-icons/io';
import { connect } from 'react-redux';
import _ from 'lodash';
import { createSelector } from 'redux-starter-kit';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { differenceInMinutes } from 'date-fns';
import styles from './Comment.module.scss';
import { CommentDoc } from '../../../src-server/models';
import { loadDocsAction } from '../../redux/actions';
import {
  createDocSelector,
  createTreeChildSelector,
  createTreeCountSelector,
  userSelector,
} from '../../redux/selectors';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import useAnchor from '../../hooks/useAnchor';
import TimeAgo from '../../components/TimeAgo/TimeAgo';
import CommentVote from '../CommentVote/CommentVote';
import commentVoteStyles from '../CommentVote/CommentVote.module.scss';
import CommentBox from '../CommentBox/CommentBox';
import { Button } from '../../components/Button/Button';
import UserLink from '../../components/UserLink/UserLink';
import Skeleton from '../../components/Skeleton/Skeleton';
import RichText from '../../components/RichText/RichText';

interface CommentProps {
  comment: string;
  depth: number;
  question: string;
  type: 'response' | 'meta';
  user?: string;
  showLink?: boolean;
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
    user,
    showLink,
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
    { name: 'Comment', cachedResult: commentDoc },
  );

  useLoadDocs({ collection: 'comments', result, loadDocsAction });

  const anchor = useAnchor(comment);

  if (!commentDoc) {
    return <Skeleton count={3} />;
  }

  const {
    author_id,
    author_name,
    content,
    created_at,
    question_id,
    type,
    down_vote,
    is_answer,
  } = commentDoc;
  const sortedComments = getSortedComments(user, childrenComments);
  const isMyComment = user === author_id;

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
          <div className={styles.collapsed} data-anchor={anchor}>
            {is_answer && <span className={styles.answerLabel}>Answer by</span>}

            <span className={styles.author}>
              <UserLink user_name={author_name} />
            </span>
            <span className={styles.collapseText} onClick={toggleCollapsed}>
              [ +{(subTreeCount || 0) + 1} ] See More
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

          <div className={styles.commentContent} data-anchor={anchor}>
            <div>
              {is_answer && (
                <span className={styles.answerLabel}>Answer by</span>
              )}
              <span className={styles.author}>
                <UserLink user_name={author_name} />
              </span>
              <span className={styles.collapseText} onClick={toggleCollapsed}>
                [ - ]
              </span>
            </div>

            <div
              className={classNames(styles.commentBody, {
                [styles.flagged]: down_vote > 5,
                [styles.strongFlagged]: down_vote > 20,
              })}
            >
              <RichText initialContent={content} readOnly />
            </div>

            <div className={styles.commentFooter}>
              <div className={styles.footerAction} onClick={toggleReplying}>
                {isMyComment ? 'Edit' : 'Reply'}
              </div>

              {showLink && (
                <Link
                  to={`/question/${question_id}?type=${type}&anchor=${comment}`}
                  className={styles.footerAction}
                >
                  Link
                </Link>
              )}

              <TimeAgo timestamp={created_at} />
            </div>

            {replying && (
              <div className={styles.replyBox}>
                <CommentBox
                  question={question_id}
                  parent_id={comment}
                  actions={<Button onClick={toggleReplying}>Cancel</Button>}
                  onSubmit={toggleReplying}
                  type={type}
                  editingComment={isMyComment ? commentDoc : undefined}
                />
              </div>
            )}

            {!hideChildren &&
              _.map(sortedComments, ({ id }) => (
                <ConnectedComment
                  question={question_id}
                  type={type}
                  comment={id}
                  depth={depth + 1}
                  key={id}
                  showLink={showLink}
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
    userSelector,
  ],
  (a, b, c, d) => ({ ...a, ...b, ...c, ...d }),
);

const ConnectedComment = connect(
  mapStateToProps,
  { loadDocsAction },
)(Comment);

export default ConnectedComment;

export function getSortedComments(user?: string, comments?: CommentDoc[]) {
  const sortedChildren = _.orderBy(comments, 'up_votes', 'desc');
  const allMyComments = _.filter(sortedChildren, { author_id: user });
  const myComment = _.first(_.orderBy(allMyComments, 'created_at', 'desc'));

  if (myComment) {
    const { id, created_at } = myComment;
    const isRecent = differenceInMinutes(new Date(), created_at) <= 1;

    if (isRecent) {
      _.remove(sortedChildren, { id });
      sortedChildren.unshift(myComment);
    }
  }

  return sortedChildren;
}
