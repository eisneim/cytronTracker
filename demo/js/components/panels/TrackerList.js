import React from 'react'
import cx from 'classnames'
// import gStyles from '../styles'
import theme from '../../theme'
import csjs from 'CSJS'
import { getTrackerType } from '../../constants'

import { IconButton } from '../ui/Button'

const styles = csjs`
.trackerList {
  list-style: none;
  margin: 0;
  padding: 0;
}
.item {
  padding: 5px 10px;
  border-bottom: solid 1px ${theme.bgMainBorder};
}
.item:nth-child(2n) {
  background-color: ${theme.bgLighter};
}
.itemActive {
  color: ${theme.colorActive};
}
.itemName {
  cursor: pointer;
}
.itemName:hover {
  opacity: 0.8;
  transition: opacity 0.3s ease;
}
.typeName {
  color: ${theme.colorDarker};
}
.actions {
  height: 25px;
  float: right;
  position: relative;
  top: -5px;
}
`


export class TrackerList extends React.Component {
  render() {
    const {
      trackers, currentTracker, selectTracker, deleteTracker,
    } = this.props
    if (!trackers || trackers.length === 0)
      return <div style={{ padding: 10 }}>currently no tracker created</div>

    return (
      <ul className={styles.trackerList}>
      {
        trackers.map(tt => (
          <li key={tt.id}
            className={cx(styles.item, {
              [styles.itemActive]: tt.id === currentTracker,
            })}
          >
            <span className={styles.itemName}
              onClick={() => selectTracker(tt.id)}>
              {tt.name}&nbsp;
              <span className={styles.typeName}>({getTrackerType(tt.type)})</span>
            </span>
            <span className={styles.actions}>
              <IconButton onClick={() => deleteTracker(tt.id)} name="delete"/>
            </span>
          </li>
        ))
      }
      </ul>
    )
  }
}

import { connect } from 'react-redux'
import { rootActions } from '../../actionCreators'

function mapStateToProps(state) {
  const { root } = state
  return {
    currentFrame: root.currentFrame,
    currentTracker: root.currentTracker,
    trackers: state.trackers,
  }
}

export const ConnectedTrackerList = connect(
  mapStateToProps,
  rootActions
)(TrackerList)