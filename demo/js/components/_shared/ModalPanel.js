import React, { PropTypes, Component } from 'react'
// import reactDOM from 'react-dom'
import cx from 'classnames'
import theme from '../../theme'
import csjs from 'CSJS'

import Dragable from './Dragable'
import { IconButton } from '../_ui/Button'
import { connect } from 'react-redux'

const debug = require('debug')('cy:ModalPanel')
const styles = csjs`
.header {
  height: 25px;
  min-width: 300px;
  background-color: ${};
  border-bottom: ${};
  align-items: center;
  padding-left: 5px;
}
.draggable {
  cursor: move;
}
.content {
  padding: 10px;
}
.footer {
  padding: 10px;
}
`

function mapStateToProps(state) {
  return {
    activeModals: state.layout.activeModals,
  }
}

@connect(mapStateToProps, {})
export class ModalPanel extends Component {

  static propTypes = {
    title: PropTypes.string,
    onRequestClose: PropTypes.func,
    modalId: PropTypes.string.isRequired,
    showBackdrop: PropTypes.bool,
    closeOnBackdropClick: PropTypes.bool,
    isDraggable: PropTypes.bool,
    activeModals: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
  };

  static defaultProps = {
    activeModals: [],
    width: 620,
    height: 300,
  };

  _handleCloseBtnClick = () => {
    if (typeof this.props.onRequestClose === 'function') {
      this.props.onRequestClose(this.props.modalId)
    } else {
      this.props.hideModal(this.props.modalId)
    }
  }

  _handleModalMove = (e, startEvent) => {
    const movementX = e.clientX - startEvent.clientX
    const movementY = e.clientY - startEvent.clientY

    if (!this.__startDrag) {
      this.__startDrag = {
        marginLeft: this.state.marginLeft || 0,
        marginTop: this.state.marginTop || 0,
      }
    }

    this.setState({
      marginLeft: this.__startDrag.marginLeft + movementX,
      marginTop: this.__startDrag.marginTop + movementY,
    })
  }

  _handleModalRelease = () => {
    this.__startDrag = null
  }

  componentWillReceiveProps(props) {
    const { activeModals, modalId } = props
    const { activeModals: prevActiveModals } = this.props
    const isCurOpen = activeModals.indexOf(modalId) !== -1
    const isPrevOpen = prevActiveModals.indexOf(modalId) !== -1
    if (isCurOpen && !isPrevOpen)
      this.__needResetPosition = true
  }

  componentDidUpdate() {
    if (this.__needResetPosition) {
      this.__needResetPosition = false
      const rootRect = ReactDOM.findDOMNode(this).getBoundingClientRect()
      const width = this.props.width || rootRect.width
      const height = this.props.height || rootRect.height

      this.setState({
        top: `calc(50% - ${height / 2}px)`,
        left: `calc(50% - ${width / 2}px)`,
        marginTop: 0,
        marginLeft: 0,
      })
    }
  }

  render() {
    const {
      title,
      isDraggable,
      activeModals,
      modalId,
      width,
      height,
    } = this.props
    const {
      top,
      left,
      marginTop,
      marginLeft,
    } = this.state
    const modalStyle = {
      width,
      height,
      top,
      left,
      marginLeft,
      marginTop,
    }
    const headerClassName = cx(styles.header, {
      [styles.draggable]: isDraggable,
    })
    const isOpen = activeModals.indexOf(modalId) !== -1

    return (
      <Modal
        {...this.props}
        isOpen={isOpen}
        modalStyle={modalStyle}>
        <Dragable
          cascade
          element='header'
          onMove={isDraggable ? this._handleModalMove : null}
          onUp={isDraggable ? this._handleModalRelease : null}
          className={headerClassName}
          data-layout="row">
          <span>{title}</span>
          <span data-flex/>
          <IconButton name="close" onClick={this._handleCloseBtnClick}/>
        </Dragable>
        <div className={styles.content}>
          {this.props.children}
        </div>
        <div className={styles.footer}>

        </div>
      </Modal>
    )
  }
}

