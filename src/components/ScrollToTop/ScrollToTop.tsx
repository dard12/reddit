import React from 'react';
import { withRouter } from 'react-router';

// https://reacttraining.com/react-router/web/guides/scroll-restoration
class ScrollToTop extends React.Component<any> {
  componentDidUpdate(prevProps: any) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return this.props.children;
  }
}

export default withRouter(ScrollToTop);
