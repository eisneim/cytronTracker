import React from 'react'
import { findDOMNode } from 'react-dom'
// import cx from 'classnames'
// import theme from '../theme'
// import csjs from 'CSJS'
const debug = require('debug')('cy:VideoCanvas')

export default class VideoCanvas extends React.Component {

  static contextTypes = {
    cytron: React.PropTypes.object,
  };

  componentDidMount() {
    debug(this.context)
  }

  render() {
    return (
      <div>
        ddd?
      </div>
    )
  }
}


import { connect } from 'react-redux'
import actions from '../../actionCreators'

function mapStateToProps(state) {
  return {
    root: state.root,
  }
}

export const ConnectedVideoCanvas = connect(
  mapStateToProps,
  actions
)(VideoCanvas)