import React, { Component } from 'react';
import Quill from 'quill';
import _ from 'lodash';
import styles from './RichText.module.scss';

const Delta = Quill.import('delta');

interface RichTextProps {
  readOnly?: boolean;
  onChange?: Function;
  content?: any;
  placeholder?: string;
}

interface RichTextState {
  id: string;
  quill?: any;
}

export function getDelta(rawContent = '') {
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
  state: RichTextState = { id: `id_${_.random(10000)}`, quill: undefined };

  componentDidMount() {
    const { readOnly, onChange, placeholder } = this.props;
    const { id } = this.state;
    const allowedFormatting = ['bold', 'italic', 'link', 'blockquote'];
    const quill = new Quill(`#${id}`, {
      theme: 'bubble',
      placeholder,
      readOnly,
      formats: allowedFormatting,
      modules: { toolbar: allowedFormatting },
    });

    this.setState({ quill });
    this.updateContent(quill);

    if (onChange) {
      quill.on('text-change', () => {
        const isEmpty = _.isEmpty(_.trim(quill.getText()));
        const contents = isEmpty ? '' : quill.getContents();

        onChange(contents);
      });
    }
  }

  updateContent = (quill: any) => {
    const { content } = this.props;

    if (quill) {
      const delta = getDelta(content);
      quill.setContents(delta);
    }
  };

  render() {
    const { placeholder, onChange } = this.props;
    const { id, quill } = this.state;
    const quillElement = document.querySelector('.ql-editor.ql-blank');

    if (quillElement && placeholder) {
      quillElement.setAttribute('data-placeholder', placeholder);
    }

    if (!onChange) {
      this.updateContent(quill);
    }

    return <div id={id} className={styles.richText} />;
  }
}

export default RichText;
