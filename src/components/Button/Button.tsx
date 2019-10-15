import React from 'react';
import classNames from 'classnames';
import styles from './Button.module.scss';

interface ButtonProps {
  submitting?: boolean;
}

export function Button(props: ButtonProps & any) {
  const {
    submitting,
    children,
    disabled,
    className,
    color,
    ...passedProps
  } = props;

  return (
    <button
      type="button"
      disabled={disabled || submitting}
      className={classNames(styles.button, className, styles[color])}
      {...passedProps}
    >
      {submitting ? 'Submitting…' : children}
    </button>
  );
}
