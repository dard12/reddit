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

class RichText extends Component<RichTextProps> {
  state: RichTextState = { id: `id_${_.random(10000)}`, quill: undefined };

  componentDidMount() {
    const { readOnly, onChange, onEnter, placeholder } = this.props;
    const { id } = this.state;
    const allowedFormatting = ['bold', 'italic', 'link', 'blockquote'];
    const getContents = () => {
      const isEmpty = _.isEmpty(_.trim(quill.getText()));
      return isEmpty ? '' : quill.getContents();
    };
    const enterKey = 13;

    const quill = new Quill(`#${id}`, {
      theme: 'bubble',
      placeholder,
      readOnly,
      formats: allowedFormatting,
      modules: {
        toolbar: allowedFormatting,
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

    this.setState({ quill });
    this.updateContent(quill);
  }

  updateContent = (quill: any) => {
    const { content } = this.props;

    if (quill) {
      const delta = getDelta(content);
      quill.setContents(delta);
    }
  };

  render() {
    const { placeholder, onChange, className } = this.props;
    const { id, quill } = this.state;
    const quillElement = document.querySelector(`#${id} .ql-editor.ql-blank`);

    if (quillElement && placeholder) {
      quillElement.setAttribute('data-placeholder', placeholder);
    }

    if (!onChange) {
      this.updateContent(quill);
    }

    return <div id={id} className={classNames(styles.richText, className)} />;
  }
}

export default RichText;
