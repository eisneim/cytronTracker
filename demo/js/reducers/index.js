/* eslint-disable key-spacing, no-multi-spaces */
import rootHandles      from './rd.root.js'
import layoutHandles    from './rd.layout.js'
import trackersHandles  from './rd.trackers.js'
import masksHandles     from './rd.masks.js'
import itemsHandles     from './rd.items.js'
import resourcesHandles from './rd.resources.js'
import exportsHandles   from './rd.exports.js'

function reducerWraper(handles, state, action, cytron) {
  if (!cytron.store) return state

  const { payload, type } = action
  const handler = handles[type]

  return typeof handler === 'function' ?
    handler(state, payload, cytron, action) :
    state
}

export const appReducer = cytron => (state = {}, action) => {
  // global reducer operates on both root,elements and pages etc
  // if (action.meta && action.meta.isGlobal) {
  //   return globalReducer(state, action, cytron)
  // }

  return {
    config:     state.config,
    root:       reducerWraper(rootHandles, state.root, action, cytron),
    layout:     reducerWraper(layoutHandles, state.layout, action, cytron),
    trackers:   reducerWraper(trackersHandles, state.resource, action, cytron),
    masks:      reducerWraper(masksHandles, state.masks, action, cytron),
    items:      reducerWraper(itemsHandles, state.items, action, cytron),
    resources:  reducerWraper(resourcesHandles, state.resources, action, cytron),
    exports:    reducerWraper(exportsHandles, state.exports, action, cytron),
  }
}

export default appReducer
