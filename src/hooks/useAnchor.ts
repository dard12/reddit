import { useEffect } from 'react';
import _ from 'lodash';
import { getQueryParams, setQueryParams } from '../history';

export default function useAnchor(anchor: string) {
  const isTarget = getQueryParams('anchor') === anchor;
  const anchorTag = `id_${anchor}`;
  const targetOffset = isTarget
    ? _.get(document.querySelector(`[data-anchor="${anchorTag}"]`), 'offsetTop')
    : false;

  useEffect(() => {
    if (targetOffset) {
      window.scrollTo(0, targetOffset - 10);
      setQueryParams({ anchor: undefined }, { replace: true });
    }
  }, [targetOffset]);

  return anchorTag;
}
