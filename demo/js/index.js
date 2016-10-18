import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { makeStore } from './store.js'
import { ConnectedApp } from './components/App'

import debug from 'debug'
window.cyDebug = debug
// import CytronTracker from '../src'

let defaultConfig = {

}

class CytronTrackerApp {

  constructor($container, config = defaultConfig) {
    this.$container = $container
    this.config = {}
    Object.assign(this.config, config)

    this.store = makeStore(this)
  }

  render() {
    if (this.isRendered) return
    this.isRendered = true

    ReactDOM.render(
      <Provider store={ this.store }>
        <ConnectedApp />
      </Provider>
      , this.$container
    )
  }
}

// window.CytronTrackerApp = CytronTrackerApp
// module.exports = CytronTrackerApp
let cta = window.__cta = new CytronTrackerApp(document.getElementById('app'))
cta.render()
