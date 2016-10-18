import { createStore, applyMiddleware } from 'redux'
import { logger, requestPromise, saveStateChecker } from './middlewares.js'
import appReducer from './reducers'

const debug = require('debug')('cy:store')

const STATE_KEY = 'CYTRON_TRACKER_DEMO'

var defaultStateObj = {
  root: {
    video: {
      url: 'footage.mp4',
      fps: 24,
      width: null, height: null,
      duration: null,
    },
    isTracking: false,
    isPlaying: false,
    currentTracker: null, // id
    currentFrame: 0,
    currentTime: 0,
  },
  layout: {
    windowWidth: null,
    windowHeight: null,
    mainSectionWidth: null,
    canvasWidth: null,
    canvasHeight: null,
    timelineHeight: null,
    activeItemTab: 'TRACKS', // MASKS, FILES
    showExporter: false,
  },
  /* each tracker has:
    trackConfig: {
      type: 'MOTION', // 'CORNOR_PIN', 'PLANNAR'
      motion: false,
      rotation: false,
      scale: false,
    },
    startPoints: [{
      trackerId, x, y, rectH, rectW, searchW, searchH
    }],
  */
  trackers: [], // tracker1 => tracks(4) [{x,y},{x,y}], frameNumber is index of each coordinate
  masks: [], // masks for items, can be resued.
  items: [], // {id, trackerId, maskId, resourceId, w, h,}
  resources: [], // { id, name, }
  exports: [], // { id, itemId,  }
}

export function saveToStorage(state) {
  var data = JSON.stringify(state.toJS ? state.toJS() : state)
  localStorage.setItem(STATE_KEY, data)
}

export function getInitialStateObj() {
  const { cyAppData } = window
  // if (/dev\/?$/.test(window.location.pathname)) {
  //   return defaultStateObj
  // }

  // this state is from page initial load
  if (cyAppData && cyAppData.project) {
    // return cyAppData.project
    return Object.assign({}, cyAppData.project)
  }
    // this is root path, should require user to create new project
    // if(['/',''].indexOf(window.location.pathname) > -1) {}
    // empty
  return defaultStateObj
}

const createStoreWithMiddleware = applyMiddleware(
  logger, requestPromise
)(createStore)

export function makeStore(cytronApp) {
  debug('create app store and pass in cytronApp instance')

  // should prevent config change once initialized
  var state = getInitialStateObj()
  // @TODO: now do some check, make sure some fields exists
  state.layout.windowWidth = window.innerWidth
  state.layout.windowHeight = window.innerHeight
  // save config options to state.config
  state.config = cytronApp.config

  return createStoreWithMiddleware(
    appReducer(cytronApp),
    state
  )
}