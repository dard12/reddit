import React from 'react';
import _ from 'lodash';
import { IoIosAddCircle } from 'react-icons/io';
import styles from './VideoList.module.scss';
import responseStyles from '../Response/Response.module.scss';
import Response from '../Response/Response';
import { getUserResponses, getUserDoc } from '../../hardcoded';
import { getQueryParams } from '../../history';
import Modal from '../../components/Modal/Modal';
import QuestionBank from '../QuestionBank/QuestionBank';

interface VideoListProps {
  user: string;
}

export default function VideoList(props: VideoListProps) {
  const { user } = props;
  const responseList = getUserResponses(user);
  const { summary } = getUserDoc(user);
  const edit = getQueryParams('edit');

  return (
    <div className={styles.list}>
      {summary && (
        <div className={responseStyles.section}>
          <div className={responseStyles.sectionHeader}>Summary</div>
          <div className={styles.summary}>{summary}</div>
        </div>
      )}

      {edit && (
        <Modal
          buttonClassName={styles.addQuestion}
          buttonChildren={
            <React.Fragment>
              <IoIosAddCircle />
              Add a Question
            </React.Fragment>
          }
          render={closeModal => (
            <React.Fragment>
              <div className={styles.questionHeader}>Add a Question</div>
              <QuestionBank
                closeModal={closeModal}
                className={styles.questionContainer}
                addButton
              />
            </React.Fragment>
          )}
        />
      )}

      {_.isEmpty(responseList) ? (
        <div className="faded card">No information yet.</div>
      ) : (
        _.map(responseList, responseDoc => (
          <Response responseDoc={responseDoc} key={responseDoc.id} />
        ))
      )}
    </div>
  );
}
