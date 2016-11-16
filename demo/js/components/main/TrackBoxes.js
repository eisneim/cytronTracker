import React from 'react'
import { findDOMNode } from 'react-dom'
// import cx from 'classnames'
import theme from '../../theme'
import csjs from 'CSJS'
import Dragable from '../_shared/Dragable'
const debug = require('debug')('cy:TrackBoxes')

import { findHomographyFromArray, multiply3x3, wrapPerspective } from '../../../../src/utils/matrix.js'
import { TrackerTypes } from '../../constants'

const styles = csjs`
  .wraper, .resCanvas {
    position: absolute;
  }
  .searchBox, .innerBox {
    position: absolute;
  }
  .searchBox {
    border: dashed 1px rgba(255, 255, 255, 0.2);
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

  static contextTypes = {
    cytron: React.PropTypes.object,
  };

  componentDidMount() {
    this.$resCanvas = findDOMNode(this.refs.resCanvas)
    this.resCtx = this.$resCanvas.getContext('2d')
  }

  // componentWillReceiveProps(newProps) {
  //   // should do some check

  // }

  getImgData($img, trackerData, frame) {
    // @TODO: it's not nessesary to do down sampling
    // as long as we are calculating the correct transform matrix
    const { cWidth, cHeight } = this.props
    let canvas = document.createElement('CANVAS')
    canvas.width = cWidth
    canvas.height = cHeight
    let ctx = canvas.getContext('2d')
    let ratio = $img.width / $img.height
    let avaRatio = cWidth / cHeight
    // make sure the canvas contains it
    if (avaRatio >= ratio && $img.height >= cHeight) {
      debug('img is wider than canvas')
      $img.height = cHeight
      $img.width = cHeight * ratio
    } else if (avaRatio < ratio && $img.width >= cWidth) {
      debug('img is taller than canvas')
      $img.width = cWidth
      $img.height = cWidth / ratio
    }
    ctx.drawImage($img, 0, 0, $img.width, $img.height)
    // update trackerData's resTransPoints array
    // this is such a bad code pattern, should be rewrited!!!!
    trackerData.resInitPoints = [
      { x: 0, y: 0 },
      { x: $img.width, y: 0 },
      { x: $img.width, y: $img.height },
      { x: 0, y: $img.height },
    ]
    let maxX = 0, maxY = 0, minX = 9999, minY = 9999
    frame.forEach(f => {
      maxX = Math.max(f.x, maxX)
      maxY = Math.max(f.y, maxY)
      minX = Math.min(f.x, minX)
      minY = Math.min(f.y, minY)
    })
    let dx = maxX - minX, dy = dx / ratio
    if (!trackerData.resTransPoints) trackerData.resTransPoints = []
    trackerData.resTransPoints.push({ x: minX, y: minY }) // TL
    trackerData.resTransPoints.push({ x: maxX, y: minY }) // TR
    trackerData.resTransPoints.push({ x: maxX, y: maxY + dy }) // BR
    trackerData.resTransPoints.push({ x: minX, y: maxY + dy }) // BL

    trackerData.resRelativeMtx = findHomographyFromArray(trackerData.resInitPoints, trackerData.resTransPoints)

    return ctx.getImageData(0, 0, $img.width, $img.height)
  }

  drawResource() {
    const { currentFrame, trackerData, cWidth, cHeight } = this.props
    const { resourceId } = trackerData
    /* eslint-disable eqeqeq */
    if (resourceId == null)
      return

    const frame = trackerData.frames[currentFrame]
    const { imgCachePool, imgInitRawData } = this.context.cytron
    const $img = imgCachePool[resourceId]
    let imgData = imgInitRawData[resourceId]
    if (!imgData) {
      debug('init image data not exists, creating it...')
      imgData = this.getImgData($img, trackerData, frame)
      this.context.cytron.imgInitRawData[resourceId] = imgData
    }

    let mtx = trackerData.resRelativeMtx.slice()
    if (!trackerData.mtxs) trackerData.mtxs = []
    var homoMtx = trackerData.mtxs[currentFrame]
    // calculate homography
    if (homoMtx) {
      // change the resTransMtx
      mtx = multiply3x3(mtx, homoMtx)
    }
    // draw attatched resource
    this.resCtx.clearRect(0, 0, cWidth, cHeight)
    let destData = this.resCtx.createImageData(cWidth, cHeight)
    wrapPerspective(imgData, destData, mtx, 0, 0)
    this.resCtx.putImageData(destData, 0, 0)
  }

  getOffset(ee, se) {
    return {
      offsetX: ee.clientX - se.clientX,
      offsetY: ee.clientY - se.clientY,
    }
  }

  _rectMove = (ee, se, index, point) => {
    if (!this.__moveStart) {
      this.__moveStart = {
        x: point.x, y: point.y,
      }
    }
    const { offsetX, offsetY } = this.getOffset(ee, se)
    let x = this.__moveStart.x + offsetX
    let y = this.__moveStart.y + offsetY
    this.props.trackerPointMove(x, y, index)
  }

  _dragUp = () => {
    this.__moveStart = null
  }

  // @TODO: resizable tracker search & inner box
  $boxes() {
    const { trackerData, currentFrame } = this.props
    if (!trackerData) return null
    const frame = trackerData.frames[currentFrame]
    if (!frame || !Array.isArray(frame)) return null

    this.drawResource(frame)

    return frame.map((point, index) => {
      const { x, y, rectW, rectH, searchW, searchH } = point
      // debug(x, y, rectW, rectH, searchW, searchH)
      const searchStyle = {
        width: searchW, height: searchH,
        top: y - searchH / 2, left: x - searchW / 2,
      }
      const innerStyle = {
        width: rectW, height: rectH,
        top: (searchH - rectH) / 2, left: (searchW - rectW) / 2,
      }
      // hide searchbox for plannar tracker
      if (trackerData.type === TrackerTypes.PLANNAR) {
        searchStyle.borderColor = 'transparent'
        innerStyle.borderRadius = '50%'
      }


      return (
        <div className={styles.searchBox} key={index}
          style={searchStyle}>
          <Dragable
            onMove={(e, se) => this._rectMove(e, se, index, point)}
            onUp={(e, se) => this._dragUp(e, se, index, point)}
            className={styles.innerBox} style={innerStyle}/>
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
        <canvas className={styles.resCanvas}
          width={cWidth}
          height={cHeight}
          ref="resCanvas"/>
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