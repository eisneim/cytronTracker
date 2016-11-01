/* eslint-disable camelcase */
import jsfeat from 'jsfeat'
const debug = require('debug')('cy:plannar')

const MatchT = (function matchType() {
  function MatchT(screenIdx = 0, patternLev = 0, patternIdx = 0, distance = 0) {
    Object.assign(this, { screenIdx, patternLev, patternIdx, distance })
  }
  return MatchT
})()

export default class PlannarTracker {

  constructor(patternImg, ctx) {
    this.ctx = ctx
    this.options = {
      blurSize: 5,
      lapThres: 30,
      eigenThres: 25,
      matchThreshold: 48,
      numTrainLevels: 4,
      fastThreshold: 20,
    }
    this.MARKER_SIZE = 4
    // central difference using image moments to find dominant orientation
    this.uMax = new Int32Array([ 15, 15, 15, 15, 14, 14, 14, 13, 13, 12, 11, 10, 9, 8, 6, 3, 0 ])

    jsfeat.yape06.laplacian_threshold = this.options.lapThres | 0
    jsfeat.yape06.min_eigen_value_threshold = this.options.eigenThres | 0
    jsfeat.fast_corners.set_threshold(this.options.fastThreshold)

    // transform matrix
    this.homo3x3 = new jsfeat.matrix_t(3, 3, jsfeat.F32C1_t)
    this.match_mask = new jsfeat.matrix_t(500, 1, jsfeat.U8C1_t)

    this.pattern = patternImg // canvas imageData object
    this.processPattern()
  }

  icAngle(img, px, py) {
    var half_k = 15 // half patch size
    var m_01 = 0, m_10 = 0
    var src = img.data,
      step = img.cols
    var u = 0,
      v = 0,
      center_off = (py * step + px) | 0
    var v_sum = 0,
      d = 0,
      val_plus = 0,
      val_minus = 0

    // Treat the center line differently, v=0
    for (u = -half_k; u <= half_k; ++u)
      m_10 += u * src[center_off + u]

    // Go line by line in the circular patch
    for (v = 1; v <= half_k; ++v) {
      // Proceed over the two lines
      v_sum = 0
      d = this.uMax[v]
      for (u = -d; u <= d; ++u) {
        val_plus = src[center_off + u + v * step]
        val_minus = src[center_off + u - v * step]
        v_sum += (val_plus - val_minus)
        m_10 += u * (val_plus + val_minus)
      }
      m_01 += v * v_sum
    }

    return Math.atan2(m_01, m_10)
  }

  detect_keypoints(img, corners, maxAllowed) {
    var count = jsfeat.yape06.detect(img, corners, 17) // border
    // var count = jsfeat.fast_corners.detect(img, corners, 3)

    debug('actual keyPoint count:', count)

    // sort by score and reduce the count if needed
    if (count > maxAllowed) {
      jsfeat.math.qsort(corners, 0, count - 1, (a, b) => b.score < a.score)
      count = maxAllowed
    }

    // calculate dominant orientation for each keypoint
    for (var ii = 0; ii < count; ii++) {
      corners[ii].angle = this.icAngle(img, corners[ii].x, corners[ii].y)
    }

    return count
  }

