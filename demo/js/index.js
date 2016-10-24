window.cyDebug = require('debug')
const debug = cyDebug('cy:root')
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { makeStore } from './store.js'
import getApp from './components/App'
import { setupModuleCss } from 'CSJS'

import { TrackerTypes } from './constants'
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

  track(fData, nextFData, { prevFrame, targetFrame }) {
    const { root, trackers, layout } = this.store.getState()
    const { currentTracker } = root
    const trackerData = trackers.find(t => t.id === currentTracker)
    const points = trackerData.frames[prevFrame]
    if (trackerData.type === TrackerTypes.PLANNAR) {
      debug('should do plannar track, but not supported yet')
      return
    }
    // trackResult is [{ resultX, resultY }]
    const trackResults = points.map(point => this.trackPoint(point, fData, nextFData, layout.canvasWidth))
    this.store.dispatch(rootActions.trackPointsDone(trackResults, targetFrame, prevFrame))
  }

  getDataByRect(frameData, x, y, rectW, rectH, width) {
    let xOffset = Math.floor(rectW / 2)
    let yOffset = Math.floor(rectH / 2)
    let patternBeginIndex = (y - yOffset) * width * 4 + (x - xOffset) * 4
    let patternEndIndex = (y + yOffset) * width * 4 + (x + xOffset) * 4
    return frameData.data.slice(patternBeginIndex, patternEndIndex)
  }

  trackPoint({ x, y, rectW, rectH, searchW, searchH }, fData, nextFData, width) {

    let patternData = this.getDataByRect(fData, x, y, rectW, rectH, width)
    let searchArea = this.getDataByRect(nextFData, x, y, searchW, searchH, width)
    debug('should be valid data:', patternData.length / 4 === rectW * rectH)
    // this index is the starting position of the pattern without multiply 4
    const index = this.ssd(patternData, searchArea, rectW, searchW)
    const searchX = index % searchW + Math.ceil(rectW / 2)
    const searchY = Math.ceil(index / searchW) + Math.ceil(rectH / 2)

    // onece we have the index in searchArea, we need find it's center position x,y
    // in the whole nextFData
    resultX = x + searchX - Math.floor(searchW / 2)
    resultY = y + searchY - Math.floor(searchH / 2)
    return { resultX, resultY, x, y }
  }

  ssd(pattern, target, pWidth, pHeight, tWidth, tHeight) {
    let minVal = 9999, index = 0
    for (var ii = 0; ii < target.length / 4; ii++) {
      let rowNum = Math.floor(ii / tWidth), colNum = ii % tWidth
      if (colNum > tWidth - pWidth || rowNum > tHeight - pHeight)
        continue
      // calculate the sum of differience
      let sumR = 0, sumG = 0, sumB = 0, sum = 0
      for (var jj = 0; jj < pattern.length / 4; jj++) {
        let tIndex = Math.floor(jj / pWidth) * tWidth + ii + jj // rowNumber * tWidth + ii + jj
        sumR += target[tIndex * 4] - pattern[jj * 4]
        sumG += target[tIndex * 4 + 1] - pattern[jj * 4 + 1]
        sumB += target[tIndex * 4 + 2] - pattern[jj * 4 + 2]
        sum += Math.abs(sumR) + Math.abs(sumG) + Math.abs(sumB)
      }
      minVal = Math.min(minVal, sum)
      if (minVal === sum) index = ii // save this index
    }

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
