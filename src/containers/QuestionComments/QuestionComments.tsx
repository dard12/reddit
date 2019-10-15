import React from 'react';
import { connect } from 'react-redux';
import Comment from '../../containers/Comment/Comment';
import { loadDocsAction } from '../../redux/actions';
import { useLoadDocs, useAxiosGet } from '../../hooks/useAxios';

interface QuestionCommentsProps {
  question: number;
  loadDocsAction?: Function;
}

function QuestionComments(props: QuestionCommentsProps) {
  const { question, loadDocsAction } = props;
  const { result } = useAxiosGet('/api/comment', { question });

  useLoadDocs({ collection: 'comment', result, loadDocsAction });

  if (!result) {
    return null;
  }

  // const docs = result.docs;

  return (
    <div>
      <Comment>
        <Comment>
          <Comment />
        </Comment>
        <Comment />
      </Comment>
      <Comment />
      <Comment />
    </div>
  );
}

export default connect(
  null,
  { loadDocsAction },
)(QuestionComments);
