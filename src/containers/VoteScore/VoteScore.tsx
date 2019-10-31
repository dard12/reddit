import React from 'react';
import _ from 'lodash';
import {
  QuestionDoc,
  QuestionVoteDoc,
  CommentDoc,
  CommentVoteDoc,
} from '../../../src-server/models';

interface VoteScoreProps {
  targetDoc: QuestionDoc | CommentDoc;
  voteDoc?: QuestionVoteDoc | CommentVoteDoc;
  currentVote?: number;
}

function VoteScore(props: VoteScoreProps) {
  const { targetDoc, voteDoc, currentVote } = props;
  const { up_votes, down_votes } = targetDoc;

  const savedVote = getVoteScore(voteDoc);
  const score = _.sum([up_votes, -1 * down_votes, -1 * savedVote, currentVote]);
  const scoreDisplay =
    Math.abs(score) > 999 ? `${_.round(score / 1000, 1)}k` : score;

  return <span>{scoreDisplay}</span>;
}

export default VoteScore;

export function getVoteScore(voteDoc?: QuestionVoteDoc | CommentVoteDoc) {
  const vote_type = _.get(voteDoc, 'vote_type');
  const typeToNumber = {
    up_vote: 1,
    down_vote: -1,
  };

  return vote_type ? typeToNumber[vote_type] : 0;
}
