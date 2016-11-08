import React from 'react'
// import reactDOM from 'react-dom'
// import cx from 'classnames'
// import theme from '../../theme'
// import csjs from 'CSJS'
import { ModalIds } from '../../constants'
import ModalPanel from '../_shared/ModalPanel'

class NewResourceModal extends React.Component {
  render() {
    return (
      <ModalPanel
        isDraggable
        closeOnBackdropClick
        title='Create New Resource'
        width={500}
        height={300}
        onRequestClose={() => this.props.setModal(ModalIds.NEW_RESOURCE, false)}
        modalId={ModalIds.NEW_RESOURCE}>
        hello this some content
      </ModalPanel>
    )
  }
}

import { connect } from 'react-redux'
import { layoutActions } from '../../actionCreators'
const CNewResourceModal = connect(
  () => ({}),
  layoutActions
)(NewResourceModal)
export default CNewResourceModal