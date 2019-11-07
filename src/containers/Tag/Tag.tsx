import React from 'react';
import qs from 'qs';
import { connect } from 'react-redux';
import styles from './Tag.module.scss';
import history, { getQueryParams } from '../../history';
import { createDocSelector } from '../../redux/selectors';
import { TagDoc } from '../../../src-server/models';

interface TagProps {
  tag: string;
  tagDoc?: TagDoc;
}

function Tag(props: TagProps) {
  const { tag, tagDoc } = props;
  const onClick = () => {
    const queryParams = getQueryParams();
    queryParams.tag = tag;
    const search = qs.stringify(queryParams);
    history.push({ pathname: '/question', search });
  };

  if (!tagDoc) {
    return null;
  }

  return (
    <div className={styles.tag} onClick={onClick}>
      {tagDoc.display_name}
    </div>
  );
}

export default connect(
  createDocSelector({
    collection: 'tags',
    id: 'tag',
    prop: 'tagDoc',
  }),
)(Tag);
