function adjoint3x3(M) {
  var m11 = M[4] * M[8] - M[7] * M[5]
  var m12 = M[3] * M[8] - M[6] * M[5]
  var m13 = M[3] * M[7] - M[6] * M[4]
  var m21 = M[1] * M[8] - M[7] * M[2]
  var m22 = M[0] * M[8] - M[6] * M[2]
  var m23 = M[0] * M[7] - M[6] * M[1]
  var m31 = M[1] * M[5] - M[4] * M[2]
  var m32 = M[0] * M[5] - M[3] * M[2]
  var m33 = M[0] * M[4] - M[3] * M[1]

  return [
    m11, -1 * m21, m31,
    -1 * m12, m22, -1 * m32,
    m13, -1 * m23, m33,
  ]
}

function inverse3x3(M) {
  var adjoint = adjoint3x3(M)
  var determinant = M[0] * M[4] * M[8] + M[1] * M[5] * M[6] + M[2] * M[3] * M[7] -
    M[0] * M[7] * M[5] - M[1] * M[3] * M[8] - M[2] * M[4] * M[6]
  // console.log('adjoint', adjoint)
  // console.log('determinant', determinant)
  var inverse = []
  // TypedArray don't have Array.prototype.map function
  for (var ii = 0; ii < adjoint.length; ii++) {
    inverse[ii] = adjoint[ii] / determinant
  }
  return inverse
}

function projectPoint(x, y, M) {
  var px = M[0] * x + M[1] * y + M[2]
  var py = M[3] * x + M[4] * y + M[5]
  var pz = M[6] * x + M[7] * y + M[8]
  return {
    x: px / pz,
    y: py / pz,
  }
}

function set4chanel(dist, dIdx, src, sIdx) {
  dist[dIdx] = src[sIdx]
  dist[dIdx + 1] = src[sIdx + 1]
  dist[dIdx + 2] = src[sIdx + 2]
  dist[dIdx + 3] = src[sIdx + 3]
}


// use the reversed projectiveMatrix to project from dest to src
// and read rgba from source and do some interpulation
function wrapPerspective(src, dst, mtx, startX, startY, fill) {
  if (fill) {
    for (var ee = 3; ee < src.data.length; ee += 4) {
      if (src.data[ee] === 0) {
        src.data[ee - 3] = fill[0]
        src.data[ee - 2] = fill[1]
        src.data[ee - 1] = fill[2]
      }
    }
  }
  var inverseMtx = inverse3x3(mtx)
  console.log('inverseMtx:', inverseMtx, 'origin:', mtx)
  var sWidth = src.width, sHeight = src.height
  var dWidth = dst.width, dHeight = dst.height

  for (var y = -startY; y < dHeight - startY; y++ ) {
    for (var x = -startX; x < dWidth - startX; x++) {
      var destIdx = (x + startX + (y + startY) * dWidth) * 4
      var newCord = projectPoint(x, y, inverseMtx)

      var dx = newCord.x % 1,
        dy = newCord.y % 1

      var sx = Math.floor(newCord.x),
        sy = Math.floor(newCord.y)

      if (dx < 0) dx = 1 - dx
      if (dy < 0) dx = 1 - dy

      var srcIdx = (sx + sy * sWidth) * 4
      // var srcIdx = (Math.round(newCord.x) + (Math.round(newCord.y)) * sWidth) * 4
      // if (x > 15 && x < 20) console.log(srcIdx, dx, dy, newCord, x, y)
      // out of srouce image, do nothing
      if (sx < 0 || sy < 0 || sx > sWidth || sy > sHeight)
        continue

      if (dx === 0 && dy === 0) {
        console.log('dx, dy=0', sx, sy, x, y)
        set4chanel(dst.data, destIdx, src.data, srcIdx)
      } else { // interpulation
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
        // for (var jj = 0; jj < 4; jj++) {
        //   dst.data[destIdx + jj] = src.data[interpIdx + jj]
        // }
        // continue

        // ---------------- BILINEAR INTERPOLATION -----------------
        var interpx1 = [], interpx2 = []
        for (var aa = 0; aa < 4; aa++) { // top left -> right
          interpx1[aa] = src.data[srcIdx + aa] * (1 - dx) + dx * src.data[srcIdx + 4 + aa]
        }
        var nextRowOffset = sWidth * 4
        for (var bb = 0; bb < 4; bb++) { // bottom left -> right
          interpx2[bb] = src.data[srcIdx + nextRowOffset + bb] * (1 - dx) + dx * src.data[srcIdx + 4 + nextRowOffset + bb]
        }

        // y direction interpulation
        for (var ii = 0; ii < 4; ii++) { // top -> bottom
          dst.data[destIdx + ii] = interpx1[ii] * (1 - dy) + dy * interpx2[ii]
        }

        // debug
        if (sx > 50 && sx < 52 && sy > 50 && sy < 52) {
          console.log('x, y', x, y, sx, sy, 'dx, dy', dx, dy)
          console.log(interpx1, interpx2)
          console.log('source R:', src.data[srcIdx], src.data[srcIdx + 4], src.data[srcIdx + sWidth], src.data[srcIdx + sWidth + 4])
          console.log('resault R:', interpx1[0] * dy + (1 - dy) * interpx2[0])
          console.log('------------')
        }
      }

    } // end of x loop
  } // end of y loop
}

(function main() {
  var transMtx = [
    1.0367709398269653, 0.1499483436346054, -32.1998176574707,
    -0.13930697739124298, 1.0074559450149536, 72.36528015136719,
    0.000024043956727837, -0.000030544739274, 1,
  ]
  var startTime = Date.now()

  var $canvas = document.getElementById('canvas'),
    $img = document.getElementById('srcImg')

  var ctx = $canvas.getContext('2d')
  var cWidth = cHeight = 500
  var width = $img.width, height = $img.height
  console.log('img width and height:', width, height)
  ctx.drawImage($img, 0, 0)
  var imgData = ctx.getImageData(0, 0, width, height)
  ctx.clearRect(0, 0, width, height)
  // --------------- done with setting up ImageData ---------

  var target = ctx.createImageData(cWidth, cHeight)
  // ctx.putImageData(imgData, 150, 150)
  let startX = 150, startY = 150

  // for (var ii = 0; ii < width * height; ii++) {
  //   var x = ii % width, y = Math.floor(ii / width)
  //   var newCord = projectPoint(x, y, transMtx)
  //   var targetX = Math.round(newCord.x) + startX
  //   var targetY = Math.round(newCord.y) + startY
  //   var targetIdx = (targetX + targetY * cWidth) * 4
  //   var idx = ii * 4
  //   target.data[targetIdx] = imgData.data[idx]
  //   target.data[targetIdx + 1] = imgData.data[idx + 1]
  //   target.data[targetIdx + 2] = imgData.data[idx + 2]
  //   target.data[targetIdx + 3] = imgData.data[idx + 3]
  // }

  wrapPerspective(imgData, target, transMtx, startX, startY, [60, 180, 113])

  ctx.putImageData(target, 0, 0)
  console.log('costTime:', Date.now() - startTime)
})()