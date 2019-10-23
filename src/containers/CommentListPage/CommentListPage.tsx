import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { loadDocsAction } from '../../redux/actions';
import Skeleton from '../../components/Skeleton/Skeleton';
import { Button } from '../../components/Button/Button';
import Comment from '../Comment/Comment';
import styles from './CommentListPage.module.scss';

interface CommentListPageProps {
  params: any;
  seeMore?: Function;
  loadDocsAction?: Function;
}

function CommentListPage(props: CommentListPageProps) {
  const { params, seeMore, loadDocsAction } = props;
  const { result, isSuccess } = useAxiosGet('/api/comment', params, {
    reloadOnChange: true,
    name: 'CommentListPage',
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
        <div className="card">No comments found.</div>
      ) : (
        _.map(docs, ({ id }) => (
          <div className={styles.comment}>
            <Comment comment={id} depth={0} childrenFilter={false} key={id} />
          </div>
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
)(CommentListPage);
