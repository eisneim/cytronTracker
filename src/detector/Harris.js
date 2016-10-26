
import {
  Sobel,
  zeros,
  gaussianFilter,
  threshold,
  thresholdType,
  nonMaxSupression,
} from '../utils/imageProc'
import { multiple } from '../utils/matrix'

/**
 * in a window w(u,v) calculate it's averaging derivative
 *     | Ix^2  IxIy |     | A D |
 * A = | IxIy  Iy^2 |  =  | C B |
 * R = (AB - CD)^2 - k(A + B)^2
 *   xx*yy - xy*xy - kp*(xx + yy)^2
 * @param {Array} imgArr .
 * @param {int} kernelSize .
 * @param {int} kp .
 * @param {int} minH .
 * @return {Array} .
 */
export default function HarrisCorner(imgArr, kernelSize = 7, kp = 0.0008, minH = 10000) {
  const h = imgArr.length, w = imgArr[0].length
  let dx = Sobel(imgArr, 'x'),
    dy = Sobel(imgArr, 'y')

  let dxdx = gaussianFilter(multiple(dx, dx))
  let dydy = gaussianFilter(multiple(dy, dy))
  let dxdy = gaussianFilter(multiple(dx, dy))

  let H = zeros(w, h)
  for (var ii = 0; ii < h; ii++) {
    for (var jj = 0; jj < w; jj++) {
      let xx = dxdx[ii][jj],
        yy = dydy[ii][jj],
        xy = dxdy[ii][jj]
      H[ii][jj] = (xx * yy - xy * xy) * (xx * yy - xy * xy) -
        kp * (xx + xy) * (xx + xy)
    }
  }
  H = threshold(H, minH, 255, thresholdType.TO_ZERO)
  return nonMaxSupression(H, kernelSize, true, 255)
}