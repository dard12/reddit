import React from 'react';
import styles from './Video.module.scss';

interface VideoProps {
  url?: string;
}

export default function Video(props: VideoProps) {
  return (
    <video controls className={styles.videoContainer} preload="auto">
      <source src={props.url} type="video/mp4" />
    </video>
  );
}
