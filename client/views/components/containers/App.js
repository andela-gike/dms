// @flow strict
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';
import NavHeader from '../common/NavHeader';
import LandingPage from '../Home/LandingPage';
import layoutHelper from '../../../utils/layoutHelper';

type Props = {
  isPageLoading: boolean
};

class App extends React.Component<Props> {
  render() {
    const { isPageLoading } = this.props;
    layoutHelper.tooglePageLoader(isPageLoading);
    return (
      <Switch>
        {/* <Route path="/" component={ NavHeader } /> */}
        <Route exact path="/" component={ LandingPage } />
      </Switch>
    );
  }
}

App.propTypes = {
  isPageLoading: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    isPageLoading: state.loader.pageLoading
  };
}

export default withRouter(connect(mapStateToProps)(App));
