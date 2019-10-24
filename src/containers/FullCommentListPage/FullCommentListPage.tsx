import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { loadDocsAction } from '../../redux/actions';
import Skeleton from '../../components/Skeleton/Skeleton';
import { Button } from '../../components/Button/Button';
import FullComment from '../FullComment/FullComment';

interface FullCommentListPageProps {
  params: any;
  seeMore?: Function;
  loadDocsAction?: Function;
}

function FullCommentListPage(props: FullCommentListPageProps) {
  const { params, seeMore, loadDocsAction } = props;
  const { result, isSuccess } = useAxiosGet('/api/comment', params, {
    reloadOnChange: true,
    name: 'FullCommentListPage',
  });

  useLoadDocs({ collection: 'comments', result, loadDocsAction });

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
        <div className="card">No comments yet.</div>
      ) : (
        _.map(docs, commentDoc => (
          <FullComment
            commentDoc={commentDoc}
            question={commentDoc.question_id}
            key={commentDoc.id}
          />
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
)(FullCommentListPage);
