/* eslint-disable no-console */
window.cyDebug = require('debug')

const { NAME, VERSION, COMMIT, BUILD_DATE } = process.env
console.log(`%c🎯 ${NAME}@${VERSION}#${COMMIT}🆒 updated on ${new Date(BUILD_DATE).toLocaleString()} ✅`, 'color:#888;')

export * as imageProc from './utils/imageProc'
export * as mtx from './utils/matrix'

export HarrisCorner from './detector/Harris'