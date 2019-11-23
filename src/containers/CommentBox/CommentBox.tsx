import React, { useState } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import styles from './CommentBox.module.scss';
import { Button } from '../../components/Button/Button';
import { userSelector } from '../../redux/selectors';
import SignUp from '../../components/SignUp/SignUp';
import { loadDocsAction } from '../../redux/actions';
import { axiosPost } from '../../hooks/useAxios';
import { CommentDoc } from '../../../src-server/models';
import RichText from '../../components/RichText/RichText';

interface CommentBoxProps {
  question: string;
  type: 'response' | 'meta';
  editingComment?: CommentDoc;
  user?: string;
  parent_id?: string;
  actions?: any;
  onSubmit?: Function;
  loadDocsAction?: Function;
}

function CommentBox(props: CommentBoxProps) {
  const {
    question,
    type,
    editingComment,
    parent_id,
    user,
    actions,
    onSubmit,
    loadDocsAction,
  } = props;
  const initialContent = _.get(editingComment, 'content') || '';
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isFilled = _.size(_.trim(content));
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const onClickPublish = () => {
    if (isFilled && !isSubmitting) {
      setIsSubmitting(true);

      const onSuccess = () => {
        setIsSubmitting(false);
        setLastUpdate(new Date());
        onSubmit && onSubmit();
      };

      if (editingComment) {
        const { id, question_id, parent_id } = editingComment;

        axiosPost(
          '/api/comment',
          { id, question_id, parent_id, content, type, is_edited: true },
          { collection: 'comments', loadDocsAction },
        ).then(onSuccess);
      } else {
        axiosPost(
          '/api/comment',
          { question_id: question, parent_id, content, type, is_edited: false },
          { collection: 'comments', loadDocsAction },
        ).then(onSuccess);
      }
    }
  };

  let placeholder;
  let submit;

  if (editingComment) {
    placeholder = 'Edit your comment…';
    submit = 'Update';
  } else if (parent_id) {
    placeholder = 'Write your reply…';
    submit = 'Reply';
  } else if (type === 'response') {
    placeholder =
      'How would you respond to this question? What makes for a good answer? ';
    submit = 'Comment';
  } else {
    placeholder =
      'Is this a good interview question? What makes this a good or bad question?';
    submit = 'Comment';
  }

  return (
    <React.Fragment>
      {!user && (
        <div className="card">
          To comment please <SignUp />.
        </div>
      )}

      {user && (
        <div>
          <div className={styles.commentText}>
            <RichText
              placeholder={placeholder}
              content={content}
              onChange={setContent}
              lastUpdate={lastUpdate}
            />
          </div>

          <div className={styles.commentAction}>
            {actions}

            <Button className="btn" onClick={onClickPublish}>
              {submit}
            </Button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default connect(
  userSelector,
  { loadDocsAction },
)(CommentBox);
