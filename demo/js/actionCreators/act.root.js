
export function videoReady($video) {
  return {
    type: 'VIDEO_READY',
    payload: $video,
  }
}

export function setVideo(url, fps) {
  return {
    type: 'SET_VIDEO',
    payload: { url, fps },
  }
}

export function setFrame(num) {
  return {
    type: 'SET_FRAME',
    payload: num,
  }
}

export function canPlay() {
  return {
    type: 'CAN_PLAY',
    payload: Date.now(),
  }
}

export function newTracker(trackerType) {
  return {
    type: 'NEW_TRACKER',
    payload: trackerType,
  }
}

export function selectTracker(id) {
  return {
    type: 'SELECT_TRACKER',
    payload: id,
  }
}
export function deleteTracker(id) {
  return {
    type: 'DELETE_TRACKER',
    payload: id,
  }
}

export function trackerPointMove(x, y, index) {
  return {
    type: 'UPDATE_TRACKER_POINT',
    meta: { ignoreLog: true },
    payload: { x, y, index },
  }
}

export function resBoundPointMove(x, y, index) {
  return {
    type: 'UPDATE_RES_POINTS',
    meta: { ignoreLog: true },
    payload: { x, y, index },
  }
}

export function trackNextFrame() {
  return {
    type: 'TRACK_BY_FRAME',
    payload: true,
  }
}
export function trackPrevFrame() {
  return {
    type: 'TRACK_BY_FRAME',
    payload: false,
  }
}

export function startTracking(isForward) {
  return {
    type: 'TRACKING',
    payload: isForward,
  }
}
export function stopTracking() {
  return {
    type: 'STOP_TRACKING',
    payload: null,
  }
}
export function trackPointsDone(trackResults, targetFrame, prevFrame) {
  return {
    type: 'TRACK_POINTS_DONE',
    payload: { trackResults, targetFrame, prevFrame },
  }
}
export function play() {
  return {
    type: 'PLAY',
    payload: null,
  }
}
export function pause() {
  return {
    type: 'PAUSE',
    payload: null,
  }
}
export function stopPlaying() {
  return { type: 'STOP_PLAYING' }
}
