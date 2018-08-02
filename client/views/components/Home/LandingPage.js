// @flow
import React, { PureComponent } from 'react';
import type { Element } from 'react';
import { string, objectOf, shape } from 'prop-types';
import docBot from '../../../styles/assets/Images/docBot.png';
import './Landing.scss';

type Props = {
  className: string,
  style: Object,
};

class LandingPage extends PureComponent< Props > {
  static defaultProps = {
    className: '',
    style: {},
  };
  render(): Element<"div"> {
    const { className, style } = this.props;
    return (
      <div className="landing-div">
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
};

export default LandingPage;
