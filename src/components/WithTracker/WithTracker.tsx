import React, { useEffect } from 'react';
import { FieldsObject } from 'react-ga';
import { RouteComponentProps } from 'react-router-dom';
// import * as Sentry from '@sentry/browser';

const { hostname } = window.location;
const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

if (!isLocalhost) {
  // ReactGA.initialize('UA-139902013-1');
}

export const withTracker = <P extends RouteComponentProps>(
  WrappedComponent: React.ComponentType<P>,
  options: FieldsObject = {},
) => {
  return (props: P) => {
    const { pathname: page } = props.location;

    useEffect(() => {
      if (!isLocalhost) {
        // const { userId, username } = options;
        // ReactGA.set({ page, ...options });
        // ReactGA.pageview(page);
        // if (userId) {
        //   Sentry.configureScope(scope => {
        //     scope.setUser({ id: userId, username });
        //   });
        // }
      }
    }, [page]);

    return <WrappedComponent {...props} />;
  };
};
