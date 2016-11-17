import React from 'react'
import { findDOMNode } from 'react-dom'
// import cx from 'classnames'
import theme from '../../theme'
import csjs from 'CSJS'
const debug = require('debug')('cy:VideoCanvas')

import { TrackerTypes } from '../../constants'

const styles = csjs`
  .wraper {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .wraper video {
    position: absolute;
    top: 0; left: 0;
    background-color: black;
    visibility: hidden;
  }
  .srcCanvas, .dstCanvas {
    position: absolute;
    top: 0; left: 0;
    background-color: black;
  }
`

export default class VideoCanvas extends React.Component {

  static contextTypes = {
    cytron: React.PropTypes.object,
  };

  componentDidMount() {
    this.$srcCanvas = findDOMNode(this.refs.srcCanvas)
    this.$dstCanvas = findDOMNode(this.refs.dstCanvas)
    this.srcCtx = this.$srcCanvas.getContext('2d')
    this.dstCtx = this.$dstCanvas.getContext('2d')
    this.context.cytron.setDrawCtx(this.dstCtx, this.$dstCanvas)
  }

  drawCurrentFrame() {
    // debug('drawCurrentFrame call', this.props.currentFrame)
    const { cytron } = this.context
    const { $video } = cytron
    const { cWidth, cHeight, delayedTrackJob } = this.props
    let frame
    if (delayedTrackJob) {
      delayedTrackJob.cWidth = cWidth
      delayedTrackJob.cHeight = cHeight
      debug('delayedTrackJob:', this.props.delayedTrackJob)
      const { root, trackers } = cytron.store.getState()
      const { currentTracker } = root
      const trackerData = trackers.find(t => t.id === currentTracker)
      const points = trackerData.frames[delayedTrackJob.prevFrame]

      if (trackerData.type === TrackerTypes.PLANNAR) {
        if (!cytron.trackerMap[trackerData.id]) {
          let pattern = this.srcCtx.getImageData(0, 0, cWidth, cHeight)
          cytron.setPlannarPattern(trackerData.id, pattern, points)
        }

        // draw newFrame
        this.srcCtx.drawImage($video, 0, 0, cWidth, cHeight)
        let search = this.srcCtx.getImageData(0, 0, cWidth, cHeight)

        this.dstCtx.putImageData(this.srcCtx.getImageData(0, 0, cWidth, cHeight), 0, 0)
        cytron.plannarTrack(search, trackerData, delayedTrackJob)

      } else {
        let patterns = points.map(p => {
          return this.srcCtx.getImageData(
            p.x - Math.floor(p.rectW / 2), p.y - Math.floor(p.rectH / 2),
            p.rectW, p.rectH
          )
        })

        this.srcCtx.drawImage($video, 0, 0, cWidth, cHeight)
        let searchAreas = points.map(p => {
          return this.srcCtx.getImageData(
            p.x - Math.floor(p.searchW / 2), p.y - Math.floor(p.searchH / 2),
            p.searchW, p.searchH
          )
        })
        // debug only
        // let dc1 = patterns[0].data, dc2 = searchAreas[0].data
        // debug('patterns[0]', dc1[0], dc1[4], dc1[8], dc1[12], dc1[16], dc1[20], dc1[24])
        // debug('search[0]', dc2[0], dc2[4], dc2[8], dc2[12], dc2[16], dc2[20], dc2[24])
        cytron.trackPoints(points, patterns, searchAreas, this.props.delayedTrackJob)
        this.dstCtx.putImageData(this.srcCtx.getImageData(0, 0, cWidth, cHeight), 0, 0)
      } // isPlannar
    } else {
      this.srcCtx.drawImage($video, 0, 0, cWidth, cHeight)
      frame = this.srcCtx.getImageData(0, 0, cWidth, cHeight)
      this.dstCtx.putImageData(frame, 0, 0)
    }
  }

  componentWillReceiveProps(newProps) {
    // this happens everytime canplay id is chagned
    const { canplayId, currentFrame } = this.props
    if (newProps.canplayId !== canplayId) {
      debug('componentWillReceiveProps draw frame')
      this.drawCurrentFrame()
    } else if (newProps.isPlaying && currentFrame !== newProps.isPlaying) {
      // playing mode
      this.drawCurrentFrame()
    }
  }

  componentDidUpdate(prevProps) {
    // this is only for change video source
    if (prevProps.duration !== this.props.duration) {
      debug('DidUpdate, draw frame')
      this.drawCurrentFrame()
    }
  }

  // shouldComponentUpdate(nextProp) {
  //   debug('shouldComponentUpdate')
  //   // return false
  // }

  render() {
    // const { video } = this.props.root
    const { cWidth, cHeight, avaWidth, avaHeight } = this.props
    const canvasStyle = {
      top: (avaHeight - cHeight) / 2,
      left: (avaWidth - cWidth) / 2,
    }

    return (
      <div className={styles.wraper} >
        <canvas className={styles.srcCanvas}
          width={cWidth}
          height={cHeight}
          ref="srcCanvas" style={{ visibility: 'hidden' }}/>
        <canvas style={canvasStyle} className={styles.dstCanvas}
          width={cWidth}
          height={cHeight}
          ref="dstCanvas"/>
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
    duration: root.video.duration,
    canplayId: root.canplayId,
    delayedTrackJob: root.delayedTrackJob,
    isPlaying: root.isPlaying,
    isTracking: root.isTracking,
  }
}

export const ConnectedVideoCanvas = connect(
  mapStateToProps,
  rootActions
)(VideoCanvas)