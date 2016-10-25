
/**
 * @param {ImageData} imageObj canvas image data type
 * @return {Array} grayImage
 */
export function rgba2gray(imageObj) {
  var data = imageObj.data
  const gray = [] // [ row[] row[] ]

  let index = 0
  const w = imageObj.width, h = imageObj.height
  for (let ii = 0; ii < h; ii++) {
    let row = gray[ii] = []
    for (let jj = 0; jj < w; jj++) {
      row[jj] = 0.3 * data[index] + 0.59 * data[index + 1] + 0.11 * data[index + 2]
      index += 4
    }
  }
  return gray
}

export function gray2rgba() {

}