/* eslint-disable no-unused-vars */
import { TrackerTypes, DefaultTracker } from '../constants'
let idCount = 1

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
    let props = [ 'x', 'y', 'rectH', 'rectW', 'searchH', 'searchW' ]
    /* eslint-disable eqeqeq */
    props.forEach(key => {
      if (payload[key] != null)
        frame[payload.index][key] = payload[key]
    })
    // create new object to pass shallowEqual
    newTracker.frames[currentFrame] = frame
    trackers[trackerIndex] = newTracker
    return trackers
  },

  TRACK_BY_FRAME_DONE(trackers, isForward, cytron) {

  },

  TRACKING(trackers, isForward, cytron) {

  },

}