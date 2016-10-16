export default function() {
  const classes = []

  for (let i = 0; i < arguments.length; i++) {
    const arg = arguments[i]
    if (!arg) continue

    const argType = typeof arg

    if (argType === 'string' || argType === 'number') {
      classes.push(arg)
    } else if (Array.isArray(arg)) {
      classes.push(classNames.apply(null, arg))
    } else if (argType === 'object') {
      for (let key in arg) {
        if ({}.hasOwnProperty.call(arg, key) && arg[key]) {
          classes.push(key)
        }
      }
    }
  }

  return classes.join(' ')
}
