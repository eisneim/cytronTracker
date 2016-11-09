import React, { PropTypes, Component } from 'react'
import reactDOM from 'react-dom'

import cx from 'classnames'
import theme from '../../theme'
import csjs from 'CSJS'
const styles = csjs`
.modalWraper {
  top: 0;
  left: 0;
  right: 0;
  bottom:0;
  height: 100%;
  z-index: 999;
  visibility: hidden;
  background-color: rgba(0,0,0,0);
  transition: visibility 0s 0.4s, background-color 0.3s ease;
  position: fixed;
  pointer-events: none;
}
.modalWraper.absolute {
  position: absolute;
}
.modalWraper.visible {
  visibility: visible;
  transition: visibility 0s, background-color 0.3s ease;
}
.modalWraper.visible.showBackdrop {
  pointer-events: auto;
  background-color: rgba(0,0,100,0.3);
}

.modal {
  pointer-events: auto;
  border-radius: 3px;
  min-width: 240px;
  max-width: 98%;
  max-height: 98%;
  box-shadow: 0 27px 24px 0 rgba(0,0,0,.2);
  display: flex;
  flex-direction: column;
  opacity:1;
  z-index: 2;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: auto;
  background-color: ${theme.bgMain};
  border: solid 1px ${theme.bgMainBorder};
  animation: modalIn 0.4s cubic-bezier(.25,.8,.25,1);
}
.modal.transitionOut{
  visibility: hidden;
  opacity:0;
  transform: translate3d(0,50%,0) scale(0.98);
  transition: visibility 0s 0.4s,
    opacity 0.4s cubic-bezier(.25,.8,.25,1),
    transform 0.4s cubic-bezier(.25,.8,.25,1);
}
@keyframes modalIn {
  0% {
    opacity: 0;
    transform: translateY(50%) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1.0);
  }
}
`

const debug = require('debug')('cy:modal')

class ModalInner extends Component {
  static propTypes = {
    isOpen: PropTypes.bool,
  };

  constructor() {
    super()
    this.state = {
      reRender: true,
    }
    this.transitionOutComplete = true
  }

  render() {
    const { isOpen, modalStyle } = this.props

    if (!isOpen && this.transitionOutComplete) {
      return null
    }

    // force a rerender
    if (!isOpen && !this.transitionOutComplete) {
      setTimeout(() => {
        this.transitionOutComplete = true
        this.setState(prev => ({ reRender: !prev.reRender }))
      }, 400)
    }

    if (isOpen && this.transitionOutComplete) {
      // debug('should reset transition')
      this.transitionOutComplete = false
    }

    const modalClass = cx(styles.modal, {
      [styles.transitionOut]: !isOpen,
    }, this.props.className)

    return (
      <div className={modalClass}
        style={modalStyle}>
        {this.props.children}
      </div>
    )
  }
}

export default class Modal extends Component {

  static propTypes = {
    modalId: PropTypes.string.isRequired,
    showBackdrop: PropTypes.bool,
    onRequestClose: PropTypes.func,
    closeOnBackdropClick: PropTypes.bool,
  };

  render() {
    return <span />
  }

  _wraperOnClick = (e) => {
    const { onRequestClose, hideModal, closeOnBackdropClick, modalId } = this.props
    if (e.target !== this.$wraper || !closeOnBackdropClick) return
    if (typeof onRequestClose === 'function') {
      onRequestClose(modalId)
    } else {
      hideModal(modalId)
    }
  }

  // onece the empty Node rendered, do our DOM manlipulation
  componentDidMount() {
    this.getWraper()
    this.$wraper.addEventListener('click', this._wraperOnClick)
    this.renderContent(this.props)
  }

  getWraperClass() {
    return '_modal_' + this.props.modalId
  }

  getWraper() {
    const wraperClass = this.getWraperClass()
    this.$wraper = document.querySelector('.' + wraperClass)
    if (!this.$wraper) {
      this.$wraper = document.createElement('div')
      this.$wraper.className = cx(styles.modalWraper, wraperClass, {
        [styles.absolute]: this.props.isAbsolute,
      })

      document.body.appendChild(this.$wraper)
    }
    // debug('wraper:', this.$wraper)
  }
  componentWillReceiveProps(newProps) {
    this.renderContent(newProps)
  }

  renderContent(props) {
    this.$wraper.classList[props.showBackdrop ? 'add' : 'remove'](styles.showBackdrop)

    if (props.isOpen) {
      this.$wraper.classList.add(styles.visible)
    } else {
      this.$wraper.classList.remove(styles.visible)
    }

    this.portal = reactDOM.render(
      React.createFactory(ModalInner)(props),
      this.$wraper
    )
  }

  componentWillUnmount() {
    this.$wraper.removeEventLister('click', this._wraperOnClick)
    debug('componentWillUnmount', this.portal)
    document.body.removeChild(this.$wraper)

  }
}
