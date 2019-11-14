import React, { Component } from 'react';
import Quill from 'quill';
import _ from 'lodash';
import classNames from 'classnames';
import styles from './RichText.module.scss';

const Delta = Quill.import('delta');

interface RichTextProps {
  readOnly?: boolean;
  onChange?: Function;
  onEnter?: Function;
  content?: any;
  placeholder?: string;
  className?: string;
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

export function getShouldTruncate(content: any) {
  const delta = getDelta(content);
  const deltaString = JSON.stringify(delta);
  const numberNewline = _.size(_.split(deltaString, /\\n/g));

  return delta.length() > 1300 || numberNewline > 20;
}

class RichText extends Component<RichTextProps> {
  state: RichTextState = { id: `id_${_.random(10000000)}`, quill: undefined };

  componentDidMount() {
    const { readOnly, onChange, onEnter, placeholder } = this.props;
    const { id } = this.state;
    const getContents = () => {
      const isEmpty = _.isEmpty(_.trim(quill.getText()));
      return isEmpty ? '' : quill.getContents();
    };
    const enterKey = 13;

    const quill = new Quill(`#${id}`, {
      theme: 'bubble',
      placeholder,
      readOnly,
      formats: ['bold', 'italic', 'link', 'blockquote', 'list'],
      modules: {
        toolbar: [
          'bold',
          'italic',
          { list: 'ordered' },
          { list: 'bullet' },
          'blockquote',
          'link',
        ],
        keyboard: {
          bindings: {
            custom: {
              key: enterKey,
              handler: () => {
                onEnter && onEnter(getContents());
                return true;
              },
            },
          },
        },
      },
    });

    if (onChange) {
      quill.on('text-change', () => onChange(getContents()));
    }

    this.setState({ quill }, this.updateContent);
  }

  updateContent = () => {
    const { quill } = this.state;
    const { content } = this.props;
    const delta = getDelta(content);
    quill.setContents(delta);
  };

  render() {
    const { placeholder, className, readOnly } = this.props;
    const { id } = this.state;
    const quillElement = document.querySelector(`#${id} .ql-editor.ql-blank`);

    if (quillElement && placeholder) {
      quillElement.setAttribute('data-placeholder', placeholder);
    }

    if (readOnly) {
      this.updateContent();
    }

    return <div id={id} className={classNames(styles.richText, className)} />;
  }
}

export default RichText;
