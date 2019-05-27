// @flow
import React, { PureComponent } from 'react';
import type { Element } from 'react';
import { string, objectOf, shape, bool } from 'prop-types';
import docBot from '../../../styles/assets/Images/docBot.png';
import './LandingPage.scss';
import Button from './../common/Button';

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
    const { className, style } = this.props;
    // const animateDiv = activeChild === true ? '-animate' : '';
    return (
      <div className="landing-div">
        {/* <div className={ `landing-div${ animateDiv }` }>nm</div> */}
        <div className={ `landing-picture ${ className }` } style={ style }>
          <img alt=" " src={ docBot } />
        </div>
        <div className={ `landing-text ${ className }` } style={ style }>
          <h1 className="intro-notes">Make Productivity as it should be</h1>
          <div>
            <h3>Documenting our items has been key to efficient productivity,
            welcome to the era where the process has been made seamless.
            </h3>
          </div>
          <Button />
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
