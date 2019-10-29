import React, { useState } from 'react';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import { connect } from 'react-redux';
import { createSelector } from 'redux-starter-kit';
import _ from 'lodash';
import styles from './CommentVote.module.scss';
import { CommentDoc } from '../../../src-server/models';
import { createDocSelector, userSelector } from '../../redux/selectors';
import { loadDocsAction } from '../../redux/actions';
import { useLoadDocs, useAxiosGet } from '../../hooks/useAxios';
import SignUpModal from '../../components/SignUpModal/SignUpModal';
import Tooltip from '../../components/Tooltip/Tooltip';
import WithReputation from '../WithReputation/WithReputation';
import { axios } from '../../App';

interface CommentVoteProps {
  comment: string;
  user?: string;
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

  const submitVote = _.debounce((newVote: number) => {
    const body = { comment_id: comment, sent_at: new Date() };

    if (newVote === myVote) {
      axios.delete('/api/comment_vote', { data: body });
    } else if (newVote === 1) {
      axios.post('/api/comment_vote', { ...body, vote_type: 'up_vote' });
    } else if (newVote === -1) {
      axios.post('/api/comment_vote', { ...body, vote_type: 'down_vote' });
    }
  }, 500);

  const updateVote = (newVote: number) => {
    setMyVote(newVote === myVote ? 0 : newVote);
    submitVote(newVote);
  };

  const upVote = () => updateVote(1);
  const downVote = () => updateVote(-1);

  return (
    <div className={styles.vote}>
      {user ? (
        <React.Fragment>
          <IoIosArrowUp onClick={upVote} />
          <WithReputation
            user={user}
            render={(reputation: number) => (
              <Tooltip content="You can't downvote yet." enabled={!reputation}>
                <IoIosArrowDown onClick={reputation ? downVote : undefined} />
              </Tooltip>
            )}
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
