import jsfeat from 'jsfeat'
const debug = require('debug')('cy:plannar')

const options = {
  blurSize: 5,
  lapThres: 30,
  eigenThres: 25,
  matchThreshold: 48,
}
/* eslint-disable camelcase */
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

    jsfeat.yape06.laplacian_threshold = options.lapThres | 0
    jsfeat.yape06.min_eigen_value_threshold = options.eigenThres | 0

    pCornerCount = detect_keypoints(patternU8Smooth, pCorners, 500)

    jsfeat.orb.describe(patternU8Smooth, pCorners, pCornerCount, pDescriptors)
  }
  debug('pCorners', pCornerCount, pCorners)
  debug('pDescriptors:', pDescriptors)

  const sWidth = search.width, sHeight = search.height
  var searchU8, searchU8Smooth, searchCorners, searchDescriptors
  var matches, homo3x3, match_mask




  // pre allocate for cornors


}

export default class PlannarTracker {

  constructor(patternImg) {
    this.options = {
      blurSize: 5,
      lapThres: 30,
      eigenThres: 25,
      matchThreshold: 48,
    }
    this.pattern = patternImg // canvas imageData object
    this.processPattern()
  }

  processPattern() {
    const { width, height } = this.pattern
    this.pU8 = new jsfeat.matrix_t(width, height, jsfeat.U8_t | jsfeat.C1_t)
    this.pU8Smooth = new jsfeat.matrix_t(width, height, jsfeat.U8_t | jsfeat.C1_t)
    // we wll limit to 500 strongest points
    this.pDescriptors = new jsfeat.matrix_t(32, 500, jsfeat.U8_t | jsfeat.C1_t)

    jsfeat.imgproc.grayscale(this.pattern.data, 640, 480, this.pU8)
    jsfeat.imgproc.gaussian_blur(this.pU8, this.pU8Smooth, this.options.blurSize)

    this.pCorners = []
    this.pDescriptors = []
    for (var ii = 0; ii < width * height; ii++) {
      this.pCorners[ii] = new jsfeat.keypoint_t(0, 0, 0, 0)
    }

    jsfeat.yape06.laplacian_threshold = this.options.lapThres | 0
    jsfeat.yape06.min_eigen_value_threshold = this.options.eigenThres | 0

    this.pCornerCount = detect_keypoints(this.pU8Smooth, this.pCorners, 500)

    jsfeat.orb.describe(this.pU8Smooth, this.pCorners, this.pCornerCount, this.pDescriptors)

  }

  updatePattern(patternImg) {
    debug('udpate patternImg')
    this.pattern = patternImg
    this.processPattern()
  }

}

