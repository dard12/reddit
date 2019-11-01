import React, { useState } from 'react';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import { connect } from 'react-redux';
import { createSelector } from 'redux-starter-kit';
import _ from 'lodash';
import classNames from 'classnames';
import styles from './CommentVote.module.scss';
import { CommentVoteDoc } from '../../../src-server/models';
import { createDocSelector, userSelector } from '../../redux/selectors';
import { loadDocsAction } from '../../redux/actions';
import { useLoadDocs, useAxiosGet } from '../../hooks/useAxios';
import SignUpModal from '../../components/SignUpModal/SignUpModal';
import WithReputation from '../WithReputation/WithReputation';
import { axios } from '../../App';
import { getVoteScore } from '../QuestionVote/QuestionVote';

interface CommentVoteProps {
  comment: string;
  commentVoteDoc?: CommentVoteDoc;
  loadDocsAction?: Function;
  threadLine?: any;
  user?: string;
}

function CommentVote(props: CommentVoteProps) {
  const { comment, commentVoteDoc, loadDocsAction, threadLine, user } = props;

  const [currentVote, setCurrentVote] = useState();
  const { result, isSuccess } = useAxiosGet(
    '/api/comment_vote',
    { comment_id: comment, user_id: user },
    { cachedResult: commentVoteDoc, name: 'CommentVote' },
  );

  useLoadDocs({ collection: 'comment_votes', result, loadDocsAction });

  const savedVote = getVoteScore(commentVoteDoc);

  if (isSuccess && currentVote === undefined) {
    setCurrentVote(savedVote);
  }

  const submitVote = _.debounce(updatedVote => {
    const body = { comment_id: comment, sent_at: new Date() };

    if (updatedVote === 0) {
      axios.delete('/api/comment_vote', { data: body });
    } else if (updatedVote === 1) {
      axios.post('/api/comment_vote', { ...body, vote_type: 'up_vote' });
    } else if (updatedVote === -1) {
      axios.post('/api/comment_vote', { ...body, vote_type: 'down_vote' });
    }
  }, 500);

  const updateVote = (vote: number) => {
    const newVote = vote === currentVote ? 0 : vote;
    setCurrentVote(newVote);
    submitVote(newVote);
  };

  const upVote = () => updateVote(1);
  const downVote = () => updateVote(-1);

  return (
    <div className={styles.vote}>
      {user ? (
        <React.Fragment>
          <IoIosArrowUp
            onClick={isSuccess ? upVote : undefined}
            className={classNames({
              [styles.disabled]: !isSuccess,
              [styles.active]: currentVote === 1,
            })}
          />

          <WithReputation
            user={user}
            render={(reputation: number) => {
              const canVote = reputation && isSuccess;

              return (
                <IoIosArrowDown
                  onClick={canVote ? downVote : undefined}
                  className={classNames({
                    [styles.disabled]: !canVote,
                    [styles.active]: currentVote === -1,
                  })}
                />
              );
            }}
          />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <SignUpModal
            buttonChildren={<IoIosArrowUp />}
            prompt="To vote please "
          />
          <SignUpModal
            buttonChildren={<IoIosArrowDown />}
            prompt="To vote please "
          />
        </React.Fragment>
      )}

      {threadLine}
    </div>
  );
}

const mapStateToProps = createSelector(
  [
    createDocSelector({
      collection: 'comment_votes',
      id: 'comment',
      prop: 'commentVoteDoc',
    }),
    userSelector,
  ],
  (a, b) => ({ ...a, ...b }),
);

export default connect(
  mapStateToProps,
  { loadDocsAction },
)(CommentVote);
