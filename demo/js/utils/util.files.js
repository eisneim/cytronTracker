/* eslint-disable func-names */

export function remoteToDataUrl(url, callback) {
  try {
    let xhr = new XMLHttpRequest()
    xhr.responseType = 'blob'
    xhr.onload = () => {
      let reader = new FileReader()
      reader.onloadend = () => {
        callback(null, reader.result)
      }
      reader.readAsDataURL(xhr.response)
    }
    xhr.open('GET', url)
    xhr.send()
  } catch (e) {
    callback(e)
  }

}

/**
 * Supported input formats: image/png, image/jpeg, image/jpg, image/gif, image/bmp, image/tiff, image/x-icon, image/svg+xml, image/webp, image/xxx
 * @param  {string}   src          .
 * @param  {Function} callback     .
 * @param  {Object}   options image/png, image/jpeg, image/webp
 * @return {string}                .
 */
export function canvasToDataUrl(src, callback, options = {}) {
  let { outputFormat, maxWidth } = options
  if (!outputFormat) outputFormat = 'image/png'
  let img = new Image()
  // let img = document.createElement('img')
  img.crossOrigin = 'Anonymous'
  img.onload = () => {
    let canvas = document.createElement('CANVAS')
    let ctx = canvas.getContext('2d')
    let dataURL
    canvas.height = img.height
    canvas.width = img.width
    if (!maxWidth) {
      ctx.drawImage(img, 0, 0)
    } else {
      let ratio = img.width / img.height
      let w, h
      if (ratio > 1) {
        w = maxWidth
        h = maxWidth / ratio
      } else {
        h = maxWidth
        w = ratio * maxWidth
      }

      ctx.drawImage(img, 0, 0, w, h)
    }

    dataURL = canvas.toDataURL(outputFormat)
    callback(null, dataURL, img)
  }
  img.onerror = e => callback(e)
  img.onabort = e => callback(e)
  img.src = src

  // if (img.complete || img.complete === undefined) {
  //   img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
  //   img.src = src
  // }
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
