import React from 'react'
import { findDOMNode } from 'react-dom'
// import cx from 'classnames'
// import gStyles from '../styles'
import theme from '../../theme'
import csjs from 'CSJS'

const debug = require('debug')('cy:Timeline')

const styles = csjs`
  .timeline {
    border-top: solid 1px ${theme.bgMainBorder};
    /*background-color: ${theme.bgLighter};*/
    position:absolute;
    bottom: 0;
    left: 0;
  }
`
export default class Timeline extends React.Component {

  init() {
    this.$canvas = findDOMNode(this.refs.canvas)
    this.ctx = this.$canvas.getContext('2d')
    this.ctx.fontSize = '10px sans-serif'
    this.ctx.textAlign = 'center'
  }

  clear() {
    this.ctx.fillStyle = '#4e4e4e'
    this.ctx.clearRect(0, 0, this.props.avaWidth, theme.timelineHeight - 1)
  }

  draw() {
    const { avaWidth, duration, fps } = this.props
    debug('drawing', duration)
    if (!duration) {
      this.ctx.fillText('processe vdieo first to generate timeline', 100, 15)
      return
    }
    //@TODO: use more precise method!!
    const fCount = duration * fps
    const drawPerFrame = 5
    let iter = fCount / drawPerFrame
    const pixDist = avaWidth / iter
    const { timelineHeight, timelineScaleMainHeight } = theme
    for (let ii = 0; ii <= iter; ii++) {
      let x = ii * pixDist
      this.ctx.fillRect(x, timelineHeight - timelineScaleMainHeight, 1, timelineScaleMainHeight)
      this.ctx.fillText(Math.floor(ii * drawPerFrame), x, 20)
    }
  }

  componentDidMount() {
    this.init()
    this.clear()
    this.draw()
  }

  componentDidUpdate() {
    debug('didUpdate')
    this.init()
    this.clear()
    this.draw()
  }

  // shouldComponentUpdate(nextProp) {
  //   const shouldUpdate = nextProp.root.duration !== this.props.root.duration
  //   debug('should timeline updated?', shouldUpdate)
  //   return shouldUpdate
  // }

  render() {
    const { avaWidth } = this.props
    return (
      <div className={styles.timeline}>
        <canvas
          ref="canvas"
          width={avaWidth}
          height={theme.timelineHeight - 1}
          style={{ display: 'block' }}
        />
      </div>
    )
  }
}

import { connect } from 'react-redux'
import { rootActions } from '../../actionCreators'

function mapStateToProps(state) {
  const { root } = state
  return {
    avaWidth: state.layout.mainSectionWidth,
    // currentFrame: root.currentFrame,
    fps: root.video.fps,
    duration: root.video.duration,
  }
}

export const ConnectedTimeline = connect(
  mapStateToProps,
  rootActions
)(Timeline)