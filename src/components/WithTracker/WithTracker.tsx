import React, { useEffect } from 'react';
import ReactGA, { FieldsObject } from 'react-ga';
import { RouteComponentProps } from 'react-router-dom';
import * as Sentry from '@sentry/browser';
import LogRocket from 'logrocket';

const { hostname } = window.location;
const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

if (!isLocalhost) {
  ReactGA.initialize('UA-152176869-1');
  LogRocket.init('xxoqjl/coverstory');
}

export const withTracker = <P extends RouteComponentProps>(
  WrappedComponent: React.ComponentType<P>,
  options: FieldsObject = {},
) => {
  return (props: P) => {
    const { pathname: page } = props.location;

    useEffect(() => {
      if (!isLocalhost) {
        const { userId, username } = options;
        ReactGA.set({ page, ...options });
        ReactGA.pageview(page);

        if (userId) {
          Sentry.configureScope(scope => {
            scope.setUser({ id: userId, username });
            scope.setExtra('sessionURL', LogRocket.sessionURL);
          });

          LogRocket.identify(userId, { name: username });
        }
      }
    }, [page]);

    return <WrappedComponent {...props} />;
  };
};
