import React from 'react';
import Highlighter from 'react-highlight-words';
import _ from 'lodash';
import { getQueryParams } from '../../history';

interface HighlightProps {
  textToHighlight: string;
  paramName?: string;
}

function Highlight(props: HighlightProps) {
  const { textToHighlight, paramName = 'query' } = props;
  const query = getQueryParams(paramName);
  const searchWords = _.split(query, ' ');

  return (
    <Highlighter
      highlightClassName="highlight"
      searchWords={searchWords}
      textToHighlight={textToHighlight}
      autoEscape
    />
  );
}

export default Highlight;
