import React, { Component } from 'react';
import Quill from 'quill';
import _ from 'lodash';
import styles from './RichText.module.scss';

const Delta = Quill.import('delta');

interface RichTextProps {
  id: string;
  readOnly?: boolean;
  onChange?: Function;
  initialContent?: any;
  placeholder?: string;
}

export function getDelta(rawContent: any) {
  let delta;

  try {
    const deltaOps = JSON.parse(rawContent);
    delta = new Delta(deltaOps);
  } catch (error) {
    delta = new Delta().insert(rawContent);
  }

  return delta;
}

class RichText extends Component<RichTextProps> {
  componentDidMount() {
    const { id, readOnly, onChange, initialContent, placeholder } = this.props;
    const quill = new Quill(`#${id}`, {
      theme: 'bubble',
      placeholder,
      readOnly,
      modules: {
        toolbar: ['bold', 'italic', 'blockquote', 'link'],
      },
    });

    const delta = getDelta(initialContent);

    quill.setContents(delta);

    quill.on('text-change', () => {
      const isEmpty = _.isEmpty(_.trim(quill.getText()));
      const contents = isEmpty ? '' : quill.getContents();

      onChange && onChange(contents);
    });
  }

  render() {
    const { id } = this.props;
    return <div id={id} className={styles.richText} />;
  }
}

export default RichText;
