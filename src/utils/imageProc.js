
/**
 * @param {ImageData} imageObj canvas image data type
 * @return {Array} grayImage
 */
export function rgba2gray(imageObj) {
  var data = imageObj.data
  const gray = [] // [ row[] row[] ]

  let index = 0
  for (let ii = 0; ii < imageObj.height; ii++) {
    let row = gray[ii] = []
    for (let jj = 0; jj < imageObj.width; jj++) {
      row[jj] = 0.3 * data[index] + 0.59 * data[index + 1] + 0.11 * data[index + 2]
      index += 4
    }
  }
  return gray
}

export function gray2rgba(grayImgArray) {
  let data = []
  let index = 0
  for (var ii = 0; ii < grayImgArray.length; ii++) {
    let row = grayImgArray[ii]
    for (var jj = 0; jj < row.length; jj++) {
      data[index] = row[jj]
      data[index + 1] = row[jj]
      data[index + 2] = row[jj]
      data[index + 3] = 255
      index += 4
    }
  }
  return data
}

export function createMat(w, h, value) {
  if (!w || !h) throw new Error(`invalid width or height: ${w} ${h}`)
  let out = []
  for (var ii = 0; ii < h; ii++) {
    if (!out[ii]) out[ii] = []
    for (var jj = 0; jj < w; jj++) {
      out[ii][jj] = value
    }
  }
  return out
}

export function zeros(w, h) {
  return createMat(w, h, 0)
}

export const thresholdType = {
  TO_ZERO: 0,
  BINARY: 1,
}

export function threshold(gray, value, maxValue, type) {
  let h = gray.length, w = gray[0].length
  let out = zeros(w, h)
  for (var ii = 0; ii < h; ii++) {
    for (var jj = 0; jj < w; jj++) {
      if (type === thresholdType.TO_ZERO) {
        // thresh smaller value to zero, keep higher values
        if (gray[ii][jj] > value)
          out[ii][jj] = gray[ii][jj]
      } else if (type === thresholdType.BINARY) {
        // only keep maxValue, others will be zero, uniform to just one value
        if (gray[ii][jj] > value)
          out[ii][jj] = maxValue
      }
    }
  }
  return out
}
/**
 * https://en.wikipedia.org/wiki/Sobel_operator
 *  edge detection algorithms where it creates an image emphasising edges
 *       | -1  0  1 |     1
 * Gx =  | -2  0  2 |  =  2  * [-1 0 1]    this is for derivative of x direction
 *       | -1  0  1 |     1
 *
 *       |  1  2   1|     1
 * Gy =  |  0  0   0|  =  0  * [1 2 1]    this is for derivative of x direction
 *       | -1 -2  -1|    -1
 *
 * Gradient magnitude G = sqr(Gx^2 + Gy^2)
 * gradient direction: theta = atan(Gy / Gx)  (vertical edge theta = 0)
 * @param {Array} imgArr .
 * @param {int} dx .
 * @param {int} dy .
 * @return {ImageArray} .
 */
export function Sobel(imgArr, direction = 'X') {
  const h = imgArr.length, w = imgArr[0].length
  let out = zeros(w, h)
  // first calculate Gx
  if (direction === 'x') {
    // first loop we going to mutilply 1x3 mat,  [1 / 2 / 1]
    for (var ii = 1; ii < h - 1; ii++) { // be careful with "boundry issue"
      for (var jj = 0; jj < w; jj++) {
        out[ii][jj] = imgArr[ii - 1][jj] + imgArr[ii][jj] * 2 + imgArr[ii + 1][jj]
      }
    }
    // second loop: get convolution with [-1 0 1]
    for (let aa = 0; aa < h; aa++) {
      for (let bb = 1; bb < w - 1; bb++) {
        out[aa][bb] = -1 * imgArr[aa][bb - 1] + imgArr[aa][bb + 1]
      }
    }
  } else {
    // for y direction, first convolute with: [1 2 1]
    for (let aa = 0; aa < h; aa++) {
      for (let bb = 1; bb < w - 1; bb++) {
        out[aa][bb] = imgArr[aa][bb - 1] + 2 * imgArr[aa][bb] + imgArr[aa][bb + 1]
      }
    }
    // then [1 / 0 / -1]
    for (let ii = 1; ii < h - 1; ii++) { // be careful with "boundry issue"
      for (let jj = 0; jj < w; jj++) {
        out[ii][jj] = imgArr[ii - 1][jj] - imgArr[ii + 1][jj]
      }
    }
  } // end if else
  return out
}

