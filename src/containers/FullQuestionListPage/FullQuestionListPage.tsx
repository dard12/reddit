import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { loadDocsAction } from '../../redux/actions';
import Skeleton from '../../components/Skeleton/Skeleton';
import { Button } from '../../components/Button/Button';
import FullQuestion from '../FullQuestion/FullQuestion';

interface FullQuestionListPageProps {
  params: any;
  seeMore?: Function;
  loadDocsAction?: Function;
}

function FullQuestionListPage(props: FullQuestionListPageProps) {
  const { params, seeMore, loadDocsAction } = props;
  const { result, isSuccess } = useAxiosGet('/api/question', params, {
    reloadOnChange: true,
    name: 'FullQuestionListPage',
  });

  useLoadDocs({ collection: 'questions', result, loadDocsAction });

  if (!isSuccess) {
    return (
      <React.Fragment>
        {_.times(5, index => (
          <Skeleton key={index} count={4} />
        ))}
      </React.Fragment>
    );
  }

  const { docs, next, page } = result;

  return (
    <React.Fragment>
      {_.isEmpty(docs) && page === 0 ? (
        <div className="card">No posts yet.</div>
      ) : (
        _.map(docs, ({ id, last_comment }) => (
          <FullQuestion question={id} comment={last_comment} key={id} />
        ))
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
)(FullQuestionListPage);
