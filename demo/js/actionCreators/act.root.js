export function videoReady($video) {
  return {
    type: 'VIDEO_READY',
    payload: $video,
  }
}