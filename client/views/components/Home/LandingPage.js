// @flow
import React, { PureComponent } from 'react';
import type { Element } from 'react';
import { string, objectOf, shape, bool } from 'prop-types';
import docBot from '../../../styles/assets/Images/docBot.png';
import './LandingPage.scss';

type Props = {
  className: string,
  style: Object,
  activeChild: boolean
};

class LandingPage extends PureComponent< Props > {
  static defaultProps = {
    className: '',
    style: {},
    activeChild: false
  };
  render(): Element<"div"> {
    const { className, style, activeChild } = this.props;
    const animateDiv = activeChild === true ? '-animate' : '';
    return (
      <div className={ `landing-div${ animateDiv }` }>
        <div className={ `landing-picture ${ className }` } style={ style }>
          <img alt=" " src={ docBot } />
        </div>
        <div className={ `landing-text ${ className }` } style={ style }>
          <h1>Hello Welcome to my HomePage</h1>
        </div>
      </div>
    );
  }
}

LandingPage.propTypes = {
  className: string,
  style: objectOf(shape),
  activeChild: bool
};

export default LandingPage;
