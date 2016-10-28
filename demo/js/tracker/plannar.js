import jsfeat from 'jsfeat'
const debug = require('debug')('cy:plannar')

const options = {
  blurSize: 5,
  lapThres: 30,
  eigenThres: 25,
  matchThreshold: 48,
}

var patternU8, patternU8Smooth, pCorners, pCornerCount, pDescriptors

export function plannarTrack(pattern, search, trackerData, delayedTrackJob) {
  if (!patternU8) {
    const pWidth = pattern.width, pHeight = pattern.height
    patternU8 = new jsfeat.matrix_t(pWidth, pHeight, jsfeat.U8_t | jsfeat.C1_t)
    patternU8Smooth = new jsfeat.matrix_t(pWidth, pHeight, jsfeat.U8_t | jsfeat.C1_t)
    // we wll limit to 500 strongest points
    pDescriptors = new jsfeat.matrix_t(32, 500, jsfeat.U8_t | jsfeat.C1_t)

    jsfeat.imgproc.grayscale(pattern.data, 640, 480, patternU8)
    jsfeat.imgproc.gaussian_blur(patternU8, patternU8Smooth, options.blurSize)

    pCorners = []
    pDescriptors = []
    for (var ii = 0; ii < pWidth * pHeight; ii++) {
      pCorners[ii] = new jsfeat.keypoint_t(0, 0, 0, 0)
    }
    let border = 3
    pCornerCount = jsfeat.fast_corners.detect(patternU8Smooth, pCorners, border)
  }
  debug('pCorners', pCornerCount, pCorners)

  const sWidth = search.width, sHeight = search.height
  var searchU8, searchU8Smooth, searchCorners, searchDescriptors
  var matches, homo3x3, match_mask




  // pre allocate for cornors


}