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
      // debug('videoEvt:', 'canplay')
      this.store.dispatch(rootActions.canPlay())
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

  trackPoints(points, patterns, searchAreas, { prevFrame, targetFrame }) {
    debug('patterns, searchAreas', patterns, searchAreas)
    // trackResult is [{ resultX, resultY }]
    const trackResults = points.map((point, index) => this.trackPoint(point, patterns[index], searchAreas[index]))
    debug('trackResults:', trackResults)
    this.store.dispatch(rootActions.trackPointsDone(trackResults, targetFrame, prevFrame))
  }

  trackPoint({ x, y, rectW, rectH, searchW, searchH }, pattern, searchArea) {
    const isDataValid = pattern.data.length / 4 === rectW * rectH
    if (!isDataValid) {
      debug('pattern', pattern.data.length / 4, rectW * rectH, pattern.width, pattern.height)
      throw new Error('invalid pattern length')
    }
    // this index is the starting position of the pattern without multiply 4
    const index = this.ssd(pattern.data, searchArea.data, rectW, rectH, searchW, searchH)
    const searchX = index % searchW + Math.floor(rectW / 2)
    const searchY = Math.floor(index / searchW) + Math.floor(rectH / 2)

    // onece we have the index in searchArea, we need find it's center position x,y
    // in the whole nextFData
    const resultX = x + Math.floor(searchW / 2) - searchX
    const resultY = y + Math.floor(searchH / 2) - searchY
    debug('result index', index, 'searchX', searchX, searchY, 'resultX', resultX, resultY, x - resultX, y - resultY)
    return { resultX, resultY, x, y }
  }

  ssd(pattern, search, pWidth, pHeight, sWidth, sHeight) {
    // debug('start ssd', pattern, search, pWidth, pHeight, sWidth, sHeight)
    let minVal = 9999, index = 0
    let eachSum = [] // debug only
    for (var ii = 0; ii < sWidth * sHeight; ii++) {
      let rowNum = Math.floor(ii / sWidth), colNum = ii % sWidth
      if (colNum > sWidth - pWidth || rowNum > sHeight - pHeight)
        continue
      // calculate the sum of differience
      let sumR = 0, sumG = 0, sumB = 0, sum = 0
      for (var jj = 0; jj < pWidth * pHeight; jj++) {
        let tIndex = Math.floor(jj / pWidth) * sWidth + ii + jj % pWidth // rowNumber * sWidth + ii + jjX
        sumR += search[tIndex * 4] - pattern[jj * 4]
        sumG += search[tIndex * 4 + 1] - pattern[jj * 4 + 1]
        sumB += search[tIndex * 4 + 2] - pattern[jj * 4 + 2]
      }
      sum += Math.abs(sumR) + Math.abs(sumG) + Math.abs(sumB)
      minVal = Math.min(minVal, sum)
      if (minVal === sum) index = ii // save this index
      eachSum.push(ii, sum)
    }
    debug('eachSum', eachSum)
    return index
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
