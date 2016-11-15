export function addFileResource(file, dataUrl, img) {
  return {
    type: 'ADD_RESOURECE',
    payload: { dataUrl, file, img },
  }
}

export function addUrlResource(url, dataUrl, img) {
  return {
    type: 'ADD_RESOURECE',
    payload: { dataUrl, url, img },
  }
}

export function deleteResource(id) {
  return {
    type: 'DELETE_RESOURECE',
    payload: id,
  }
}

export function resourceToTracker(resource) {
  return {
    type: 'RES_TO_TRACKER',
    payload: resource,
  }
}