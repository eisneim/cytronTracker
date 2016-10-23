const debug = require('debug')('cy:rd.root')

function setFrame(root, frame, cytron) {
  const { fps, duration } = root.video
  if (frame < 0 || frame > fps * duration) return root

  root.currentFrame = frame
  cytron.$video.currentTime = root.currentTime = Math.floor(frame / fps * 100) / 100

  return root
}

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

  SET_FRAME: setFrame,
  CAN_PLAY(root, id, cytron) {
    root.canplayId = id
    return root
  },

  SELECT_TRACKER(root, id, cytron) {

  },
  TRACK_BY_FRAME(root, isForward, cytron) {
    const targetFrame = root.currentFrame + (isForward ? 1 : -1)
    root.delayedTrackJob = {
      from: root.currentFrame,
      to: targetFrame,
    }

    return setFrame(root, targetFrame, cytron)
  },
}