// @flow
import React, { PureComponent } from 'react';
import { string, bool, func, objectOf, shape, oneOf } from 'prop-types';
import type { Node } from 'react';
// import '../../../styles/components/common/button.scss';

type ButtonType = "button" | "submit";
type Props = {
  text: string,
  icon: string,
  onClick: Function,
  iconStyle: Object,
  textStyle: Object,
  style: Object,
  className: string,
  isLoading: boolean,
  loadingText: string,
  type: ButtonType,
  round: boolean,
  iconName: string,
  disabled: boolean
};

class Button extends PureComponent<Props> {
  static defaultProps = {
    text: '',
    icon: '',
    iconStyle: {},
    textStyle: {},
    style: {},
    className: '',
    onClick: () => {},
    isLoading: false,
    loadingText: '',
    type: 'button',
    round: false,
    iconName: '',
    disabled: false
  };

  renderIcon = (): Node => {
    const { icon, iconStyle, iconName } = this.props;
    if (this.props.icon) {
      return (
        <i className={ ` ${ icon } button-component__icon ` } style={ iconStyle }>
          {iconName}
        </i>
      );
    }
  };

  render() {
    const { text, loadingText, textStyle, style, className, onClick, isLoading,
      type, round, disabled } = this.props;

    const isDisabled = isLoading || disabled ? 'disabled' : '';
    const roundBtn = round ? 'button-component--round' : '';
    return (
      <button
        className={ `button-component ${ className } ${ roundBtn }` }
        style={ style }
        onClick={ onClick }
        disabled={ isDisabled }
        type={ type }
      >
        {this.renderIcon()}

        {(text || loadingText) && !round && (
          <span style={ textStyle }>{loadingText ? loadingText : text}</span>
        )}
      </button>
    );
  }
}

Button.propTypes = {
  text: string,
  isLoading: bool,
  icon: string,
  onClick: func,
  iconStyle: objectOf(shape),
  textStyle: objectOf(shape),
  style: objectOf(shape),
  className: string,
  loadingText: string,
  type: oneOf([ 'button', 'submit' ]),
  round: bool,
  iconName: string,
  disabled: bool
};

export default Button;
