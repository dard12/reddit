import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import Question from '../../containers/Question/Question';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { loadDocsAction } from '../../redux/actions';
import Skeleton from '../../components/Skeleton/Skeleton';
import { Button } from '../../components/Button/Button';

interface QuestionListPageProps {
  params: any;
  seeMore?: Function;
  loadDocsAction?: Function;
}

function QuestionListPage(props: QuestionListPageProps) {
  const { params, seeMore, loadDocsAction } = props;
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

  return (
    <React.Fragment>
      {_.isEmpty(docs) && page === 0 ? (
        <div className="card faded">No questions found.</div>
      ) : (
        _.map(docs, ({ id }) => <Question question={id} key={id} />)
      )}

      {seeMore && next && (
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
  null,
  { loadDocsAction },
)(QuestionListPage);
