// @flow strict

import * as React from 'react';
import PropTypes from 'prop-types';

type Props = {
  isLoggedIn: boolean
};

class NavHeader extends React.Component<Props> {
  logOut: Function;
  constructor(props: Props) {
    super(props);

  }

  componentWillMount() {

  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps: Props) {

  }

  shouldComponentUpdate(nextProps: Props, nextState: TM_STATE_TYPE) {

  }

  componentWillUpdate(nextProps: Props, nextState: TM_STATE_TYPE) {

  }

  componentDidUpdate(prevProps: Props, prevState: TM_STATE_TYPE) {

  }

  componentWillUnmount() {

  }

  logOut = event => {
    event.preventDefault();
    const { isLoggedIn, isPageLoading } = this.props;
    // if (!isPageLoading)
    // routesHelper.logOut(actions, currentUrl, urls.LOGOUT_URL);
  };

  render() {
    return (
      <div className="NavHeader">

      </div>
    );
  }
}

export default NavHeader;
