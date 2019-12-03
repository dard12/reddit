import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import Question from '../../containers/Question/Question';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { loadDocsAction } from '../../redux/actions';
import Skeleton from '../../components/Skeleton/Skeleton';
import { Button } from '../../components/Button/Button';
import { userSelector } from '../../redux/selectors';
import SignUp from '../../components/SignUp/SignUp';

interface QuestionListPageProps {
  user?: string;
  params: any;
  seeMore?: Function;
  loadDocsAction?: Function;
}

function QuestionListPage(props: QuestionListPageProps) {
  const { user, params, seeMore, loadDocsAction } = props;
  const { result, isSuccess } = useAxiosGet('/api/question', params, {
    name: 'QuestionListPage',
    reloadOnChange: true,
  });

  useLoadDocs({ collection: 'questions', result, loadDocsAction });

  if (!isSuccess) {
    return (
      <React.Fragment>
        {_.times(6, index => (
          <Skeleton key={index} count={4} />
        ))}
      </React.Fragment>
    );
  }

  const { docs, next, page } = result;
  const accountWall = !user && page > 0;

  return (
    <React.Fragment>
      {_.isEmpty(docs) && page === 0 ? (
        <div className="card faded">No questions found.</div>
      ) : (
        _.map(docs, ({ id }) => <Question question={id} key={id} />)
      )}

      {accountWall && (
        <div className="card">
          Please <SignUp /> to see more results.
        </div>
      )}

      {!accountWall && seeMore && next && (
        <div>
          <Button className="btn" onClick={seeMore}>
            See More
          </Button>
        </div>
      )}
    </React.Fragment>
  );
}

export default connect(
  userSelector,
  { loadDocsAction },
)(QuestionListPage);
