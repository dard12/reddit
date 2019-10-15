import React from 'react';
import _ from 'lodash';
import styles from './VideoNav.module.scss';
import { getUserResponses } from '../../hardcoded';
import { getQueryParams } from '../../history';

interface VideoNavProps {
  user: string;
}

export default function VideoNav(props: VideoNavProps) {
  const { user } = props;
  const responseList = getUserResponses(user);
  const edit = getQueryParams('edit');
  const visibleResponses = edit
    ? responseList
    : _.filter(responseList, 'videoUrl');
  const tags = _.uniq(_.map(visibleResponses, 'tag'));

  return (
    <div className={styles.videoNav}>
      {_.isEmpty(tags)
        ? null
        : _.map(tags, tag => {
            const responseDocs = _.filter(visibleResponses, { tag });
            const numberResponses = _.size(responseDocs);

            return (
              <div className={styles.videoNavSection} key={tag}>
                <div className={styles.videoNavHeader}>
                  {tag} ({numberResponses})
                </div>

                {_.map(responseDocs, ({ id, question }) => (
                  <a href={`#${id}`} key={id}>
                    {question}
                  </a>
                ))}
              </div>
            );
          })}
    </div>
  );
}
