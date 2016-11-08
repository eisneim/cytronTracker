export function setItemsTab(key) {
  return {
    type: 'SET_ITEMS_TAB',
    payload: key,
  }
}

export function setModal(key, isOpen = false) {
  return {
    type: 'SET_MODAL',
    payload: { isOpen, key },
  }
}