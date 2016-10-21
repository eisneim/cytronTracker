const debug = require('debug')('cy:rd.root')
/* eslint-disable no-unused-vars */
export default {
  VIDEO_READY(root, $video, cytron) {
    root.video.duration = $video.duration
    root.video.width = $video.videoWidth
    root.video.height = $video.videoHeight

    return root
  },
  SET_VIDEO(root, { url, fps }, cytron) {
    root.video.url = url
    root.video.fps = fps
    cytron.setVideo(url, fps)
    return root
  },
}