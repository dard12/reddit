import React, { useState } from 'react';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import { connect } from 'react-redux';
import { createSelector } from 'redux-starter-kit';
import styles from './CommentVote.module.scss';
import { CommentDoc } from '../../../src-server/models';
import { createDocSelector, userSelector } from '../../redux/selectors';
import { loadDocsAction } from '../../redux/actions';
import { useLoadDocs, useAxiosGet } from '../../hooks/useAxios';

interface CommentVoteProps {
  comment: number;
  user?: number;
  commentDoc?: CommentDoc;
  loadDocsAction?: Function;
  threadLine?: any;
}

function CommentVote(props: CommentVoteProps) {
  const { comment, user, commentDoc, loadDocsAction, threadLine } = props;
  const [myVote, setMyVote] = useState(0);
  const { result } = useAxiosGet(
    '/api/comment',
    { id: comment },
    { cachedResult: commentDoc, name: 'CommentVote' },
  );

  useLoadDocs({ collection: 'comments', result, loadDocsAction });

  const upVote = () => setMyVote(1);
  const downVote = () => setMyVote(-1);

  return (
    <div className={styles.vote}>
      <IoIosArrowUp onClick={upVote} />
      <IoIosArrowDown onClick={downVote} />
      {threadLine}
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
    userSelector,
  ],
  (a, b) => ({ ...a, ...b }),
);

export default connect(
  mapStateToProps,
  { loadDocsAction },
)(CommentVote);
