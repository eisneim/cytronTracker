import React from 'react'
// import cx from 'classnames'
// import theme from '../../theme'
import csjs from 'CSJS'
import { FlexRow } from '../_shared/Flex'
import Panel, { PanelContent } from '../_shared/Panel'
import { Button, CheckBox } from '../ui'
import { TrackerTypes } from '../../constants'

const debug = require('debug')('cy:TrackerSetting')

const styles = csjs`
.optionRow {
  width: 300px;
}
`

export default class TrackerSetting extends React.Component {

  constructor() {
    super()
    this.state = {
      isSR: false, isMotion: true, isPerspective: false, isPlannar: false,
    }
  }

  _setOption(type, value) {
    if (this.state[type] && !value) return
    const newState = {
      isMotion: false, isSR: false, isPerspective: false, isPlannar: false,
    }
    newState[type] = value
    this.setState(newState)
  }

  _addNewTracker = () => {
    const { isMotion, isSR, isPerspective } = this.state
    const type = isMotion ? TrackerTypes.MOTION :
      (isSR ? TrackerTypes.SCALE_ROTATION :
        (isPerspective ? TrackerTypes.PERSPECTIVE : TrackerTypes.PLANNAR))
    this.props.newTracker(type)
  }

  render() {
    const { isMotion, isSR, isPerspective, isPlannar } = this.state
    // debug('render: ', isMotion, isSR, isPerspective)
    /* eslint-disable eqeqeq */
    return (
      <Panel title="Video Source" height={120}>
        <PanelContent>
          <FlexRow className={styles.optionRow}>
            <CheckBox type="radio" isChecked={isMotion}
              onChange={ value => this._setOption('isMotion', value) }>Motion</CheckBox>
            <CheckBox type="radio" isChecked={isSR}
              onChange={ value => this._setOption('isSR', value) }>Rotation & Scale</CheckBox>
            <CheckBox type="radio" isChecked={isPerspective}
              onChange={ value => this._setOption('isPerspective', value) }>Perspective</CheckBox>
          </FlexRow>
          <FlexRow className={styles.optionRow}>
            <CheckBox type="radio" isChecked={isPlannar}
              onChange={ value => this._setOption('isPlannar', value) }>Plannar</CheckBox>
          </FlexRow>
          <div style={{ paddingLeft: 10 }}>
            <Button size="md" raised
              onClick={ this._addNewTracker }
              >Create New Tracker</Button>
          </div>
        </PanelContent>
      </Panel>
    )
  }
}

import { connect } from 'react-redux'
import { rootActions } from '../../actionCreators'

function mapStateToProps() {
  // const { root } = state
  return {
    // currentTracker: root.currentTracker,
  }
}

export const ConnectedTrackerSetting = connect(
  mapStateToProps,
  rootActions
)(TrackerSetting)