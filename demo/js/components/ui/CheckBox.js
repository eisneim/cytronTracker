import React from 'react'
import csjs from 'CSJS'
import cx from 'classnames'
import theme from '../../theme'
import gStyles from '../../styles'
const styles = csjs`
.checkbox {
  position: relative;
  display: inline-block;
  line-height: 25px;
  padding: 0px 4px;
  cursor: pointer;
}
.checkbox:hover .icon {
  color: ${theme.colorActive};
}
.icon, .label {
  display: inline-block;
  vertical-align: middle;
  line-height: normal;
  pointer-events: none;
}
.label {
  margin-left: 4px;
}
.checkboxActive .icon{
  color: ${theme.colorActive};
}
.checkboxDisabled {
  cursor: not-allowed;
  color: ${theme.colorDisabled}
}
.checkboxDisabled .icon{
  color: ${theme.colorDisabled}
}
`

const icons = {
  checkbox: {
    checked: 'check_box',
    unchecked: 'check_box_outline_blank',
  },
  radio: {
    checked: 'radio_button_checked',
    unchecked: 'radio_button_unchecked',
  },
}

export default class Checkbox extends React.Component {

  static propTypes = {
    type: React.PropTypes.oneOf([ 'checkbox', 'radio' ]),
    isChecked: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    selfStateControl: React.PropTypes.bool,
  };

  static defaultProps = {
    isChecked: false,
    type: 'checkbox',
  };

  constructor(props) {
    super(props)
    this.state = { selfIsChecked: props.isChecked }
  }

  render() {
    const { disabled, isChecked, children, selfStateControl } = this.props
    const { selfIsChecked } = this.state
    const checked = selfStateControl ? selfIsChecked : isChecked
    // console.log('isChecked:', isChecked)
    const icon = icons[this.props.type]
    const iconName = checked ? icon.checked : icon.unchecked
    const className = cx(styles.checkbox, {
      [styles.checkboxActive]: checked,
      [styles.checkboxDisabled]: disabled,
    })

    return (
      <label className={className}
        onClick={this._handleClick}>
        <i className={cx(styles.icon, gStyles.materialIcons)}>
          { iconName }
        </i>
        { children &&
          <span className={styles.label}>{ children }</span>
        }
      </label>
    )
  }

  _handleClick= e => {
    // do nothing if it's disabled
    if (this.props.disabled) return

    const isChecked = !this.props.isChecked

    if (typeof this.props.onChange === 'function')
      this.props.onChange(isChecked)

    if (typeof this.props.onClick === 'function')
      this.props.onClick(e)

    if (this.props.selfStateControl) {
      this.setState({ selfIsChecked: !this.state.selfIsChecked })
    }
  }
}

// import PureRenderMixin from 'react-addons-pure-render-mixin'
// import reactMixin from 'react-mixin'

// reactMixin.onClass(Checkbox, PureRenderMixin)

