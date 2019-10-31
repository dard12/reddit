import React, { useState } from 'react';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import _ from 'lodash';
import { connect } from 'react-redux';
import { createSelector } from 'redux-starter-kit';
import classNames from 'classnames';
import styles from './QuestionVote.module.scss';
import { QuestionDoc, QuestionVoteDoc } from '../../../src-server/models';
import { createDocSelector, userSelector } from '../../redux/selectors';
import { loadDocsAction } from '../../redux/actions';
import { useLoadDocs, useAxiosGet } from '../../hooks/useAxios';
import SignUpModal from '../../components/SignUpModal/SignUpModal';
import WithReputation from '../WithReputation/WithReputation';
import { axios } from '../../App';
import VoteScore, { getVoteScore } from '../VoteScore/VoteScore';

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

  const [currentVote, setCurrentVote] = useState<number>();
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
    const body = { question_id: question, sent_at: new Date() };

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

          <VoteScore
            targetDoc={questionDoc}
            voteDoc={questionVoteDoc}
            currentVote={currentVote}
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

          <VoteScore
            targetDoc={questionDoc}
            voteDoc={questionVoteDoc}
            currentVote={currentVote}
          />

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
