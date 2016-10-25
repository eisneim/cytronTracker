import React from 'react'
// import cx from 'classnames'
import theme from '../theme'
import csjs from 'CSJS'

import { FlexRow, FlexSpan } from './_shared/Flex'
import { IconButton } from './ui/Button'
import { Icon } from './ui'
import Panel, { PanelContent, PanelActions, PanelFooter } from './_shared/Panel'
import { ConnectedTimeline } from './main/Timeline'
import { ConnectedVideoCanvas } from './main/VideoCanvas'
import { ConnectedTrackBoxes } from './main/TrackBoxes'

const styles = csjs`
  .controlsWraper {
    position: absolute;
    bottom: ${theme.timelineHeight}px;
    left: 0;
    width: 100%;
    height: ${theme.controlsBarHeight}px;
    padding: 0 10px;
  }
  .trackBackBtn {
    transform: rotate(180deg);
    position: relative;
  }
  .timecode {
    line-height: 3.2;
  }
  .timecode em {
    font-style: normal;
    color: ${theme.colorActive};
  }
  .timecode button {
    top: 4px
  }
`

export default class Stage extends React.Component {

  _nextFrame = () => {
    this.props.setFrame(this.props.currentFrame + 1)
  }

  _prevFrame = () => {
    this.props.setFrame(this.props.currentFrame - 1)
  }

  render() {
    const { layout, currentFrame, duration, trackNextFrame, trackPrevFrame } = this.props

    return (
      <div style={{ flex: 1, height: '100%' }}>
        <Panel title={ 'CytronTracker@' + process.env.VERSION }
          height={layout.windowHeight}
          width={layout.mainSectionWidth + 2}
          >
          <PanelContent style={{ overflow: 'hidden' }}>
            <ConnectedVideoCanvas/>
            <ConnectedTrackBoxes />
            <FlexRow className={styles.controlsWraper}
              style={{ visibility: duration ? 'visible' : 'hidden' }}>
              <span className={styles.timecode}>
                <IconButton onClick={this._prevFrame}
                  name="keyboard_arrow_left"/>
                Frame: <em>{currentFrame}</em>
                <IconButton onClick={this._nextFrame}
                  name="keyboard_arrow_right"/>
              </span>
              <FlexSpan/>
              <IconButton size="lg" name="fast_rewind"/>
              <IconButton size="lg" onClick={trackPrevFrame} name="skip_previous"/>
              <IconButton size="lg" onClick={trackNextFrame} name="skip_next"/>
              <IconButton size="lg" name="fast_forward"/>
              <FlexSpan/>
            </FlexRow>
            <ConnectedTimeline />
          </PanelContent>
          <PanelActions>
            <Icon name="build"/>
          </PanelActions>
          <PanelFooter>
            <span>footer one</span>
          </PanelFooter>
        </Panel>
      </div>
    )
  }
}

import { connect } from 'react-redux'
import { rootActions } from '../actionCreators'

function mapStateToProps(state) {
  const { root } = state
  return {
    layout: state.layout,
    currentFrame: root.currentFrame,
    currentTime: root.currentTime,
    duration: root.video.duration,
  }
}

export const ConnectedStage = connect(
  mapStateToProps,
  rootActions
)(Stage)