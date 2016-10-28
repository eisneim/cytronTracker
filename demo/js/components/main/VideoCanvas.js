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
  }

  drawCurrentFrame() {
    const { $video } = this.context.cytron
    const { cWidth, cHeight, delayedTrackJob } = this.props
    let frame
    if (delayedTrackJob) {
      delayedTrackJob.cWidth = cWidth
      delayedTrackJob.cHeight = cHeight
      debug('delayedTrackJob:', this.props.delayedTrackJob)
      const { root, trackers } = this.context.cytron.store.getState()
      const { currentTracker } = root
      const trackerData = trackers.find(t => t.id === currentTracker)
      const points = trackerData.frames[delayedTrackJob.prevFrame]

      if (trackerData.type === TrackerTypes.PLANNAR) {
        // get pattern find largest x,y and smallest x,y to define a rectangel
        var maxX = points[0].x,
          minX = maxX,
          maxY = points[0].y,
          minY = maxY

        points.forEach(({ x, y }) => {
          if (x > maxX) maxX = x
          if (x < minX) minX = x
          if (y > maxY) maxY = y
          if (y < minY) minY = y
        })
        debug(`maxX ${maxX}, maxY ${maxY}, minX ${minX}, minY ${minY}`)
        let pattern = this.srcCtx.getImageData(minX, minY, maxX - minX, maxY - minY)
        // draw newFrame
        this.srcCtx.drawImage($video, 0, 0, cWidth, cHeight)
        // get search area
        // @TODO: refactor extend area for plannar track
        let margin = 50,
          newMinX = minX - margin,
          newMaxX = maxX + margin,
          newMinY = minY - margin,
          newMaxY = maxY + margin

        if (newMinX < 0) newMinX = 0
        if (newMaxX > cWidth) newMaxX = cWidth
        if (newMinY < 0) newMinY = 0
        if (newMaxY > cHeight) newMaxY = cHeight

        let search = this.srcCtx.getImageData(newMinX, newMinY, newMaxX - newMinX, newMaxY - newMinY)
        this.context.cytron.plannarTrack(pattern, search, trackerData, delayedTrackJob)

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
        this.context.cytron.trackPoints(points, patterns, searchAreas, this.props.delayedTrackJob)
      } // isPlannar
    } else {
      this.srcCtx.drawImage($video, 0, 0, cWidth, cHeight)
    }
    frame = this.srcCtx.getImageData(0, 0, cWidth, cHeight)
    this.dstCtx.putImageData(frame, 0, 0)

  }

  componentWillReceiveProps(newProps) {
    // this happens everytime canplay id is chagned
    const { canplayId } = this.props
    if (newProps.canplayId !== canplayId) {
      debug('componentWillReceiveProps draw frame')
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
  }
}

export const ConnectedVideoCanvas = connect(
  mapStateToProps,
  rootActions
)(VideoCanvas)