export function add(mat1, mat2) {
  if (mat1.length !== mat2.length || mat1[0].length !== mat2[0].length)
    throw new Error('mat1 and mat2 should have same width and height')

  let out = []
  for (let ii = 0; ii < mat1.length; ii++) {
    if (!out[ii]) out[ii] = []
    for (let jj = 0; jj < mat1[0].length; jj++) {
      out[ii][jj] = Math.floor(mat1[ii][jj] + mat2[ii][jj])
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

// http://math.stackexchange.com/questions/296794/finding-the-transform-matrix-from-4-projected-points-with-javascript
// http://math.stackexchange.com/questions/494238/how-to-compute-homography-matrix-h-from-corresponding-points-2d-2d-planar-homog
// code is modified from jsfeat
export function findHomography(srcX0, srcY0, dstX0, dstY0,
  srcX1, srcY1, dstX1, dstY1,
  srcX2, srcY2, dstX2, dstY2,
  srcX3, srcY3, dstX3, dstY3) {
  var t1 = srcX0
  var t2 = srcX2
  var t4 = srcY1
  var t5 = t1 * t2 * t4
  var t6 = srcY3
  var t7 = t1 * t6
  var t8 = t2 * t7
  var t9 = srcY2
  var t10 = t1 * t9
  var t11 = srcX1
  var t14 = srcY0
  var t15 = srcX3
  var t16 = t14 * t15
  var t18 = t16 * t11
  var t20 = t15 * t11 * t9
  var t21 = t15 * t4
  var t24 = t15 * t9
  var t25 = t2 * t4
  var t26 = t6 * t2
  var t27 = t6 * t11
  var t28 = t9 * t11
  var t30 = 1.0 / (t21 - t24 - t25 + t26 - t27 + t28)
  var t32 = t1 * t15
  var t35 = t14 * t11
  var t41 = t4 * t1
  var t42 = t6 * t41
  var t43 = t14 * t2
  var t46 = t16 * t9
  var t48 = t14 * t9 * t11
  var t51 = t4 * t6 * t2
  var t55 = t6 * t14
  var Hr0 = -(t8 - t5 + t10 * t11 - t11 * t7 - t16 * t2 + t18 - t20 + t21 * t2) * t30
  var Hr1 = (t5 - t8 - t32 * t4 + t32 * t9 + t18 - t2 * t35 + t27 * t2 - t20) * t30
  var Hr2 = t1
  var Hr3 = (-t9 * t7 + t42 + t43 * t4 - t16 * t4 + t46 - t48 + t27 * t9 - t51) * t30
  var Hr4 = (-t42 + t41 * t9 - t55 * t2 + t46 - t48 + t55 * t11 + t51 - t21 * t9) * t30
  var Hr5 = t14
  var Hr6 = (-t10 + t41 + t43 - t35 + t24 - t21 - t26 + t27) * t30
  var Hr7 = (-t7 + t10 + t16 - t43 + t27 - t28 - t21 + t25) * t30

  t1 = dstX0
  t2 = dstX2
  t4 = dstY1
  t5 = t1 * t2 * t4
  t6 = dstY3
  t7 = t1 * t6
  t8 = t2 * t7
  t9 = dstY2
  t10 = t1 * t9
  t11 = dstX1
  t14 = dstY0
  t15 = dstX3
  t16 = t14 * t15
  t18 = t16 * t11
  t20 = t15 * t11 * t9
  t21 = t15 * t4
  t24 = t15 * t9
  t25 = t2 * t4
  t26 = t6 * t2
  t27 = t6 * t11
  t28 = t9 * t11
  t30 = 1.0 / (t21 - t24 - t25 + t26 - t27 + t28)
  t32 = t1 * t15
  t35 = t14 * t11
  t41 = t4 * t1
  t42 = t6 * t41
  t43 = t14 * t2
  t46 = t16 * t9
  t48 = t14 * t9 * t11
  t51 = t4 * t6 * t2
  t55 = t6 * t14
  var Hl0 = -(t8 - t5 + t10 * t11 - t11 * t7 - t16 * t2 + t18 - t20 + t21 * t2) * t30
  var Hl1 = (t5 - t8 - t32 * t4 + t32 * t9 + t18 - t2 * t35 + t27 * t2 - t20) * t30
  var Hl2 = t1
  var Hl3 = (-t9 * t7 + t42 + t43 * t4 - t16 * t4 + t46 - t48 + t27 * t9 - t51) * t30
  var Hl4 = (-t42 + t41 * t9 - t55 * t2 + t46 - t48 + t55 * t11 + t51 - t21 * t9) * t30
  var Hl5 = t14
  var Hl6 = (-t10 + t41 + t43 - t35 + t24 - t21 - t26 + t27) * t30
  var Hl7 = (-t7 + t10 + t16 - t43 + t27 - t28 - t21 + t25) * t30

  // the following code computes R = Hl * inverse Hr
  t2 = Hr4 - Hr7 * Hr5
  t4 = Hr0 * Hr4
  t5 = Hr0 * Hr5
  t7 = Hr3 * Hr1
  t8 = Hr2 * Hr3
  t10 = Hr1 * Hr6
  var t12 = Hr2 * Hr6
  t15 = 1.0 / (t4 - t5 * Hr7 - t7 + t8 * Hr7 + t10 * Hr5 - t12 * Hr4)
  t18 = -Hr3 + Hr5 * Hr6
  var t23 = -Hr3 * Hr7 + Hr4 * Hr6
  t28 = -Hr1 + Hr2 * Hr7
  var t31 = Hr0 - t12
  t35 = Hr0 * Hr7 - t10
  t41 = -Hr1 * Hr5 + Hr2 * Hr4
  var t44 = t5 - t8
  var t47 = t4 - t7
  t48 = t2 * t15
  var t49 = t28 * t15
  var t50 = t41 * t15
  var mat = []
  mat[0] = Hl0 * t48 + Hl1 * (t18 * t15) - Hl2 * (t23 * t15)
  mat[1] = Hl0 * t49 + Hl1 * (t31 * t15) - Hl2 * (t35 * t15)
  mat[2] = -Hl0 * t50 - Hl1 * (t44 * t15) + Hl2 * (t47 * t15)
  mat[3] = Hl3 * t48 + Hl4 * (t18 * t15) - Hl5 * (t23 * t15)
  mat[4] = Hl3 * t49 + Hl4 * (t31 * t15) - Hl5 * (t35 * t15)
  mat[5] = -Hl3 * t50 - Hl4 * (t44 * t15) + Hl5 * (t47 * t15)
  mat[6] = Hl6 * t48 + Hl7 * (t18 * t15) - t23 * t15
  mat[7] = Hl6 * t49 + Hl7 * (t31 * t15) - t35 * t15
  mat[8] = -Hl6 * t50 - Hl7 * (t44 * t15) + t47 * t15
  return mat
}

export function adjoint3x3(M) {
  let m11 = M[4] * M[8] - M[7] * M[5]
  let m12 = M[3] * M[8] - M[6] * M[5]
  let m13 = M[3] * M[7] - M[6] * M[4]
  let m21 = M[1] * M[8] - M[7] * M[2]
  let m22 = M[0] * M[8] - M[6] * M[2]
  let m23 = M[0] * M[7] - M[6] * M[1]
  let m31 = M[1] * M[5] - M[4] * M[2]
  let m32 = M[0] * M[5] - M[3] * M[2]
  let m33 = M[0] * M[4] - M[3] * M[1]

  return [
    m11, -1 * m21, m31,
    -1 * m12, m22, -1 * m32,
    m13, -1 * m23, m33,
  ]
}

export function inverse3x3(M) {
  let adjoint = adjoint3x3(M)
  let determinant = M[0] * M[4] * M[8] + M[1] * M[5] * M[6] + M[2] * M[3] * M[7] -
    M[0] * M[7] * M[5] - M[1] * M[3] * M[8] - M[2] * M[4] * M[6]
  // console.log('adjoint', adjoint)
  // console.log('determinant', determinant)
  let inverse = []
  // TypedArray don't have Array.prototype.map function
  for (let ii = 0; ii < adjoint.length; ii++) {
    inverse[ii] = adjoint[ii] / determinant
  }
  return inverse
}

export function projectPoint(x, y, M) {
  var px = M[0] * x + M[1] * y + M[2]
  var py = M[3] * x + M[4] * y + M[5]
  var pz = M[6] * x + M[7] * y + M[8]
  return {
    x: px / pz,
    y: py / pz,
  }
}

// use the reversed projectiveMatrix to project from dest to src
// and read rgba from source and do some interpulation
export function wrapPerspective(src, dst, mtx, startX, startY, fill) {
  if (fill) {
    //@TODO: side effects, should not polute source image
    for (let ee = 3; ee < src.data.length; ee += 4) {
      if (src.data[ee] === 0) {
        src.data[ee - 3] = fill[0]
        src.data[ee - 2] = fill[1]
        src.data[ee - 1] = fill[2]
      }
    }
  }
  let inverseMtx = inverse3x3(mtx)
  let sWidth = src.width, sHeight = src.height
  let dWidth = dst.width, dHeight = dst.height

  for (let y = -startY; y < dHeight - startY; y++) {
    for (let x = -startX; x < dWidth - startX; x++) {
      let destIdx = (x + startX + (y + startY) * dWidth) * 4
      let newCord = projectPoint(x, y, inverseMtx)
      // decimal number
      let dx = newCord.x % 1,
        dy = newCord.y % 1

      let sx = Math.floor(newCord.x),
        sy = Math.floor(newCord.y)

      if (dx < 0) dx = 1 - dx
      if (dy < 0) dx = 1 - dy

      let srcIdx = (sx + sy * sWidth) * 4
      // out of srouce image, do nothing
      if (sx < 0 || sy < 0 || sx > sWidth || sy > sHeight)
        continue

      // interpulation
      /*
        @TODO: currently write this code for readablility, but it definitely
        needs refactor
       */
      // -------------- Math.floor -------------------
      // for (var jj = 0; jj < 4; jj++) {
      //   dst.data[destIdx + jj] = src.data[srcIdx + jj]
      // }
      // continue
      // -------------- NEAREST NEIGHBOR INTERPOLATION -------------------
      // var interpIdx = srcIdx
      // if (dx < 0.5 && dy > 0.5) {
      //   interpIdx = srcIdx + sWidth * 4
      // } else if (dx > 0.5 && dy > 0.5) {
      //   interpIdx = srcIdx + sWidth * 4 + 4
      // } else if (dx > 0.5 && dy < 0.5){
      //   interpIdx = srcIdx + 4
      // }
      // for (let jj = 0; jj < 4; jj++) {
      //   dst.data[destIdx + jj] = src.data[interpIdx + jj]
      // }
      // continue

      // ---------------- BILINEAR INTERPOLATION -----------------
      let interpx1 = [], interpx2 = []
      for (let aa = 0; aa < 4; aa++) { // top left -> right
        interpx1[aa] = src.data[srcIdx + aa] * (1 - dx) + dx * src.data[srcIdx + 4 + aa]
      }
      let nextRowOffset = sWidth * 4
      for (let bb = 0; bb < 4; bb++) { // bottom left -> right
        interpx2[bb] = src.data[srcIdx + nextRowOffset + bb] * (1 - dx) + dx * src.data[srcIdx + 4 + nextRowOffset + bb]
      }

      // y direction interpulation
      for (let ii = 0; ii < 4; ii++) { // top -> bottom
        dst.data[destIdx + ii] = interpx1[ii] * (1 - dy) + dy * interpx2[ii]
      }

    } // end of x loop
  } // end of y loop
}

