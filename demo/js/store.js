import { createStore, applyMiddleware } from 'redux'
import { logger, requestPromise, saveStateChecker } from './middlewares.js'
import appReducer from './reducers'

const debug = require('debug')('cy:store')

const STATE_KEY = 'CYTRON_TRACKER_DEMO'

var defaultStateObj = {
  root: {
    video: {
      url: 'footage.mp4',
      fps: 25,
      width: 800, height: 450,
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
    rightSectionWidth: 303,
    mainSectionWidth: null,
    canvasWidth: 800,
    canvasHeight: 450,
    activeItemTab: 'RESOURCES', // MASKS, FILES
    showExporter: false,
    activeModals: [],
  },
  /* each tracker has:
    id,
    type: 'MOTION', // 'SCALE_ROTATION', 'CORNOR_PIN', 'PLANNAR'
    rotation: false,
    scale: false,
    frames: [{
      x, y, rectH, rectW, searchW, searchH
    }],
  */
  trackers: [], // tracker1 => tracks(4) [{x,y},{x,y}], frameNumber is index of each coordinate
  masks: [], // masks for items, can be resued.
  items: [], // {id, trackerId, maskId, resourceId, w, h,}
  resources: [
    { id: 100, url: 'https://vplscdn.videojj.com/page/index/logo.png' },
    { id: 110, url: 'https://vplscdn.videojj.com/brand/img/brand-icon-logo-3.png' },
    { id: 120, url: 'https://vplscdn.videojj.com/brand/img/part4-2.png' },
  ], // { id, name, }
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
  state.layout.mainSectionWidth = state.layout.windowWidth - state.layout.rightSectionWidth
  // save config options to state.config
  state.config = cytronApp.config

  return createStoreWithMiddleware(
    appReducer(cytronApp),
    state
  )
}
