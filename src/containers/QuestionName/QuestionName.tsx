import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { QuestionDoc } from '../../../src-server/models';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { createDocSelector } from '../../redux/selectors';
import { loadDocsAction } from '../../redux/actions';
import Skeleton from '../../components/Skeleton/Skeleton';

interface QuestionNameProps {
  question: number;
  className?: string;
  questionDoc?: QuestionDoc;
  loadDocsAction?: Function;
}

function QuestionName(props: QuestionNameProps) {
  const { question, className, questionDoc, loadDocsAction } = props;
  const { result, isSuccess } = useAxiosGet(
    '/api/question',
    { id: question },
    { cachedResult: questionDoc, name: 'Question' },
  );

  useLoadDocs({ collection: 'questions', result, loadDocsAction });

  if (!questionDoc || !isSuccess) {
    return <Skeleton count={1} />;
  }

  const { title } = questionDoc;
  const questionLink = `/question/${question}`;

  return (
    <Link to={`${questionLink}?type=response`} className={className}>
      <span>{title}</span>
    </Link>
  );
}

export default connect(
  createDocSelector({
    collection: 'questions',
    id: 'question',
    prop: 'questionDoc',
  }),
  { loadDocsAction },
)(QuestionName);
