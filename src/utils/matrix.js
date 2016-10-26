export function add(mat1, mat2) {
  if (mat1.length !== mat2.length || mat1[0].length !== mat2[0].length)
    throw new Error('mat1 and mat2 should have same width and height')

  let out = []
  for (let ii = 0; ii < mat1.length; ii++) {
    if (!out[ii]) out[ii] = []
    for (let jj = 0; jj < mat1[0].length; jj++) {
      out[ii][jj] = mat1[ii][jj] + mat2[ii][jj]
    }
  }
  return out
}

export function multiple(mat1, mat2) {
  let out = []
  for (let ii = 0; ii < mat1.length; ii++) {
    if (!out[ii]) out[ii] = []
    for (let jj = 0; jj < mat1[0].length; jj++) {
      out[ii][jj] = mat1[ii][jj] * (Array.isArray(mat2) ? mat2[ii][jj] : mat2)
    }
  }
  return out
}
