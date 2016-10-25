import { expect } from 'chai'
import * as imageProc from './imageProc'

describe('Image Process function', () => {
  describe('rgba2gray', () => {
    let imageData = {
      width: 2,
      height: 2,
      data: [ 0, 200, 100, 255, 0, 200, 100, 255,
              100, 20, 50, 255, 100, 20, 50, 255 ],
    }
    it('converts rgba value to grayscale image array', () => {
      let result = imageProc.rgba2gray(imageData)
      expect(result).to.have.length(2)
      expect(result[0]).to.have.length(2)
    })
  })

})

