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

  const up_vote = _.get(questionDoc, 'up_vote') || 0;
  const down_vote = _.get(questionDoc, 'down_vote') || 0;
  const score = up_vote - down_vote + myVote;
  const scoreDisplay =
    Math.abs(score) > 999 ? `${_.round(score / 1000, 1)}k` : score;

  const upVote = () => setMyVote(Math.min(myVote + 1, 1));
  const downVote = () => setMyVote(Math.max(myVote - 1, -1));

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
