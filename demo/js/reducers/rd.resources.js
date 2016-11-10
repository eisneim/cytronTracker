/* eslint-disable no-unused-vars */
import { basename } from 'path'

let idCount = 1
const getID = () => idCount++

export default {
  ADD_RESOURECE(res, { file, url, dataUrl, img }, cytron) {
    let id = getID()
    let newRes = { id }
    cytron.imgCachePool[id] = img
    cytron.resourceMap[id] = dataUrl
    if (file) {
      newRes.name = file.name
      newRes.size = file.size
      newRes.type = file.type
    } else {
      newRes.url = url
      newRes.name = basename(url) || ('file_' + id)
    }
    res.push(newRes)
    return res.slice()
  },
  DELETE_RESOURECE(res, id, cytron) {
    cytron.resourceMap[id] = null
    cytron.imgCachePool[id] = null
    let idx = res.findIndex(r => r.id === id)
    res.splice(idx, 1)
    return res.slice()
  },
}