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

  const [myVote, setMyVote] = useState<number | undefined>();
  const { result, isSuccess } = useAxiosGet(
    '/api/question_vote',
    { question_id: question, user_id: user },
    { name: 'QuestionVote', cachedResult: questionVoteDoc },
  );

  useLoadDocs({ collection: 'question_votes', result, loadDocsAction });

  const isLoaded = myVote !== undefined;

  if (isSuccess && !isLoaded) {
    const vote_type = _.get(questionVoteDoc, 'vote_type');
    const existingVote = vote_type === 'up_vote' ? 1 : -1;

    setMyVote(questionVoteDoc ? existingVote : 0);
  }

  const { up_votes, down_votes } = questionDoc;
  const score = _.sum([up_votes, -1 * down_votes, myVote]);
  const scoreDisplay =
    Math.abs(score) > 999 ? `${_.round(score / 1000, 1)}k` : score;

  const submitVote = _.debounce(newVote => {
    const body = { question_id: question, sent_at: new Date() };

    if (newVote === 0) {
      axios.delete('/api/question_vote', { data: body });
    } else if (newVote === 1) {
      axios.post('/api/question_vote', { ...body, vote_type: 'up_vote' });
    } else if (newVote === -1) {
      axios.post('/api/question_vote', { ...body, vote_type: 'down_vote' });
    }
  }, 2000);

  const updateVote = (vote: number) => {
    const newVote = vote === myVote ? 0 : vote;
    setMyVote(newVote);
    submitVote(newVote);
  };

  const upVote = () => updateVote(1);
  const downVote = () => updateVote(-1);

  return (
    <div className={styles.vote}>
      {user ? (
        <React.Fragment>
          <IoIosArrowUp
            onClick={isLoaded ? upVote : undefined}
            className={classNames({
              [styles.disabled]: !isLoaded,
              [styles.active]: myVote === 1,
            })}
          />

          <span>{scoreDisplay}</span>

          <WithReputation
            user={user}
            render={(reputation: number) => {
              const canVote = reputation && isLoaded;

              return (
                <IoIosArrowDown
                  onClick={canVote ? downVote : undefined}
                  className={classNames({
                    [styles.disabled]: !canVote,
                    [styles.active]: myVote === -1,
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
