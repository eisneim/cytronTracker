import React, { PropTypes } from 'react'
import theme from '../../theme'
import gStyles from '../../styles'
import cx from 'classnames'
import csjs from 'CSJS'

const styles = csjs`
.flexRow {
  display: flex;
  flex-direction: row;
}
.flexRow .input {
  position: relative;
  top: -2px;
}
.wraper {
  margin-top: 0.2em;
  position: relative;
  width: 100%;
}
.input {
  background-color: ${theme.bgInput};
  border: solid 1px ${theme.bgInput};
  color: ${theme.colorMain};
  outline: none;
  width: 100%;
  padding: 2px 3px;
  flex: 1;
}
.input:focus, .input.active {
  outline: none;
  border-color: ${theme.colorActive};
}
.input::placeholder {
  color: #888;
}
textarea {
  min-height: 100px;
}
.label{
  margin-right: 5px;
}
.label::after {
  content: ": ";
}
.tailIcon {
  position: absolute;
  right: 0px;
  bottom: 0px;
  cursor: pointer;
  height: 20px;
  width: 20px;
  background-color: rgba(0,0,0, 0.1);
  text-align: center;
}
.tailIcon:hover {
  color: ${theme.colorActive};
}
`

export default class Input extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    isLabelAtTop: PropTypes.bool,
    type: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    defaultValue: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    onIconClick: PropTypes.func,
    filter: PropTypes.func,
    multiple: PropTypes.bool,
    pattern: PropTypes.string,
    step: PropTypes.number,
    title: PropTypes.string,
    // typeSound: PropTypes.bool,
  };

  static defaultProps = {
    type: 'text',
  };

  constructor(props) {
    super(props)
    this.value = props.value
    this.state = {
      value: props.value,
    }
  }

  componentWillReceiveProps(props) {
    if (props.value !== this.state.value) {
      this.value = props.value
      this.setState({ value: props.value })
    }
  }

  _handleChange(e) {
    const { value } = e.target
    const { onChange, filter } = this.props

    this.setState({ value })

    const hasFilter = typeof filter === 'function'
    const isValid = !hasFilter || filter(value)

    if (isValid && typeof onChange === 'function') {
      this.value = value
      onChange(value)
    }
  }

  _onIconClick = e => {
    if (typeof this.props.onIconClick === 'function')
      this.props.onIconClick(e)
  }

  render() {
    const {
      label,
      isLabelAtTop,
      defaultValue,
      placeholder,
      multiple,
      type,
      pattern,
      step,
      title,
      style,
      icon,
    } = this.props
    const { value } = this.state

    const inputClass = cx(styles.input, this.props.className)
    const inputProps = {
      pattern,
      step,
      type,
      title,
      style,
      className: inputClass,
      placeholder,
      value,
      defaultValue,
      onChange: this._handleChange.bind(this),
    }
    const $input = multiple ? <textarea {...inputProps} />
                            : <input {...inputProps} />

    const wraperProps = {
      className: cx(styles.wraper, { [styles.flexRow]: !isLabelAtTop }),
      style: this.props.wraperStyle,
    }

    if (label) {
      return (
        <div {...wraperProps}>
          <div className={styles.label}>{label}</div>
          {$input}
          {!icon ? null : <div onClick={this._onIconClick} className={styles.tailIcon}>
            <i className={gStyles.materialIcons}>{icon}</i>
            </div>
          }
        </div>
      )
    }

    return $input
  }
}
