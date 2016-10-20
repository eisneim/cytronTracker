window.cyDebug = require('debug')

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { makeStore } from './store.js'
import getApp from './components/App'
import { setupModuleCss } from 'CSJS'

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
    const App = getApp(this)

    ReactDOM.render(
      <Provider store={ this.store }>
        <App />
      </Provider>
      , this.$container
    )
  }
}

setupModuleCss(document.getElementsByTagName('head')[0])

// window.CytronTrackerApp = CytronTrackerApp
// module.exports = CytronTrackerApp
let cta = window.__cta = new CytronTrackerApp(document.getElementById('app'))
cta.render()
