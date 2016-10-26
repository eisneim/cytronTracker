import { expect } from 'chai'
import * as imageProc from './imageProc'

describe('Image Process function', () => {
  let imageObj = {
    width: 2,
    height: 2,
    data: [ 0, 200, 100, 255, 0, 200, 100, 255,
            100, 20, 50, 255, 100, 20, 50, 255 ],
  }
  describe('rgba2gray', () => {

    it('converts rgba value to grayscale image array', () => {
      let result = imageProc.rgba2gray(imageObj)
      expect(result).to.have.length(2)
      expect(result[0]).to.have.length(2)
    })
  })
  describe('gray2rgba', () => {
    it('converts grayScale value back to rgba value, but each', () => {
      let gray = imageProc.rgba2gray(imageObj)
      let rgba = imageProc.gray2rgba(gray)
      expect(rgba).to.have.length(gray.length * gray[0].length * 4)
    })
  })

  it('createMat() should create uniformed value matrix', () => {
    let zeros = imageProc.createMat(2, 3, 0)
    expect(zeros).to.have.length(3)
    expect(zeros[0].length).to.equal(2)
    expect(zeros[0][0]).to.equal(0)
  })
  it('threshold() should can remove high value', () => {
    const { threshold, thresholdType } = imageProc
    let gray = [[ 129, 129 ], [ 47.3, 47.3 ]]
    // console.log('gray: ', gray)
    var threshed = threshold(gray, 100, 200, thresholdType.TO_ZERO)
    // console.log('threshed', threshed)
    expect(threshed[0][0]).to.equal(129)
    expect(threshed[1][0]).to.equal(0)
  })
  describe('Sobel() filter', () => {
    let imgOnes = [
      [ 100, 1, 1, 1, 100 ],
      [ 100, 1, 1, 1, 100 ],
      [ 100, 1, 1, 1, 100 ],
      [ 100, 1, 1, 1, 100 ],
      [ 100, 1, 1, 1, 100 ],
    ]
    it('find image edge', () => {
      let dx = imageProc.Sobel(imgOnes, 'x')
      //console.log(dx)
      expect(dx[1][0] - dx[1][1]).above(100 - 1)
      let dy = imageProc.Sobel(imgOnes, 'y')
      // console.log(dy) // should not have much on y direction
      expect(dy[1][0] - dy[1][1]).to.equal(0)
      expect(dy[1][0] - dy[2][0]).to.equal(0)
    })
  })

  describe('gaussianFilter()', () => {
    let img = [
      [ 0, 0, 0, 0 ],
      [ 0, 150, 150, 0 ],
      [ 0, 150, 150, 0 ],
      [ 0, 0, 0, 0 ],
    ]
    it('blurs out an image', () => {
      let result = imageProc.gaussianFilter(img)
      // console.log(result)
      // [[0, 0, 0, 0], [0, 84.375, 84.375, 0], [0, 84.375, 84.375, 0], [0, 0, 0, 0]]
      expect(result[1][1]).to.below(150)
    })
  })

  it('nonMaxSupression() find local maxium value', () => {
    let matrix = [
      [ 1, 200, 1, 1, 1, 20 ],
      [ 1, 100, 1, 1, 1, 20 ],
      [ 1, 100, 300, 1, 1, 30 ],
      [ 1, 100, 1, 1, 1, 30 ],
      [ 1, 100, 1, 1, 1, 30 ],
      [ 1, 100, 1, 1, 1, 30 ],
    ]
    let result = imageProc.nonMaxSupression(matrix, 4, true, 255)
    // console.log(result)
    expect(result[2][2]).to.equal(255)
    expect(result[1][1]).to.equal(0)
  })
})

