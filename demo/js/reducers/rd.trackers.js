/* eslint-disable no-unused-vars */
import { TrackerTypes, DefaultTracker } from '../constants'
let idCount = 0

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

    let frame = []
    switch (trackerType) {
    case TrackerTypes.MOTION:
      frame.push({
        x: canvasWidth / 2, y: canvasHeight / 2,
        rectW: RECT_SIZE, rectH: RECT_SIZE, searchW: SEARCH_SIZE, searchH: SEARCH_SIZE,
      })
      break
    case TrackerTypes.SCALE_ROTATION:
      frame.push({
        x: canvasWidth / 2 - 150, y: canvasHeight / 2,
        rectW: RECT_SIZE, rectH: RECT_SIZE, searchW: SEARCH_SIZE, searchH: SEARCH_SIZE,
      })
      frame.push({
        x: canvasWidth / 2 + 150, y: canvasHeight / 2,
        rectW: RECT_SIZE, rectH: RECT_SIZE, searchW: SEARCH_SIZE, searchH: SEARCH_SIZE,
      })
      break
    case TrackerTypes.PERSPECTIVE: // clockwise
      frame.push({
        x: canvasWidth / 2 - 150, y: canvasHeight / 2 - 150,
        rectW: RECT_SIZE, rectH: RECT_SIZE, searchW: SEARCH_SIZE, searchH: SEARCH_SIZE,
      })
      frame.push({
        x: canvasWidth / 2 + 150, y: canvasHeight / 2 - 150,
        rectW: RECT_SIZE, rectH: RECT_SIZE, searchW: SEARCH_SIZE, searchH: SEARCH_SIZE,
      })
      frame.push({
        x: canvasWidth / 2 + 150, y: canvasHeight / 2 + 150,
        rectW: RECT_SIZE, rectH: RECT_SIZE, searchW: SEARCH_SIZE, searchH: SEARCH_SIZE,
      })
      frame.push({
        x: canvasWidth / 2 - 150, y: canvasHeight / 2 + 150,
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
}