import React from 'react'
// import { findDOMNode } from 'react-dom'
// import cx from 'classnames'
import theme from '../../theme'
import csjs from 'CSJS'
const debug = require('debug')('cy:TrackBoxes')

const styles = csjs`
  .wraper {
    position: absolute;
  }
  .searchBox, .innerBox {
    position: absolute;
  }
  .searchBox {
    border: solid 1px rgba(255, 255, 255, 0.2);
  }
  .searchBox:hover {
    border-color: rgba(255,255,255, 0.5);
  }
  .innerBox {
    border: solid 1px rgba(255, 255, 255, 0.8);
  }
  .innerBox:hover {
    border-color: rgba(255, 255, 255, 1);
  }
`

export default class TrackBoxes extends React.Component {

  // static contextTypes = {
  //   cytron: React.PropTypes.object,
  // };

  // @TODO: resizable tracker search & inner box
  $boxes() {
    const { trackerData, currentFrame } = this.props
    if (!trackerData) return null
    const frame = trackerData.frames[currentFrame]
    if (!frame || !Array.isArray(frame)) return null

    return frame.map((point, index) => {
      const { x, y, rectW, rectH, searchW, searchH } = point
      debug(x, y, rectW, rectH, searchW, searchH)
      const searchStyle = {
        width: searchW, height: searchH,
        top: y - searchH / 2, left: x - searchW / 2,
      }
      const innerStyle = {
        width: rectW, height: rectH,
        top: (searchH - rectH) / 2, left: (searchW - rectW) / 2,
      }

      return (
        <div className={styles.searchBox} key={index}
          style={searchStyle}>
          <div className={styles.innerBox} style={innerStyle}/>
        </div>
      )
    })
  }

  $lines() {
    const { trackerData, currentFrame } = this.props
    if (!trackerData) return null
    const frame = trackerData.frames[currentFrame]
    if (!frame || !Array.isArray(frame) || frame.length === 1) return null

    return frame.map((point, index) => {
      // for tow points
      if (frame.length !== 4 && index === 1) return null
      let nextPoint = frame[index + 1]
      if (!nextPoint) nextPoint = frame[0] // 4 points loop

      return (
        <line key={index} x1={point.x} y1={point.y} x2={nextPoint.x} y2={nextPoint.y} strokeWidth="1" stroke="#aaa"/>
      )
    })
  }

  render() {
    const { cWidth, cHeight, avaWidth, avaHeight } = this.props
    const wraperStyle = {
      top: (avaHeight - cHeight) / 2,
      left: (avaWidth - cWidth) / 2,
      width: cWidth, height: cHeight,
    }

    return (
      <div className={styles.wraper} style={wraperStyle}>
        <svg width={cWidth} height={cHeight} viewBox={`0 0 ${cWidth} ${cHeight}`} xmlns="http://www.w3.org/2000/svg">
          { this.$lines() }
        </svg>
       { this.$boxes() }
      </div>
    )
  }
}


import { connect } from 'react-redux'
import { rootActions } from '../../actionCreators'

function mapStateToProps(state) {
  const { layout, root } = state
  return {
    avaWidth: layout.mainSectionWidth,
    avaHeight: layout.windowHeight - theme.controlsBarHeight - theme.timelineHeight -
                25 * 2, // panel header and footer.
    cWidth: layout.canvasWidth,
    cHeight: layout.canvasHeight,
    currentFrame: root.currentFrame,
    // duration: root.video.duration,
    // canplayId: root.canplayId,
    trackerData: state.trackers.find(tt => tt.id === root.currentTracker),
  }
}

export const ConnectedTrackBoxes = connect(
  mapStateToProps,
  rootActions
)(TrackBoxes)