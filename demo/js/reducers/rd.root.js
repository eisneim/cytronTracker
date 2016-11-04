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
  /* eslint-disable eqeqeq */
  if (cytron.__timer != null) {
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
    root.currentTracker = id
    return root
  },
  DELETE_TRACKER(root, id, cytron) {
    root.currentTracker = null
    return root
  },
  TRACK_BY_FRAME(root, isForward, cytron) {
    const targetFrame = root.currentFrame + (isForward ? 1 : -1)
    let totalFrame = cytron.$video.duration * root.video.fps
    if (targetFrame > totalFrame) {
      debug(`!!!max Frame Number: ${totalFrame} reached!`)
      return root
    }

    root.delayedTrackJob = {
      prevFrame: root.currentFrame,
      targetFrame,
    }

    return setFrame(root, targetFrame, cytron)
  },
  TRACKING(root, isForward, cytron) {
    root.isTracking = true
    setTimeout(() => {
      cytron.store.dispatch({
        type: 'TRACK_BY_FRAME', payload: isForward,
      })
    }, 0)
    return root
  },
  STOP_TRACKING(root) {
    root.isTracking = false

    return root
  },
  TRACK_POINTS_DONE(root, { targetFrame, prevFrame }, cytron) {
    let isForward = prevFrame < targetFrame
    if (root.isTracking) {
      setTimeout(() => {
        cytron.store.dispatch({
          type: 'TRACK_BY_FRAME',
          payload: isForward,
        })
      }, 10) // give it a little gap to avoid thread blocking
    }

    return root
  },

  PLAY(root, payload, cytron) {
    resetTimer(cytron)
    let gap = 1000 / root.video.fps / 2
    cytron.$video.play()
    cytron.__timer = setInterval(()=> {
      if (cytron.$video.duration - cytron.$video.currentTime <= 0.01) {
        cytron.store.dispatch({ type: 'PAUSE' })
        return
      }

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
  STOP_PLAYING(root, payload, cytron) {
    resetTimer(cytron)
    cytron.$video.pause()
    cytron.$video.currentTime = 0
    root.currentTime = 0
    root.currentFrame = 0
    root.isPlaying = false

    return root
  },
}