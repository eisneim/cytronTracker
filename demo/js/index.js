window.cyDebug = require('debug')
const debug = cyDebug('cy:root')
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { makeStore } from './store.js'
import getApp from './components/App'
import { setupModuleCss } from 'CSJS'

import { rootActions } from './actionCreators'

// import CytronTracker from '../src'

let defaultConfig = {

}

class CytronTrackerApp {

  constructor($container, config = defaultConfig) {
    this.$container = $container
    this.config = {}
    Object.assign(this.config, config)
    // stores the video element in memory
    this.$video = null

    this.store = makeStore(this)
  }

  destroyPreviousVideo() {
    document.body.removeChild(this.$video)
  }

  setVideo(source, fps) {
    if (this.$video) this.destroyPreviousVideo()

    this.$video = document.createElement('video')
    this.$video.src = source
    this.$video.fps = fps
    this.$video.style.display = 'none'
    // this.$video.style.visibility = 'hidden'
    // this.$video.style.position = 'absolute'
    // this.$video.style.top = '0'
    // this.$video.style.left = '0'
    this.$video.preload = true
    document.body.appendChild(this.$video)
    // The first frame of the media has finished loading.
    this.$video.addEventListener('loadeddata', () => {
      this.store.dispatch(rootActions.videoReady(this.$video))
    })
    this.$video.addEventListener('loadedmetadata', () => {
      debug('videoEvt:', 'loadedmetadata')
    })
    this.$video.addEventListener('waiting', () => {
      debug('videoEvt:', 'waiting')
    })
    this.$video.addEventListener('seeking', () => {
      debug('videoEvt:', 'seeking')
    })
    this.$video.addEventListener('seeked', () => {
      debug('videoEvt:', 'seeked')
    })
    this.$video.addEventListener('ended', () => {
      debug('videoEvt:', 'ended')
    })
    this.$video.addEventListener('canplay', () => {
      debug('videoEvt:', 'canplay')
    })
    this.$video.addEventListener('canplaythrough', () => {
      debug('videoEvt:', 'canplaythrough')
    })
    this.$video.addEventListener('emptied', () => {
      debug('videoEvt:', 'emptied')
    })
    this.$video.addEventListener('suspend', () => {
      debug('videoEvt:', 'suspend')
    })
    this.$video.addEventListener('ratechange', () => {
      debug('videoEvt:', 'ratechange')
    })
    this.$video.addEventListener('stalled', () => {
      debug('videoEvt:', 'stalled')
    })
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
