import React from 'react'
import cx from 'classnames'
import styles from '../styles'

const debug = require('debug')('cy:App')
debug('styles:', styles)

export default class App extends React.Component {
  render() {
    return (
      <div className={cx(styles.cytronApp, styles.clearfix)}>
        <h1>Hello world</h1>
      </div>
    )
  }
}

import { connect } from 'react-redux'
import actions from '../actionCreators'

function mapStateToProps(state) {
  return {
    layout: state.layout,
  }
}

export const ConnectedApp = connect(
  mapStateToProps,
  actions
)(App)