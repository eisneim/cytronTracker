import React from 'react'

export default class App extends React.Component {
  render() {
    return (
      <h1>Hello world</h1>
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