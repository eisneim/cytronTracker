/* eslint-disable no-console */
window.cyDebug = require('debug')

const { NAME, VERSION, COMMIT, BUILD_DATE } = process.env
console.log(`%c🎯 ${NAME}@${VERSION}#${COMMIT}🆒 updated on ${new Date(BUILD_DATE).toLocaleString()} ✅`, 'color:#888;')

import * as imageProc from './utils/imageProc'
import * as mtx from './utils/matrix'

import HarrisCorner from './detector/Harris'

module.exports = window.cyTracker = {
  imageProc, mtx, HarrisCorner,
}
