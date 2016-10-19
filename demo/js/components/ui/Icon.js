import React from 'react'
import cx from 'classnames'
import styles from '../../styles'

export class Icon extends React.Component {

  render() {
    const { size, name, className } = this.props
    const iconStyle = {
      fontSize: (size || 12) + 'px',
    }

    return (
      <i
        {...this.props}
        className={cx(styles.materialIcons, className)}
        style={iconStyle}>
        {name}
      </i>
    )
  }
}

export default Icon