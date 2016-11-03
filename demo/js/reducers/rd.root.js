const debug = require('debug')('cy:rd.root')

function setFrame(root, frame, cytron) {
  const { fps, duration } = root.video
  if (frame < 0 || frame > fps * duration) return root

  root.currentFrame = frame
  cytron.$video.currentTime = root.currentTime = Math.floor(frame / fps * 100) / 100

  return root
}

function resetTimer(cytron) {
  debug('should reset timer')
  if (cytron.__timer) {
    clearInterval(cytron.__timer)
    cytron.__timer = null
  }
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
      prevFrame: root.currentFrame,
      targetFrame,
    }

    return setFrame(root, targetFrame, cytron)
  },
  PLAY(root, payload, cytron) {
    resetTimer(cytron)
    let gap = 1000 / root.video.fps / 2
    cytron.$video.play()
    cytron.__timer = setInterval(()=> {
      const frame = Math.floor(cytron.$video.currentTime * root.video.fps)

      cytron.store.dispatch({
        type: 'UPDATE_FRAME',
        meta: { ignoreLog: true },
        payload: frame,
      })
    }, gap)
    root.isPlaying = true
    return root
  },
  PAUSE(root, payload, cytron) {
    cytron.$video.pause()
    resetTimer(cytron)
    root.isPlaying = false
    return root
  },
  // differient with setFrame, here we don't touch $video
  UPDATE_FRAME(root, frame, cytron) {
    root.currentTime = cytron.$video.currentTime
    root.currentFrame = frame
    return root
  },
}