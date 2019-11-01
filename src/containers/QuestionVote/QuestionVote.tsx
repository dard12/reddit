import React, { useState } from 'react';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import _ from 'lodash';
import { connect } from 'react-redux';
import { createSelector } from 'redux-starter-kit';
import classNames from 'classnames';
import styles from './QuestionVote.module.scss';
import {
  QuestionDoc,
  QuestionVoteDoc,
  CommentDoc,
  CommentVoteDoc,
} from '../../../src-server/models';
import { createDocSelector, userSelector } from '../../redux/selectors';
import { loadDocsAction } from '../../redux/actions';
import { useLoadDocs, useAxiosGet } from '../../hooks/useAxios';
import SignUpModal from '../../components/SignUpModal/SignUpModal';
import WithReputation from '../WithReputation/WithReputation';
import { axios } from '../../App';

interface QuestionVoteProps {
  question: string;
  questionDoc: QuestionDoc;
  questionVoteDoc?: QuestionVoteDoc;
  user?: string;
  loadDocsAction?: Function;
}

function QuestionVote(props: QuestionVoteProps) {
  const {
    question,
    questionDoc,
    questionVoteDoc,
    user,
    loadDocsAction,
  } = props;

  const [currentVote, setCurrentVote] = useState();
  const { result, isSuccess } = useAxiosGet(
    '/api/question_vote',
    { question_id: question, user_id: user },
    { name: 'QuestionVote', cachedResult: questionVoteDoc },
  );

  useLoadDocs({ collection: 'question_votes', result, loadDocsAction });

  const savedVote = getVoteScore(questionVoteDoc);

  if (isSuccess && currentVote === undefined) {
    setCurrentVote(savedVote);
  }

  const submitVote = _.debounce(updatedVote => {
    const body = { question_id: question };

    if (updatedVote === 0) {
      axios.delete('/api/question_vote', { data: body });
    } else if (updatedVote === 1) {
      axios.post('/api/question_vote', { ...body, vote_type: 'up_vote' });
    } else if (updatedVote === -1) {
      axios.post('/api/question_vote', { ...body, vote_type: 'down_vote' });
    }
  }, 500);

  const updateVote = (vote: number) => {
    const newVote = vote === currentVote ? 0 : vote;
    setCurrentVote(newVote);
    submitVote(newVote);
  };

  const upVote = () => updateVote(1);
  const downVote = () => updateVote(-1);

  const scoreDisplay = getScoreDisplay({
    targetDoc: questionDoc,
    voteDoc: questionVoteDoc,
    currentVote,
  });

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

          <span>{scoreDisplay}</span>

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

          <span>{scoreDisplay}</span>

          <SignUpModal
            buttonChildren={<IoIosArrowDown />}
            prompt="To vote please "
          />
        </React.Fragment>
      )}
    </div>
  );
}

const mapStateToProps = createSelector(
  [
    createDocSelector({
      collection: 'question_votes',
      id: 'question',
      prop: 'questionVoteDoc',
    }),
    userSelector,
  ],
  (a, b) => ({ ...a, ...b }),
);

export default connect(
  mapStateToProps,
  { loadDocsAction },
)(QuestionVote);

export function getScoreDisplay({
  targetDoc,
  voteDoc,
  currentVote,
}: {
  targetDoc: QuestionDoc | CommentDoc;
  voteDoc?: QuestionVoteDoc | CommentVoteDoc;
  currentVote?: number;
}) {
  const { up_votes, down_votes } = targetDoc;
  const savedVote = getVoteScore(voteDoc);
  const score = _.sum([up_votes, -1 * down_votes, -1 * savedVote, currentVote]);

  return Math.abs(score) > 999 ? `${_.round(score / 1000, 1)}k` : score;
}

export function getVoteScore(voteDoc?: QuestionVoteDoc | CommentVoteDoc) {
  const vote_type = _.get(voteDoc, 'vote_type');
  const typeToNumber: any = {
    up_vote: 1,
    down_vote: -1,
  };

  return vote_type ? typeToNumber[vote_type] : 0;
}
