import theme from '../theme'
import csjs from 'CSJS'

let $barheight = 3

const styles = csjs`
.notifyWraper {
  width: 100%;
}
.notify {
  margin-bottom: 5px;
  color: #fff;
  font-size: 14px;
}
.notify.shouldHide .notifyInner{
  animation: hideRight 0.3s ease-out;
  animation-fill-mode: forwards;
}
.shouldHide{
  font-weight: normal;
}
.notifyInner{
  cursor: pointer;
  display: inline-block;
  width: auto;
  float: right;
  padding:0.4em 0.5em;
  border-radius: 3px;
  box-shadow: ${theme.shadowDepth2};
  animation: showup 0.3s cubic-bezier(.25,.8,.25,1);
  animation-fill-mode: forwards;
}
.notifyInner p {
  margin: 0.1em 0;
}
.notifyInner h4 {
  font-weight: bold;
  margin: 0.3em 0 0;
}
.notify_error .notifyInner{
  background-color: ${theme.notifyError};
}
.notify_success .notifyInner{
  background-color: ${theme.notifySuccess};
}
.notify_info .notifyInner{
  background-color: ${theme.notifyInfo};
}
.notify_warn .notifyInner{
  background-color: ${theme.notifyWarn};
}
@keyframes showup {
  0% {
    opacity: 0;
    transform: translateY(100px) scale(0.2);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes hideRight {
  0% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateX(100px);
  }
}
.loadingWraper {
  width: 100%;
}

.bar {
  background-color: #00ab6b;
  height: ${$barheight}px;
  position:absolute;
  top:0;
  &.loading{
    top:-${$barheight}px;
    animation: stripAnim 1s ease-in-out 0s infinite;
  }
}
@keyframes stripAnim {
  0% {
    width: 0%;
    left:0;
  }
  48% {
    width: 100%;
    left:0;
  }
  100% {
    left:100%;
    width: 100%;
  }
}

`

/**
 * store id for notification;
 */
let __id = 0

function getId(prefix) {
  return (prefix || 'cy_noti_') + __id++
}

// create a wraper and inject it into document.body
export class DomStaticElm {
  constructor(config = {}) {
    this.container = config.container || document.body
    this.className = config.wraperClassName || 'cy_over_wraper'
    this.alignVertical = config.alignVertical || 'bottom' // or top
    this.alignHorizontal = config.alignHorizontal || 'right' // or left
    this.isFixed = config.isFixed === undefined ? true : config.isFixed
    this.wraperStyle = config.wraperStyle || {}
    this.edgeGutter = config.edgeGutter === undefined ? 15 : config.edgeGutter

    this.createWraper()
  }

  createWraper() {
    var oldWraper = document.querySelector('.' + this.className)
    if (!oldWraper) {
      this.$wraper = document.createElement('div')
      this.$wraper.className = this.className
    } else {
      this.$wraper = oldWraper
    }


    this.$wraper.style.position = this.isFixed ? 'fixed' : 'abusolute'
    this.$wraper.style.zIndex = 100
    this.$wraper.style[this.alignHorizontal] = this.edgeGutter + 'px'
    this.$wraper.style[this.alignVertical] = this.edgeGutter + 'px'

    // this.$wraper.style = Object.assign(styleObj, this.wraperStyle)
    this.container.appendChild(this.$wraper)
  }
}

/**
 *
 */
export class Notify extends DomStaticElm {

  constructor(config = {}) {
    super(Object.assign({}, config, {
      wraperClassName: styles.notifyWraper || 'notifyWraper',
    }))

    this.life = config.life || 4000
    this.customClass = config.notifyClassName
    this.stateMap = {}
    // this.notifiers = []
  }

  _showMsg(type, msg, title) {
    var elm = document.createElement('div')
    var notifyId = getId('noti_')

    elm.className = `clearfix ${styles.notify || 'notify'} ${(styles['notify_' + type]) || ('notify_' + type)} ${this.customClass || ''}`
    elm.dataset.notifyId = notifyId

    var titleTpl = `<h4>${title}</h4>`
    elm.innerHTML = `<div class="${styles.notifyInner || 'notifyInner'}">${title ? titleTpl : ''}<p>${msg}</p></div>`

    this.$wraper.childNodes.length === 0 ?
      this.$wraper.appendChild(elm) : this.$wraper.insertBefore(elm, this.$wraper.firstElementChild)

    // click to suicid it
    elm.addEventListener('click', () => this.suicide(elm, notifyId))
    setTimeout(()=> this.suicide(elm, notifyId), this.life)
    return type !== 'error'
  }

  suicide(elm, notifyId) {
    // prevent click multi times
    if (this.stateMap[notifyId] || !elm) return

    this.stateMap[notifyId] = true
    elm.classList.add(styles.shouldHide || 'shouldHide')
    // for animation
    setTimeout(()=> {
      this.stateMap[notifyId] = false
      elm.remove()
    }, 400)
  }

  error(msg, title) {
    if (Array.isArray(msg)) {
      msg.forEach(mm => this._showMsg('error', mm, title))
    } else {
      this._showMsg('error', msg, title)
    }
  }

  success(msg, title) {
    this._showMsg('success', msg, title)
  }

  info(msg, title) {
    this._showMsg('info', msg, title)
  }

  warn(msg, title) {
    this._showMsg('warn', msg, title)
  }
}

export const notify = new Notify({ life: 5000 })
export default notify
/**
 * the loading bar
 */
export class Loadingbar extends DomStaticElm {

  constructor(config = {}) {
    super(Object.assign({}, config, {
      wraperClassName: styles.loadingWraper || 'loadingWraper',
      alignVertical: 'bottom',
      alignHorizontal: 'left',
      edgeGutter: 0,
    }))

    this.$bar = document.createElement('div')
    this.$bar.className = styles.bar || 'bar'
    this.$wraper.appendChild(this.$bar)
    if (config.loaderColor)
      this.$bar.style.backgroundColor = config.loaderColor

    this.lastStartTime = -1
    this.minDuration = config.minDuration || 1000
  }

  load() {
    this.isLoading = true
    this.$bar.classList.add(styles.loading || 'loading')
    this.lastStartTime = Date.now()
  }

  stop() {
    this.isLoading = false
    var gap = this.minDuration - (Date.now() - this.lastStartTime)
    if (gap < 0) {
      this.hideBar()
    } else {
      setTimeout(this.hideBar.bind(this), gap)
    }
  }

  hideBar() {
    this.$bar.classList.remove(styles.loading || 'loading')
  }

}

export const loader = new Loadingbar()
