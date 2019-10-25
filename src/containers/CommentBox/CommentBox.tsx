import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import _ from 'lodash';
import { connect } from 'react-redux';
import styles from './CommentBox.module.scss';
import { Button } from '../../components/Button/Button';
import { userSelector } from '../../redux/selectors';
import SignUp from '../../components/SignUp/SignUp';
import { loadDocsAction } from '../../redux/actions';
import { axiosPost } from '../../hooks/useAxios';
import { CommentDoc } from '../../../src-server/models';

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
  const [content, setContent] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.currentTarget.value);
  };

  const isFilled = _.size(_.trim(content));

  const onClickPublish = () => {
    if (isFilled && !isSubmitting) {
      setIsSubmitting(true);

      const fullContent = editingComment
        ? `${editingComment.content}\n[EDIT]: \n${content}`
        : content;

      axiosPost(
        '/api/comment',
        {
          question_id: question,
          parent_id,
          content: fullContent,
          type,
          is_edited: Boolean(editingComment),
        },
        { collection: 'comments', loadDocsAction },
      ).then(() => {
        setIsSubmitting(false);
        setContent('');
        onSubmit && onSubmit();
      });
    }
  };

  let placeholder;
  let submit;

  if (editingComment) {
    placeholder = 'Add an edit to your comment…';
    submit = 'Add Edit';
  } else if (parent_id) {
    placeholder = 'Write your reply…';
    submit = 'Reply';
  } else if (type === 'response') {
    placeholder = 'How would you respond to this question?';
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
        <React.Fragment>
          <div className={styles.commentText}>
            <TextareaAutosize
              placeholder={placeholder}
              minRows={4}
              value={content}
              onChange={onChange}
            />
          </div>

          <div className={styles.commentAction}>
            {actions}

            <Button className="btn" onClick={onClickPublish}>
              {submit}
            </Button>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default connect(
  userSelector,
  { loadDocsAction },
)(CommentBox);
