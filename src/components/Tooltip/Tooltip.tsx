import React from 'react';
import Tippy, { TippyProps } from '@tippy.js/react';

export default function Tooltip(props: TippyProps) {
  const { children } = props;

  return (
    <Tippy arrow distance={20} maxWidth={200} {...props}>
      <span>{children}</span>
    </Tippy>
  );
}
