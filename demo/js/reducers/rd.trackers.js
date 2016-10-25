/* eslint-disable no-unused-vars */
import { TrackerTypes, DefaultTracker } from '../constants'
const debug = require('debug')('cy:rd.trackers')
let idCount = 1
const FRAMEPROPS = [ 'x', 'y', 'rectH', 'rectW', 'searchH', 'searchW' ]

export default {
  SOME_ACTION(state, payload, cytron) {
    return state
  },

  NEW_TRACKER(trackers, trackerType, cytron) {
    const { layout, root } = cytron.store.getState()
    const { currentFrame } = root
    let newTracker = {
      id: idCount++,
      name: 'Tracker ' + idCount,
      type: trackerType,
      frames: [],
    }
    root.currentTracker = newTracker.id
    // set initial points
    const { canvasWidth, canvasHeight } = layout
    const { SEARCH_SIZE, RECT_SIZE } = DefaultTracker

    let frame = [], distance = 100
    switch (trackerType) {
    case TrackerTypes.MOTION:
      frame.push({
        x: canvasWidth / 2, y: canvasHeight / 2,
        rectW: RECT_SIZE, rectH: RECT_SIZE, searchW: SEARCH_SIZE, searchH: SEARCH_SIZE,
      })
      break
    case TrackerTypes.SCALE_ROTATION:
      frame.push({
        x: canvasWidth / 2 - distance, y: canvasHeight / 2,
        rectW: RECT_SIZE, rectH: RECT_SIZE, searchW: SEARCH_SIZE, searchH: SEARCH_SIZE,
      })
      frame.push({
        x: canvasWidth / 2 + distance, y: canvasHeight / 2,
        rectW: RECT_SIZE, rectH: RECT_SIZE, searchW: SEARCH_SIZE, searchH: SEARCH_SIZE,
      })
      break
    case TrackerTypes.PERSPECTIVE: // clockwise
      frame.push({
        x: canvasWidth / 2 - distance, y: canvasHeight / 2 - distance,
        rectW: RECT_SIZE, rectH: RECT_SIZE, searchW: SEARCH_SIZE, searchH: SEARCH_SIZE,
      })
      frame.push({
        x: canvasWidth / 2 + distance, y: canvasHeight / 2 - distance,
        rectW: RECT_SIZE, rectH: RECT_SIZE, searchW: SEARCH_SIZE, searchH: SEARCH_SIZE,
      })
      frame.push({
        x: canvasWidth / 2 + distance, y: canvasHeight / 2 + distance,
        rectW: RECT_SIZE, rectH: RECT_SIZE, searchW: SEARCH_SIZE, searchH: SEARCH_SIZE,
      })
      frame.push({
        x: canvasWidth / 2 - distance, y: canvasHeight / 2 + distance,
        rectW: RECT_SIZE, rectH: RECT_SIZE, searchW: SEARCH_SIZE, searchH: SEARCH_SIZE,
      })
      break
    // case TrackerTypes.PLANNAR:
    // break
    default: break
    }

    newTracker.frames[currentFrame] = frame
    trackers.push(newTracker)

    return trackers.slice()
  },
  UPDATE_TRACKER_POINT(trackers, payload, cytron) {
    const { currentFrame, currentTracker } = cytron.store.getState().root
    const trackerIndex = trackers.findIndex(t => t.id === currentTracker)
    let newTracker = Object.assign({}, trackers[trackerIndex])
    const frame = newTracker.frames[currentFrame].slice()

    if (!frame[payload.index]) {
      throw new Error(`invalid index ${payload.index} or target frame length:${frame.length}`)
    }

    /* eslint-disable eqeqeq */
    FRAMEPROPS.forEach(key => {
      if (payload[key] != null)
        frame[payload.index][key] = Math.floor(payload[key]) // decimal number is not alowed!!
    })
    // create new object to pass shallowEqual
    newTracker.frames[currentFrame] = frame
    trackers[trackerIndex] = newTracker
    return trackers
  },

  TRACK_POINTS_DONE(trackers, { trackResults, targetFrame, prevFrame }, cytron) {
    const { root } = cytron.store.getState()
    const { currentTracker } = root
    const trackerIndex = trackers.findIndex(t => t.id === currentTracker)
    let newTracker = Object.assign({}, trackers[trackerIndex])
    const prevFrameData = newTracker.frames[prevFrame] // its an array

    let frame = newTracker.frames[targetFrame] || []

    trackResults.forEach((result, index) => {
      let point = frame[index] || Object.assign({}, prevFrameData[index])
      const { resultX, resultY, x, y } = result
      // targetFrame should be current frame if track frame by frame
      debug('offSet:', x - resultX, y - resultY, 'targetFrame', targetFrame)
      point.x = resultX
      point.y = resultY

      frame[index] = point
    })
    root.delayedTrackJob = null
    newTracker.frames[targetFrame] = frame
    trackers[trackerIndex] = newTracker
    return trackers
  },

}