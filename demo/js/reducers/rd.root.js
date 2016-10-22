const debug = require('debug')('cy:rd.root')


// let idCount = 0

/* eslint-disable no-unused-vars */
export default {
  VIDEO_READY(root, $video, cytron) {
    root.video.duration = $video.duration
    root.video.width = $video.videoWidth
    root.video.height = $video.videoHeight
    root.video = Object.assign({}, root.video)
    return Object.assign({}, root)
  },

  SET_VIDEO(root, { url, fps }, cytron) {
    root.video.url = url
    root.video.fps = fps
    cytron.setVideo(url, fps)
    return root
  },

  SET_FRAME(root, frame, cytron) {
    const { fps, duration } = root.video
    if (frame < 0 || frame > fps * duration) return root

    root.currentFrame = frame
    cytron.$video.currentTime = root.currentTime = Math.floor(frame / fps * 100) / 100

    return root
  },
  CAN_PLAY(root, id, cytron) {
    root.canplayId = id
    return root
  },

  SELECT_TRACKER(root, id, cytron) {

  },
}