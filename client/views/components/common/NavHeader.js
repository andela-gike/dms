// @flow strict

import * as React from 'react';
import PropTypes from 'prop-types';
import './NavHeader.scss';

type Props = {
  isLoggedIn: boolean
};

class NavHeader extends React.Component<Props, State> {
  logOut: Function;
    state = {
      addClass: false
    };

    // componentWillMount() {

    // }

    // componentDidMount() {

    // }

    // componentWillReceiveProps(nextProps: Props) {

    // }

    // shouldComponentUpdate(nextProps: Props, nextState: TM_STATE_TYPE) {

    // }

    // componentWillUpdate(nextProps: Props, nextState: TM_STATE_TYPE) {

    // }

    // componentDidUpdate(prevProps: Props, prevState: TM_STATE_TYPE) {

    // }

    // componentWillUnmount() {

    // }

  // logOut = event => {
  //   event.preventDefault();
  //   const { isLoggedIn, isPageLoading } = this.props;
  //   // if (!isPageLoading)
  //   // routesHelper.logOut(actions, currentUrl, urls.LOGOUT_URL);
  // };

  toggle = () => {
    const newState = !this.state.addClass;
    this.setState({ addClass: newState });
    this.props.changeParent(newState);
  }

  render() {
    const navClass = [ 'navHeader' ];
    if(this.state.addClass) {
      navClass.push('active');
    }
    return (
      <div className={ navClass.join(' ') } >
        <button
          type="button" className="navButton"
          onClick={ this.toggle }>
          <i className="fas fa-align-justify" />
        </button>
      </div>
    );
  }
}

export default NavHeader;
