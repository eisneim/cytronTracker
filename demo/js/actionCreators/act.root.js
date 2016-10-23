
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

export function trackerPointMove(x, y, index) {
  return {
    type: 'UPDATE_TRACKER_POINT',
    meta: { ignoreLog: true },
    payload: { x, y, index },
  }
}
