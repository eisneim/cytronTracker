/* eslint-disable no-unused-vars */
import { TrackerTypes, DefaultTracker } from '../constants'
import notify from '../utils/util.notify.js'

const debug = require('debug')('cy:rd.trackers')
let idCount = 1
const getID = () => idCount++
const FRAMEPROPS = [ 'x', 'y', 'rectH', 'rectW', 'searchH', 'searchW' ]

function actTrackerNFrame(state) {
  const { currentFrame, currentTracker } = state.root
  const idx = state.trackers.findIndex(t => t.id === currentTracker)
  if (idx === -1)
    return { tracker: null, idx }

  let tracker = Object.assign({}, state.trackers[idx])
  let frame = tracker.frames[currentFrame] || []

  return { tracker, currentFrame, currentTracker, frame, idx }
}

export default {

  NEW_TRACKER(trackers, trackerType, cytron) {
    const { layout, root } = cytron.store.getState()
    const { currentFrame } = root
    let newTracker = {
      id: getID(),
      name: 'Tracker ' + idCount,
      type: trackerType,
      frames: [],
    }
    root.currentTracker = newTracker.id
    // set initial points
    const { canvasWidth, canvasHeight } = layout
    const { SEARCH_SIZE, RECT_SIZE } = DefaultTracker

    let frame = [], distance = 100

    let addFourPoint = frame => {
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
    }

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
    case TrackerTypes.PERSPECTIVE : // clockwise
      addFourPoint(frame)
      break
    case TrackerTypes.PLANNAR:
      addFourPoint(frame)
      break
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
    // @TODO: should refactor these steps into a function
    const { root } = cytron.store.getState()
    const { currentTracker } = root
    const trackerIndex = trackers.findIndex(t => t.id === currentTracker)
    let newTracker = Object.assign({}, trackers[trackerIndex])
    const prevFrameData = newTracker.frames[prevFrame] || [] // its an array

    let frame = newTracker.frames[targetFrame] || []

    if (newTracker.type === TrackerTypes.PLANNAR) {
      let { newPoints, homo3x3 } = trackResults
      // save trasform matrix
      if (!newTracker.mtxs) newTracker.mtxs = []
      newTracker.mtxs[targetFrame] = homo3x3

      newPoints.forEach((result, index) => {
        let point = frame[index] || Object.assign({}, prevFrameData[index])
        point.x = Math.round(result.x)
        point.y = Math.round(result.y)
        frame[index] = point
      })
    } else {
      trackResults.forEach((result, index) => {
        let point = frame[index] || Object.assign({}, prevFrameData[index])
        const { resultX, resultY, x, y } = result
        // targetFrame should be current frame if track frame by frame
        point.x = resultX
        point.y = resultY
        frame[index] = point
      })
    }

    root.delayedTrackJob = null
    newTracker.frames[targetFrame] = frame
    trackers[trackerIndex] = newTracker
    return trackers
  },
  DELETE_TRACKER(trackers, id, cytron) {
    const index = trackers.findIndex(t => t.id === id)
    let newTrackers = trackers.slice()
    newTrackers.splice(index, 1)
    // release huge array in cytron
    cytron.deleteTracker(id)
    return newTrackers
  },
  RES_TO_TRACKER(trackers, resource, cytron) {
    const { tracker, idx } = actTrackerNFrame(cytron.store.getState())
    if (!tracker) {
      notify.error('need to create tracker first')
      return trackers
    }
    if (tracker.resourceId != null) {
      notify.warn('should create a new tracker, currently only support 1 tracker 1 resource')
      return trackers
    }
    tracker.resourceId = resource.id

    trackers[idx] = tracker
    return trackers
  },
}