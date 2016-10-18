import csjs from 'csjs'

const moduleCss = []
const insertedCss = []

export function addModuleCss(css) {
  if (moduleCss.indexOf(css) === -1) {
    moduleCss.push(css)
  }
}

export function getModuleCss() {
  return moduleCss.slice()
}

export function clearModuleCss() {
  moduleCss.length = 0
  insertedCss.length = 0
}

/*
 * Insert all module css into head
 */
export function setupModuleCss(root, styleTag) {
  moduleCss.forEach(css => {
    if (insertedCss.indexOf(css) === -1) {
      insertedCss.push(css)
    }
  })
  moduleCss.length = 0

  const css = insertedCss.join('')

  if (!styleTag) {
    styleTag = document.createElement('style')
    styleTag.setAttribute('type', 'text/css')
    root.appendChild(styleTag)
  }
  if ('textContent' in styleTag) {
    styleTag.textContent = css
  } else {
    styleTag.styleSheet.cssText = css
  }

  return styleTag
}

/*
 * csjs wrapper
 */
export default function() {
  const args = Array.prototype.slice.call(arguments)
  const styles = csjs.apply(null, args)

  addModuleCss(csjs.getCss(styles))

  return Object.keys(styles).reduce((result, prop) => {
    result[prop] = styles[prop].toString()
    return result
  }, { __origin: styles })
}
