import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Comment from '../../containers/Comment/Comment';
import { loadDocsAction } from '../../redux/actions';
import { useLoadDocs, useAxiosGet } from '../../hooks/useAxios';
import Skeleton from '../../components/Skeleton/Skeleton';
import styles from './CommentList.module.scss';
import { CommentDoc } from '../../../src-server/models';

interface CommentListProps {
  params: any;
  loadDocsAction?: Function;
}

function CommentList(props: CommentListProps) {
  const { params, loadDocsAction } = props;
  const { result, isSuccess } = useAxiosGet('/api/comment', params, {
    reloadOnChange: true,
    name: 'CommentList',
  });

  useLoadDocs({ collection: 'comments', result, loadDocsAction });

  if (!isSuccess) {
    return <Skeleton count={4} />;
  }

  const { docs } = result;

  return (
    <div>
      {_.isEmpty(docs) ? (
        <div className="card">No comments yet.</div>
      ) : (
        <div className={styles.commentList}>
          {_.map(docs, ({ id }) => (
            <div className={styles.comment}>
              <Comment
                comment={id}
                key={id}
                depth={4}
                childrenFilter={(commentDoc: CommentDoc) =>
                  commentDoc.parent_id === id && commentDoc.id !== id
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default connect(
  null,
  { loadDocsAction },
)(CommentList);
