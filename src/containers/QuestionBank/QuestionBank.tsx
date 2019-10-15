import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { connect } from 'react-redux';
import styles from './QuestionBank.module.scss';
import { getQuestions } from '../../hardcoded';
import responseStyles from '../Response/Response.module.scss';
// import { getQueryParams, setQueryParams } from '../../history';
import QuestionTabs from '../QuestionTabs/QuestionTabs';
import QuestionSearch from '../QuestionSearch/QuestionSearch';
// import { useAxiosGet } from '../../hooks/useAxios';
import Skeleton from '../../components/Skeleton/Skeleton';
import { loadDocsAction } from '../../redux/actions';
import Tag from '../Tag/Tag';
// import { axios } from '../../App';
// import { useLoadDocs } from '../../hooks/useAxios';

interface QuestionBankProps {
  closeModal?: any;
  addButton?: boolean;
  loadDocsAction?: Function;
  className?: string;
}

function QuestionBank(props: QuestionBankProps) {
  const { closeModal, addButton, className = styles.questionContainer } = props;
  // const tag = getQueryParams('tag');
  // const search = getQueryParams('search');

  // const { result, isReady } = useAxiosGet(
  //   '/api/question',
  //   { tag, search },
  //   { reloadOnChange: true },
  // );

  // useLoadDocs({ collection: 'question', result, loadDocsAction });

  // const docs = _.get(result, 'docs');

  const isReady = true;
  const docs = getQuestions();

  const onSubmit = () => {
    // axios.post('/api/response', { ... }).then(() => closeModal());

    closeModal();
  };

  return (
    <div className={className}>
      <QuestionSearch />
      <QuestionTabs />

      {isReady ? (
        _.map(docs, ({ question, description, id, tag }) => (
          <div
            className={classNames(responseStyles.section, styles.question)}
            id={id}
            key={id}
            onClick={addButton ? onSubmit : undefined}
          >
            <div className={responseStyles.sectionHeader}>
              {question}
              <Tag tag={tag} />
            </div>

            <div className={responseStyles.sectionDescription}>
              {description}
            </div>

            {addButton && (
              <div className={styles.selectQuestion}>Add to Profile</div>
            )}
          </div>
        ))
      ) : (
        <React.Fragment>
          {_.times(3, index => (
            <Skeleton card count={4} key={index} />
          ))}
        </React.Fragment>
      )}
    </div>
  );
}

export default connect(
  null,
  { loadDocsAction },
)(QuestionBank);
