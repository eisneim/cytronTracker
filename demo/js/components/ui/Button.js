import React, { PropTypes } from 'react'
import cx from 'classnames'
import gStyles from '../../styles'
import theme from '../../theme'
import csjs from 'CSJS'

const styles = csjs`
.btn {
  outline: none;
  border:none;
  background: transparent;
  color: ${theme.colorMain};
  background-color: rgba(0, 0, 0, 0.1);
  position:relative;
  border-radius: 2px;
  text-align: center;
  transition: background-color 0.3s ease;
  margin-left: 4px;
  margin-right: 4px;
}
.btn:hover{
  background-color: rgba(0,0,0,0.2);
}
.btn.disabled {
  cursor: not-allowed;
  color: ${theme.colorDisabled};
}
.btn:not(.rounded) i{
  margin-right: 3px;
}
.rounded {
  border-radius: 50%;
  overflow:hidden;
}
.rounded i {
  font-size: 16px;
  margin-top: 2px;
}
.raised {
  background-color: rgba(200,200,200,0.1);
  box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
}
.raised:hover {
  opacity: 0.8;
}
.colored {
  color: ${theme.colorActive};
}
.accent {
  color: ${theme.colorAccent};
}
.raised.colored {
  background-color: ${theme.colorMain};
  color: #fff;
}
.raised.accent {
  background-color: ${theme.colorAccent};
}
.size_lg {
  padding: 5px 8px;
  font-size: 14px;
}
.size_lg i {
  font-size: 16px;
  top: 3px;
}
.size_md {
  padding: 5px 10px;
}
.size_md.rounded {
  width: 30px;
  height: 30px;
  padding: 0;
}
.size_md i {
  font-size: 20px;
}
.size_sm {
  padding: 2px 5px;
}
.size_sm.rounded {
  width:25px;
  height: 25px;
}
.size_xs {
  padding: 2px 5px;
}
.size_xs.rounded{
  width:20px;
  height: 20px;
}

`

export class Button extends React.Component {

  static propTypes = {
    colored: PropTypes.bool,
    raised: PropTypes.bool,
    accent: PropTypes.bool,
    rounded: PropTypes.bool,
    isBlock: PropTypes.bool,
    size: PropTypes.oneOf([ 'sm', 'xs', 'md', 'lg', 'xlg' ]),
  }

  static defaultProps = { size: 'sm' }

  _handleClick(e) {
    const { disabled, onClick } = this.props
    if (disabled) return
    if (typeof onClick === 'function')
      onClick(e)
  }

  getClassName() {
    const { colored, raised, accent, rounded, disabled, size } = this.props
    let name = cx(this.props.className, styles.btn, styles['size_' + size])
    if (colored) name += ' ' + styles.colored
    if (raised) name += ' ' + styles.raised
    if (accent) name += ' ' + styles.accent
    if (rounded) name += ' ' + styles.rounded
    if (disabled) name += ' ' + styles.disabled

    return name
  }

  render() {
    return (
      <button className={this.getClassName()}
        style={this.props.style}
        onClick={this._handleClick.bind(this)}>
        {this.props.children}
      </button>
    )
  }
}

export default Button

export class IconButton extends React.Component {
  static propTypes = {
    colored: React.PropTypes.bool,
    raised: React.PropTypes.bool,
    accent: React.PropTypes.bool,
    name: React.PropTypes.string.isRequired,
    size: React.PropTypes.oneOf([ 'sm', 'xs', 'md', 'lg', 'xlg' ]),
  };

  render() {
    if (React.Children.count(this.props.children) === 0) {
      return (
        <Button {...this.props} rounded={true}>
          <i style={this.props.iconStyle} className={gStyles.materialIcons}>{this.props.name}</i>
        </Button>
      )
    }

    return (
      <Button {...this.props}>
        <i className={gStyles.materialIcons}>{this.props.name}</i>
        { this.props.children }
      </Button>
    )
  }
}