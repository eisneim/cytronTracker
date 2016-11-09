export function addFileResource(file, dataUrl, img) {
  return {
    type: 'ADD_RESOURECE',
    payload: { dataUrl, file, img },
  }
}

export function addUrlResource(url, dataUrl, img) {

}