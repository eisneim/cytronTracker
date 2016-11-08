export const TrackerTypes = {
  'MOTION': 0,
  'SCALE_ROTATION': 1,
  'PERSPECTIVE': 2,
  'PLANNAR': 3,
}

const trackerTypeName = {
  [TrackerTypes.MOTION]: 'Motion',
  [TrackerTypes.SCALE_ROTATION]: 'Scale&Rotaion',
  [TrackerTypes.PERSPECTIVE]: 'Perspective',
  [TrackerTypes.PLANNAR]: 'Plannar',
}

export function getTrackerType(type) {
  return trackerTypeName[type]
}

export const MatchAlgorithm = {
  'SSD': 0,
  'BRUTAL': 1,
  'FAST': 2,
  'SURF': 3,
  'AKAZE': 4,
}

export const DefaultTracker = {
  RECT_SIZE: 16,
  SEARCH_SIZE: 50,
}

export const ModalIds = {
  NEW_RESOURCE: 'newResource',
}
