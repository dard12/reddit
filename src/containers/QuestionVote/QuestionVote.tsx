import React, { useState } from 'react';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import _ from 'lodash';
import { connect } from 'react-redux';
import { createSelector } from 'redux-starter-kit';
import styles from './QuestionVote.module.scss';
import { QuestionDoc } from '../../../src-server/models';
import { createDocSelector, userSelector } from '../../redux/selectors';
import { loadDocsAction } from '../../redux/actions';
import { useLoadDocs, useAxiosGet } from '../../hooks/useAxios';
import SignUpModal from '../../components/SignUpModal/SignUpModal';
import WithReputation from '../WithReputation/WithReputation';
import Tooltip from '../../components/Tooltip/Tooltip';
import { axios } from '../../App';

interface QuestionVoteProps {
  question: string;
  questionDoc?: QuestionDoc;
  user?: string;
  loadDocsAction?: Function;
}

function QuestionVote(props: QuestionVoteProps) {
  const { question, questionDoc, user, loadDocsAction } = props;
  const [myVote, setMyVote] = useState(0);
  const { result } = useAxiosGet(
    '/api/question',
    { id: question },
    { name: 'QuestionVote', cachedResult: questionDoc },
  );

  useLoadDocs({ collection: 'questions', result, loadDocsAction });

  const up_vote = _.get(questionDoc, 'up_votes') || 0;
  const down_vote = _.get(questionDoc, 'down_votes') || 0;
  const score = up_vote - down_vote + myVote;
  const scoreDisplay =
    Math.abs(score) > 999 ? `${_.round(score / 1000, 1)}k` : score;

  const submitVote = _.debounce((newVote: number) => {
    const body = {
      subject_id: question,
      sent_at: new Date(),
    };

    if (newVote === 1) {
      axios.post('/api/question_vote', { ...body, action: 'up_vote' });
    } else if (newVote === -1) {
      axios.post('/api/question_vote', { ...body, action: 'down_vote' });
    } else {
      axios.delete('/api/question_vote', { params: body });
    }
  }, 2000);

  const updateVote = (newVote: number) => {
    setMyVote(newVote);
    submitVote(newVote);
  };

  const upVote = () => updateVote(Math.min(myVote + 1, 1));
  const downVote = () => updateVote(Math.max(myVote - 1, -1));

  return (
    <div className={styles.vote}>
      {user ? (
        <React.Fragment>
          <IoIosArrowUp onClick={upVote} />
          <span>{questionDoc && scoreDisplay}</span>
          <WithReputation
            user={user}
            render={(reputation: number) => {
              const canVote = reputation || myVote === 1;

              return (
                <Tooltip content="You can't downvote yet." enabled={!canVote}>
                  <IoIosArrowDown onClick={canVote ? downVote : undefined} />
                </Tooltip>
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
          <span>{questionDoc && scoreDisplay}</span>
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
      collection: 'questions',
      id: 'question',
      prop: 'questionDoc',
    }),
    userSelector,
  ],
  (a, b) => ({ ...a, ...b }),
);

export default connect(
  mapStateToProps,
  { loadDocsAction },
)(QuestionVote);
