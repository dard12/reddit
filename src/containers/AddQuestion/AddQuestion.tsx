import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import _ from 'lodash';
import styles from './AddQuestion.module.scss';
import { Button } from '../../components/Button/Button';
import { axios } from '../../App';
import { Input } from '../../components/Input/Input';
import history from '../../history';

interface AddQuestionProps {
  closeModal: Function;
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

  const onClickPublish = () => {
    if (_.size(_.trim(title)) && !isSubmitting) {
      setIsSubmitting(true);

      axios.post('/api/question', { title, description }).then(res => {
        const id = _.get(res, 'data.docs[0].id');
        setIsSubmitting(false);
        history.push(`/question/${id}`);
        closeModal();
      });
    }
  };

  return (
    <div className={styles.addQuestion}>
      <Input
        className={styles.questionTitle}
        placeholder="Write a question…"
        value={title}
        onChange={createOnChange(setTitle)}
      />
      <TextareaAutosize
        placeholder="Write some details for answering this question…"
        minRows={3}
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
  );
}

export default AddQuestion;
