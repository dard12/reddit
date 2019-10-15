import React from 'react';
import { IoIosAddCircle } from 'react-icons/io';
import styles from './Response.module.scss';
import { ResponseDoc } from '../../../src-server/models';
import Video from '../Video/Video';
import { getQueryParams } from '../../history';
import Tag from '../Tag/Tag';

interface ResponseProps {
  responseDoc: ResponseDoc;
}

export default function Response(props: ResponseProps) {
  const { responseDoc } = props;
  const { id, question, tag, description, videoUrl } = responseDoc;
  const edit = getQueryParams('edit');

  if (!videoUrl && !edit) {
    return null;
  }

  return (
    <div className={styles.section} id={id}>
      <div className={styles.sectionHeader}>
        {question}
        <Tag tag={tag} />
      </div>

      <div className={styles.sectionDescription}>{description}</div>

      {videoUrl ? (
        <Video url={videoUrl} />
      ) : (
        <div className={styles.addResponse}>
          <IoIosAddCircle />
          Add a Response
        </div>
      )}
    </div>
  );
}
