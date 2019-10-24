import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import _ from 'lodash';
import styles from './AddQuestion.module.scss';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import history from '../../history';
import { axiosPost } from '../../hooks/useAxios';
import Tooltip from '../../components/Tooltip/Tooltip';

interface AddQuestionProps {
  closeModal: any;
}

function AddQuestion(props: AddQuestionProps) {
  const { closeModal } = props;
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createOnChange = (setContent: Function) => (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setContent(event.currentTarget.value);
  };

  const isFilled = _.size(_.trim(title)) && _.size(_.trim(description));

  const onClickPublish = () => {
    if (isFilled && !isSubmitting) {
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
        <div className={styles.questionDescription}>
          <TextareaAutosize
            placeholder="Add some details to consider when answering this question…"
            minRows={4}
            value={description}
            onChange={createOnChange(setDescription)}
          />
        </div>
        <div className={styles.questionRow}>
          <Button onClick={closeModal}>Cancel</Button>

          <Tooltip
            content="Please fill out question and details."
            enabled={!isFilled}
          >
            <Button
              className="btn"
              disabled={isSubmitting || !isFilled}
              onClick={onClickPublish}
            >
              Post Question
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default AddQuestion;
