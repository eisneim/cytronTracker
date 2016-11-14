function adjoint3x3(M) {
  var mtx = [
    M[0], -1 * M[3], M[6],
    -1 * M[1], M[4], -1 * M[7],
    M[2], -1 * M[5], M[8],
  ]
  return mtx
}

function inverse3x3(M) {
  var adjoint = adjoint3x3(M)
  var determinant = M[0] * M[4] * M[8] + M[1] * M[5] * M[6] + M[2] * M[3] * M[7] -
    M[0] * M[7] * M[5] - M[1] * M[3] * M[8] - M[2] * M[4] * M[6]
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

function wrapPerspective(src, dst, transform) {

}

(function main() {
  var transMtx = [
    1.0367709398269653, 0.1499483436346054, -32.1998176574707,
    -0.13930697739124298, 1.0074559450149536, 72.36528015136719,
    0.000024043956727837, -0.000030544739274, 1,
  ]

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

  for (var ii = 0; ii < width * height; ii++) {
    var x = ii % width, y = Math.floor(ii / width)
    var newCord = projectPoint(x, y, transMtx)
    var targetX = Math.round(newCord.x) + startX
    var targetY = Math.round(newCord.y) + startY
    var targetIdx = (targetX + targetY * cWidth) * 4
    var idx = ii * 4
    target.data[targetIdx] = imgData.data[idx]
    target.data[targetIdx + 1] = imgData.data[idx + 1]
    target.data[targetIdx + 2] = imgData.data[idx + 2]
    target.data[targetIdx + 3] = imgData.data[idx + 3]
  }

  // ctx.putImageData(imgData, 0, 0)
  ctx.putImageData(target, 0, 0)

})()