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
