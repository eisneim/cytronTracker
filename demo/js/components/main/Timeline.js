import React from 'react'
import { findDOMNode } from 'react-dom'
// import cx from 'classnames'
// import gStyles from '../styles'
import theme from '../../theme'
import csjs from 'CSJS'

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
    this.ctx.clearRect(0, 0, this.props.availableWidth, theme.timelineHeight - 1)
  }

  draw() {
    const { currentFrame, video } = this.props.root
    if (!video.duration) {
      this.ctx.fillText('processe vdieo first to generate timeline', 100, 15)
      return
    }
  }

  componentDidMount() {
    this.init()
    this.clear()
    this.draw()
  }

  componentDidUpdate() {
    this.init()
    this.clear()
    this.draw()
  }

  shouldComponentUpdate() {
    return false
  }

  render() {
    const { availableWidth } = this.props

    return (
      <div className={styles.timeline}>
        <canvas
          ref="canvas"
          width={availableWidth}
          height={theme.timelineHeight - 1}
          style={{ display: 'block' }}
        />
      </div>
    )
  }
}

import { connect } from 'react-redux'
import actions from '../../actionCreators'

function mapStateToProps(state) {
  return {
    availableWidth: state.layout.mainSectionWidth,
    root: state.root,
  }
}

export const ConnectedTimeline = connect(
  mapStateToProps,
  actions
)(Timeline)