  // estimate homography transform between matched points
  findTransform(matches, count) {
    // motion kernel
    var mm_kernel = jsfeat.motion_model.homography2d()
    // ransac params
    var num_model_points = 4
    var reproj_threshold = 3
    var ransac_param = new jsfeat.ransac_params_t(num_model_points,
        reproj_threshold, 0.5, 0.99)
    var pattern_xy = []
    var screen_xy = []
    // construct correspondences
    for (var i = 0; i < count; ++i) {
      var m = matches[i]
      var s_kp = this.sCorners[m.screenIdx]
      var p_kp = this.pCorners[m.pattern_lev][m.patternIdx]
      pattern_xy[i] = {
        x: p_kp.x,
        y: p_kp.y,
      }
      screen_xy[i] = {
        x: s_kp.x,
        y: s_kp.y,
      }
    }

    // estimate motion
    var ok = false
    ok = jsfeat.motion_estimator.ransac(ransac_param, mm_kernel,
      pattern_xy, screen_xy, count, homo3x3, match_mask, 1000)

    // extract good matches and re-estimate
    var good_cnt = 0
    if (ok) {
      for (let i = 0; i < count; ++i) {
        if (match_mask.data[i]) {
          pattern_xy[good_cnt].x = pattern_xy[i].x
          pattern_xy[good_cnt].y = pattern_xy[i].y
          screen_xy[good_cnt].x = screen_xy[i].x
          screen_xy[good_cnt].y = screen_xy[i].y
          good_cnt++
        }
      }
      // run kernel directly with inliers only
      mm_kernel.run(pattern_xy, screen_xy, homo3x3, good_cnt)
    } else {
      jsfeat.matmath.identity_3x3(homo3x3, 1.0)
    }

    return good_cnt
  }
  // @TODO: recator those steps to become a function shared with tick function.
  processPattern() {
    const { width, height } = this.pattern
    this.pU8 = new jsfeat.matrix_t(width, height, jsfeat.U8_t | jsfeat.C1_t)
    this.pU8Smooth = new jsfeat.matrix_t(width, height, jsfeat.U8_t | jsfeat.C1_t)
    // we wll limit to 500 strongest points
    this.pDescriptors = new jsfeat.matrix_t(32, 500, jsfeat.U8_t | jsfeat.C1_t)

    jsfeat.imgproc.grayscale(this.pattern.data, width, height, this.pU8)
    jsfeat.imgproc.gaussian_blur(this.pU8, this.pU8Smooth, this.options.blurSize)

    // pre allocate for corners
    this.pCorners = []
    for (var ii = 0; ii < width * height; ii++) {
      this.pCorners[ii] = new jsfeat.keypoint_t(0, 0, 0, 0)
    }

    this.pCornerCount = this.detect_keypoints(this.pU8Smooth, this.pCorners, 500)
    debug('pCorners', this.pCornerCount)

    jsfeat.orb.describe(this.pU8Smooth, this.pCorners, this.pCornerCount, this.pDescriptors)
    debug('pDescriptors:', this.pDescriptors)

    // build pyramid
    // for (let leve = 0; leve < this.options.numTrainLevels; lev++) {

    // }
  }

  updatePattern(patternImg) {
    debug('udpate patternImg')
    this.pattern = patternImg
    this.processPattern()
  }

  processFrame(searchImg, trackerData, delayedTrackJob, searchRect) {
    // this.trackerData = trackerData
    // this.searchRect = searchRect
    debug('shoudl process frame', trackerData, delayedTrackJob)
    const { width, height } = searchImg
    this.sU8 = new jsfeat.matrix_t(width, height, jsfeat.U8_t | jsfeat.C1_t)
    this.sU8Smooth = new jsfeat.matrix_t(width, height, jsfeat.U8_t | jsfeat.C1_t)
    // we wll limit to 500 strongest points
    this.sDescriptors = new jsfeat.matrix_t(32, 500, jsfeat.U8_t | jsfeat.C1_t)

    jsfeat.imgproc.grayscale(searchImg.data, width, height, this.sU8)
    jsfeat.imgproc.gaussian_blur(this.sU8, this.sU8Smooth, this.options.blurSize)

    // pre allocate for corners
    this.sCorners = []
    this.matches = []
    for (let ii = 0; ii < width * height; ii++) {
      this.sCorners[ii] = new jsfeat.keypoint_t(0, 0, 0, 0)
    }

    this.sCornerCount = this.detect_keypoints(this.sU8Smooth, this.sCorners, 500)
    // this.drawCorners(this.sCorners, searchRect)
    debug('sCorners', this.sCornerCount)

    jsfeat.orb.describe(this.sU8Smooth, this.sCorners, this.sCornerCount, this.sDescriptors)
    debug('sDescriptors:', this.pDescriptors)

    // now, matching
    this.numMatches = this.matchPattern()
    this.drawMatches(this.matches, searchRect)
    // this.goodMatches = this.findTransform(this.matches, this.numMatches)
    debug('numMatches', this.numMatches, this.matches)
  }

