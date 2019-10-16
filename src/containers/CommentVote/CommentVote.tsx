import React, { useState } from 'react';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import _ from 'lodash';
import { connect } from 'react-redux';
import styles from './CommentVote.module.scss';
import { CommentDoc } from '../../../src-server/models';
import { createDocSelector } from '../../redux/selectors';
import { loadDocsAction } from '../../redux/actions';
import { useLoadDocs, useAxiosGet } from '../../hooks/useAxios';

interface CommentVoteProps {
  comment: number;
  commentDoc?: CommentDoc;
  loadDocsAction?: Function;
  threadLine?: any;
}

function CommentVote(props: CommentVoteProps) {
  const { comment, commentDoc, loadDocsAction, threadLine } = props;
  const [myVote, setMyVote] = useState(0);
  const { result } = useAxiosGet(
    '/api/comment',
    { id: comment },
    { cachedResult: commentDoc },
  );

  useLoadDocs({ collection: 'comment', result, loadDocsAction });

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

export default connect(
  createDocSelector({
    collection: 'comment',
    id: 'comment',
    prop: 'commentDoc',
  }),
  { loadDocsAction },
)(CommentVote);
