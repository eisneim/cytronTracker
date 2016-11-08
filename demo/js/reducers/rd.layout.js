import theme from '../theme'
import { ModalIds } from '../constants'

const debug = require('debug')('cy:rd.layout')

function getAvaHeight(layout) {
  return layout.windowHeight - theme.controlsBarHeight - theme.timelineHeight - 25 * 2 // panel header and footer.
}

/* eslint-disable no-unused-vars */
export default {
  VIDEO_READY(layout, $video, cytron) {
    const { videoWidth, videoHeight } = $video
    const { mainSectionWidth } = layout
    // compute the canvasWidth and height
    const avaHeight = getAvaHeight(layout)
    const ratio = videoWidth / videoHeight
    const aRatio = mainSectionWidth / avaHeight
    /* eslint-disable no-lonely-if */
    if (ratio >= aRatio) {
      if (videoWidth > mainSectionWidth) {
        layout.canvasWidth = mainSectionWidth - 6
        layout.canvasHeight = layout.canvasWidth / ratio
      } else {
        layout.canvasWidth = videoWidth
        layout.canvasHeight = videoHeight
      }
    } else {
      if (videoHeight > avaHeight) {
        layout.canvasHeight = avaHeight - 6
        layout.canvasWidth = layout.canvasHeight * ratio
      } else {
        layout.canvasHeight = videoHeight
        layout.canvasWidth = videoWidth
      }
    }

    // set the video width and height as well
    cytron.$video.width = layout.canvasWidth
    cytron.$video.height = layout.canvasHeight

    return layout
  },
  SET_ITEMS_TAB(layout, tab) {
    layout.activeItemTab = tab
    return layout
  },
  SET_MODAL(layout, { key, isOpen }) {
    if (!ModalIds[key])
      debug(`invalid modal id: ${key}`)
    let modals = layout.activeModals.slice()
    let idx = modals.indexOf(key)
    let isExist = idx > -1
    if (isOpen && !isExist) {
      modals.push(key)
    } else if (!isOpen && isExist) {
      modals.splice(idx, 1)
    }

    layout.activeModals = modals
    return layout
  },
}
