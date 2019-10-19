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
import UserName from '../UserName/UserName';
import TimeAgo from '../../components/TimeAgo/TimeAgo';
import CommentVote from '../CommentVote/CommentVote';
import commentVoteStyles from '../CommentVote/CommentVote.module.scss';
import CommentBox from '../CommentBox/CommentBox';
import { Button } from '../../components/Button/Button';
import { getQueryParams } from '../../history';

interface CommentProps {
  comment: number;
  childrenFilter: any;
  childrenComments?: CommentDoc[];
  commentDoc?: CommentDoc;
  loadDocsAction?: Function;
}

function Comment(props: CommentProps) {
  const { comment, childrenComments, commentDoc, loadDocsAction } = props;
  const [collapsed, setCollapsed] = useState(false);
  const [replying, setReplying] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [lastLoad, setLastLoad] = useState(new Date());
  const toggleCollapsed = () => setCollapsed(!collapsed);
  const toggleReplying = () => setReplying(!replying);
  const params = { id: comment };

  const { result, isSuccess, setParams } = useAxiosGet('/api/comment', params, {
    reloadOnChange: true,
    reloadCallback: () => setLastLoad(new Date()),
  });

  const hasUpdated = lastUpdate && lastUpdate > lastLoad;

  if (hasUpdated) {
    setParams(params);
    setLastLoad(new Date());
  }

  useLoadDocs({ collection: 'comments', result, loadDocsAction });

  if (!commentDoc || !isSuccess) {
    return null;
  }

  const { author_id, content, created_at, question_id } = commentDoc;
  const validChildren = _.filter(childrenComments, ({ id }) => id !== comment);
  const type = getQueryParams('type');

  const commentOnSubmit = () => {
    setLastUpdate(new Date());
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
                  onSubmit={commentOnSubmit}
                  type={type}
                />
              </div>
            )}

            {_.map(validChildren, ({ id }) => (
              <ConnectedComment
                comment={id}
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
