import { useEffect, useState } from 'react';
import _ from 'lodash';
import { axios } from '../App';

export function useLoadDocs(params: {
  collection: string;
  result: any;
  loadDocsAction?: Function;
}) {
  const { collection, result, loadDocsAction } = params;
  const docs = result ? result.docs : undefined;

  useEffect(() => {
    if (!_.isEmpty(docs) && loadDocsAction) {
      loadDocsAction({ docs, name: collection });
    }
  }, [collection, docs, loadDocsAction]);
}

export function useAxiosGet(
  url: string,
  latestParams?: any,
  options?: {
    reloadOnChange?: boolean;
    reloadCallback?: Function;
    cachedResult?: any;
  },
) {
  const cachedResult = _.get(options, 'cachedResult');
  const reloadOnChange = _.get(options, 'reloadOnChange');
  const reloadCallback = _.get(options, 'reloadCallback');

  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [result, setResult] = useState<any>(undefined);
  const [params, setParams] = useState(latestParams);
  const [cache, setCache] = useState(cachedResult);

  if (reloadOnChange && !_.isEqual(params, latestParams)) {
    setCache(null);
    setParams(latestParams);
    reloadCallback && reloadCallback();
  }

  useEffect(() => {
    let isMounted = true;

    setIsSuccess(false);

    if (cache) {
      setResult({ docs: [cache] });
      setIsSuccess(true);
    } else {
      axios(url, { method: 'get', params })
        .then(({ data }) => {
          if (isMounted) {
            const result = {
              docs: data.docs,
              count: _.toInteger(_.get(data, '[0].count')),
              sum: _.toInteger(_.get(data, '[0].sum')),
              next: data.next === null ? null : _.toInteger(data.next),
              page: _.toInteger(data.page),
            };

            setResult(result);
            setIsSuccess(true);
          }
        })
        .catch(error => {
          if (isMounted) {
            setError(error);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [url, params, cache]);

  return { isSuccess, error, result, setParams };
}
