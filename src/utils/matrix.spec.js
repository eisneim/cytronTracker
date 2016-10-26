import { expect } from 'chai'
import * as Mat from './matrix'

describe('matrix utils', () => {
  let mat1 = [
    [ 1, 1, 1 ],
    [ 1, 1, 1 ],
  ]
  let mat2 = [
    [ 2, 2, 2 ],
    [ 2, 2, 2 ],
  ]
  it('add() two mat', () => {
    let result = Mat.add(mat1, mat2)
    expect(result).to.have.length(2)
    expect(result[0][0]).to.equal(3)
    expect(result[1][2]).to.equal(3)
  })

  it('multiple() tow mat', () => {
    let result = Mat.multiple(mat1, mat2)
    expect(result[0][0]).to.equal(2)
  })

  it('multiple() a number', () => {
    let result = Mat.multiple(mat1, 3)
    expect(result[0][0]).to.equal(3)
  })
})