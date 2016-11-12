function projectPoint(x, y, M) {
  var px = M[0] * x + M[1] * y + M[2]
  var py = M[3] * x + M[4] * y + M[5]
  var pz = M[6] * x + M[7] * y + M[8]
  return {
    x: px / pz,
    y: py / pz,
  }
}

(function main() {
  var transMtx = [
    0.9996200799942017, 0.0012999367900192738, -4.761038303375244,
    -0.004846137948334217, 0.999648928642273, -2.3365325927734375,
    -0.000001244177042281, -9.155892257695086, 1,
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

  var target = ctx.createImageData(width, height)
  // ctx.putImageData(imgData, 150, 150)
  let startX = 150, startY = 150
  for (var ii = 0; ii < width * height; ii++) {
    var idx = ii * 4
    var x = ii % width, y = Math.floor(ii / width)
    var newCord = projectPoint(x, y, transMtx)
    var targetIdx = Math.floor(newCord.y) * width + Math.floor(newCord.x + startY) +
      startY * cWidth + startX
    target.data[targetIdx] = imgData.data[idx]
    target.data[targetIdx] = imgData.data[idx + 1]
    target.data[targetIdx] = imgData.data[idx + 2]
    target.data[targetIdx] = imgData.data[idx + 3]
    // debug only
    if (ii < 10) {
      console.log(x, y, newCord.x, newCord.y, 'idx:', idx, targetIdx)
    }
  }
  ctx.putImageData(target, 0, 0)

})()