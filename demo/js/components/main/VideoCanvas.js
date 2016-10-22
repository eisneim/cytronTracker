import React from 'react'
import { findDOMNode } from 'react-dom'
// import cx from 'classnames'
import theme from '../../theme'
import csjs from 'CSJS'
const debug = require('debug')('cy:VideoCanvas')

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
    const { cWidth, cHeight } = this.props
    this.srcCtx.drawImage($video, 0, 0, cWidth, cHeight)
    let frame = this.srcCtx.getImageData(0, 0, cWidth, cHeight)
    this.dstCtx.putImageData(frame, 0, 0)
  }

  componentWillReceiveProps() {
    debug('componentWillReceiveProps')
  }

  componentDidUpdate() {
    if (this.props.duration) {
      this.drawCurrentFrame()
    }
    debug('DidUpdate')
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
  }
}

export const ConnectedVideoCanvas = connect(
  mapStateToProps,
  rootActions
)(VideoCanvas)