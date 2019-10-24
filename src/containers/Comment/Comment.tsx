import React, { useState, useEffect } from 'react';
import { IoIosAddCircle } from 'react-icons/io';
import { connect } from 'react-redux';
import _ from 'lodash';
import { createSelector } from 'redux-starter-kit';
import { Link } from 'react-router-dom';
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
import { getQueryParams } from '../../history';

interface CommentProps {
  comment: string;
  depth: number;
  question: string;
  type: 'response' | 'meta';
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
    { name: 'Comment' },
  );

  useLoadDocs({ collection: 'comments', result, loadDocsAction });

  const isTarget = getQueryParams('anchor') === comment;
  const anchor = `id_${comment}`;
  const targetOffset = isTarget
    ? _.get(document.querySelector(`[data-anchor="${anchor}"]`), 'offsetTop')
    : false;

  useEffect(() => {
    targetOffset && window.scrollTo(0, targetOffset);
  }, [targetOffset]);

  if (!commentDoc) {
    return <Skeleton count={3} />;
  }

  const { author_name, content, created_at, question_id, type } = commentDoc;
  const isAnswer = type === 'response' && depth === 0;

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
            {isAnswer && <span className={styles.answerLabel}>Answer by</span>}

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

          <div className={styles.commentContent} data-anchor={anchor}>
            <div>
              {isAnswer && (
                <span className={styles.answerLabel}>Answer by</span>
              )}
              <span className={styles.author}>
                <UserLink user_name={author_name} />
              </span>
              <span className={styles.collapseText} onClick={toggleCollapsed}>
                [ - ]
              </span>
            </div>

            <div className={styles.commentBody}>{content}</div>

            <div className={styles.commentFooter}>
              <div className={styles.footerAction} onClick={toggleReplying}>
                Reply
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
  ],
  (a, b, c) => ({ ...a, ...b, ...c }),
);

const ConnectedComment = connect(
  mapStateToProps,
  { loadDocsAction },
)(Comment);

export default ConnectedComment;
