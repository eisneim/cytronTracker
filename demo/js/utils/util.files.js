/* eslint-disable func-names */

export function remoteToDataUrl(url, callback) {
  let xhr = new XMLHttpRequest()
  xhr.responseType = 'blob'
  xhr.onload = () => {
    let reader = new FileReader()
    reader.onloadend = () => {
      callback(reader.result)
    }
    reader.readAsDataURL(xhr.response)
  }
  xhr.open('GET', url)
  xhr.send()
}

/**
 * Supported input formats: image/png, image/jpeg, image/jpg, image/gif, image/bmp, image/tiff, image/x-icon, image/svg+xml, image/webp, image/xxx
 * @param  {string}   src          .
 * @param  {Function} callback     .
 * @param  {Object}   options image/png, image/jpeg, image/webp
 * @return {string}                .
 */
export function canvasToDataUrl(src, callback, { outputFormat, maxWidth } = options) {
  if (!outputFormat) outputFormat = 'image/jpeg'
  var img = new Image()
  img.crossOrigin = 'Anonymous'
  img.onload = () => {
    var canvas = document.createElement('CANVAS')
    var ctx = canvas.getContext('2d')
    var dataURL
    canvas.height = this.height
    canvas.width = this.width
    if (!maxWidth) {
      ctx.drawImage(this, 0, 0)
    } else {
      let ratio = this.width / this.height
      let w, h
      if (ratio > 1) {
        w = maxWidth
        h = maxWidth / ratio
      } else {
        h = maxWidth
        w = ratio * maxWidth
      }

      ctx.drawImage(this, 0, 0, w, h)
    }

    dataURL = canvas.toDataURL(outputFormat)
    callback(dataURL, img)
  }
  img.src = src
  if (img.complete || img.complete === undefined) {
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
    img.src = src
  }
}

export function fileToDataUrl(file, callback, createImage) {
  let reader = new FileReader()
  reader.addEventListener('load', function() {
    if (!createImage) {
      callback(this.result)
    } else {
      let img = new Image()
      img.onload = () => {
        callback(this.result, img)
      }
      img.src = this.result
    }
  }, false)
  reader.readAsDataURL(file)
}
