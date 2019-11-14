import { createBrowserHistory } from 'history';
import _ from 'lodash';
import qs from 'qs';

const history = createBrowserHistory();

export function getQueryParams(paramName?: string) {
  const params = qs.parse(history.location.search, { ignoreQueryPrefix: true });
  return paramName ? params[paramName] : params;
}

export function setQueryParams(
  params: { [paramName: string]: any },
  options?: { replace?: boolean },
) {
  const queryParams = getQueryParams();

  _.each(params, (paramValue, paramName) => {
    queryParams[paramName] = paramValue;
  });

  const search = qs.stringify(queryParams);
  const replace = _.get(options, 'replace');

  if (replace) {
    history.replace({ search });
  } else {
    history.push({ search });
  }
}

export function routeIncludes(subPath: string) {
  const path = history.location.pathname;
  return _.includes(path, subPath);
}

export default history;
