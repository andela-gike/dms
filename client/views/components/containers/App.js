// @flow strict
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';
import NavHeader from '../common/NavHeader';
import LandingPage from '../Home/LandingPage';
import layoutHelper from '../../../utils/layoutHelper';
import './App.scss';

type Props = {
  isPageLoading: boolean
};

class App extends React.Component<Props, State> {

  state = {
    newClass: false
  };

  onChangeStyle = () => {
    this.setState(prevState => ({ newClass: !prevState.newClass }));
  }
  render() {
    const { isPageLoading } = this.props;
    layoutHelper.tooglePageLoader(isPageLoading);
    const activeClass = [ 'appClass' ];
    if(this.state.newClass) {
      activeClass.push('active');
    }
    return (
      <div className={ activeClass.join(' ') } >
        <NavHeader
          isPageLoading={ isPageLoading }
          changeParent={ (newState) => this.onChangeStyle(newState) } />
        <Switch>
          <Route
            exact path="/"
            render={ props => (
              <LandingPage
                { ...props }
                activeChild={ this.state.newClass } /> ) }
          />
        </Switch>
      </div>

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
