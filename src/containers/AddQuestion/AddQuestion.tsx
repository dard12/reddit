import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import _ from 'lodash';
import { connect } from 'react-redux';
import styles from './AddQuestion.module.scss';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import history from '../../history';
import { axiosPost } from '../../hooks/useAxios';
import { userSelector } from '../../redux/selectors';
import SignUp from '../../components/SignUp/SignUp';

interface AddQuestionProps {
  user?: string;
  closeModal: any;
}

function AddQuestion(props: AddQuestionProps) {
  const { user, closeModal } = props;
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createOnChange = (setContent: Function) => (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setContent(event.currentTarget.value);
  };

  const onClickPublish = () => {
    if (_.size(_.trim(title)) && !isSubmitting) {
      setIsSubmitting(true);

      axiosPost('/api/question', { title, description }).then(({ docs }) => {
        const id = _.get(docs, '[0].id');
        setIsSubmitting(false);
        history.push(`/question/${id}`);
        closeModal();
      });
    }
  };

  return (
    <React.Fragment>
      {!user && (
        <div className={styles.addQuestionSignup}>
          To add a question please <SignUp onClick={closeModal} />.
        </div>
      )}

      {user && (
        <div className={styles.addQuestion}>
          <div className={styles.guidelineContainer}>
            <div className="heading-0">Community Guidelines</div>
            <div>
              <b>1.</b> Be human.
            </div>
            <div>
              <b>2.</b> Search for duplicates before you post.
            </div>
            <div>
              <b>3.</b> Provide thoughtful details.
            </div>
          </div>

          <div className={styles.questionContainer}>
            <Input
              className={styles.questionTitle}
              placeholder="Write your question…"
              value={title}
              onChange={createOnChange(setTitle)}
            />
            <TextareaAutosize
              placeholder="Add some details to consider when answering this question…"
              minRows={4}
              value={description}
              onChange={createOnChange(setDescription)}
            />
            <div className={styles.questionRow}>
              <Button onClick={closeModal}>Cancel</Button>

              <Button className="btn" onClick={onClickPublish}>
                Post Question
              </Button>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default connect(userSelector)(AddQuestion);