  drawMatches(matches, { minX, minY }) {
    this.ctx.lineWidth = 1
    this.ctx.strokeStyle = 'green'
    for (let ii = 0; ii < this.numMatches; ii++) {
      const { patternIdx } = matches[ii]
      let { x, y } = this.pCorners[patternIdx]
      this.drawMarker(x + minX, y + minY)
    }
  }

  drawCorner(corners, { newMinX, newMinY }) {
    this.ctx.lineWidth = 1
    this.ctx.strokeStyle = 'green'
    debug('drawCorners:', corners, newMinX, newMinY, 'corners[0].x', corners[0].x)
    for (let ii = 0; ii < this.sCornerCount; ii++) {
      let { x, y } = corners[ii]
      this.drawMarker(x + newMinX, y + newMinY)
      // this.drawMarker(corners[ii].x, corners[ii].y)
    }
  }

  drawMarker(x, y) {
    let dist = this.MARKER_SIZE / 2
    this.ctx.beginPath()
    this.ctx.moveTo(x - dist, y - dist)
    this.ctx.lineTo(x + dist, y + dist)
    this.ctx.stroke()
    this.ctx.beginPath()
    this.ctx.moveTo(x + dist, y - dist)
    this.ctx.lineTo(x - dist, y + dist)
    this.ctx.stroke()
  }

  // naive brute-force matching.
  // each on screen point is compared to all pattern points
  // to find the closest match
  matchPattern() {
    let numMatches = 0
    // let queryDu8 = this.sDescriptors.data
    let pdi32 = this.pDescriptors.buffer.i32

    let pdOffset = 0
    let bestDist = 256 // 0x100 => 100000000
    let bestDist2 = 256
    let bestIdx = -1

    for (let ppidx = 0; ppidx < this.pDescriptors.rows; ppidx++) {
      let sdi32 = this.sDescriptors.buffer.i32
      let sdOffset = 0
      for (let sidx = 0; sidx < this.sDescriptors.rows; sidx++) {
        let currentDist = 0
        // our descriptor is 32 bytes so we have 8 Integers
        for (let k = 0; k < 8; k++) {
          currentDist += this.popcnt32(
            sdi32[sdOffset + k] ^ pdi32[pdOffset + k])
        }
        if (currentDist < bestDist) {
          bestDist2 = bestDist
          bestDist = currentDist
          bestIdx = sidx
        } else if (currentDist < bestDist2) {
          bestDist2 = currentDist
        }

        sdOffset += 8// next descriptor
      }
      // filter out by some threshold
      if (bestDist < this.options.matchThreshold) {
        let mm = this.matches[numMatches] = new MatchT()
        mm.screenIdx = bestIdx
        mm.patternIdx = ppidx
        numMatches++
      }
      pdOffset += 8
    }
    return numMatches
  }
  // non zero bits count
  popcnt32(n) {
    //1010101010101010101010101010101 try to get it's ?
    n -= ((n >> 1) & 0x55555555)
    // 0x33 = 00110011
    n = (n & 0x33333333) + ((n >> 2) & 0x33333333)
    // 0x1010101 = 1000000010000000100000001
    return (((n + (n >> 4)) & 0xF0F0F0F) * 0x1010101) >> 24
  }
  //http://stackoverflow.com/questions/10874012/how-does-this-bit-manipulation-work-in-java/10874449#10874449
  //https://yesteapea.wordpress.com/2013/03/03/counting-the-number-of-set-bits-in-an-integer/
  numberOfSetBits64(i) {
    i = i - ((i >> 1) & 0x5555555555555555)
    i = (i & 0x3333333333333333) +
        ((i >> 2) & 0x3333333333333333)
    i = ((i + (i >> 4)) & 0x0F0F0F0F0F0F0F0F)
    return (i * (0x0101010101010101)) >> 56
  }
  //for 32 bit integers
  numberOfSetBits32(i) {
    i = i - ((i >> 1) & 0x55555555)
    i = (i & 0x33333333) + ((i >> 2) & 0x33333333)
    i = ((i + (i >> 4)) & 0x0F0F0F0F)
    return (i * (0x01010101)) >> 24
  }
}

