import React from 'react'
import { findDOMNode } from 'react-dom'
// import cx from 'classnames'
// import theme from '../../theme'
import csjs from 'CSJS'
import { ModalIds } from '../../constants'
import ModalPanel from '../_shared/ModalPanel'
// import { FlexRow, FlexSpan } from '../_shared/Flex'
import { Button, Input } from '../ui'

import * as fileUtil from '../../utils/util.files.js'

const debug = require('debug')('cy:newResource')
const styles = csjs`
.fileInput {
  visibility: hidden;
}
`
//@TODO: implement drop file to add resource
/*
<div className={styles.root}
  onDragOver={e => { e.preventDefault(); return false }}
  onDragEnter={this._onDragEnter}
  onDragLeave={this._onDragLeave}
  onDrop={this._onDrop}>
 */

class NewResourceModal extends React.Component {

  _selectFile = () => {
    if (!this.$fileInput) {
      debug('should find file input element', this.refs)
      this.$fileInput = findDOMNode(this.refs.fileInput)
    }
    this.$fileInput.click()
  }

  _fileSelected = () => {
    let { files } = this.$fileInput
    debug('fileSelected', files[0])
    fileUtil.fileToDataUrl(files[0], (dataUrl, img) => {
      this.props.addFileResource(files[0], dataUrl, img)
    }, true)
  }

  _fromUrl = () => {
    debug('fromUrl:', this.$url)
  }

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
        <p>Current Version only supports image files</p>
        <Input value={this.$url || ''}
          label='Image Url'
          onChange={v =>{ this.$url = v }}
          onIconClick={this._fromUrl}
          isLabelAtTop={false} icon="check"/>
        <div style={{ paddingTop: 10 }}>
          <span>or </span>
          <Button size='md' raised
            onClick={this._selectFile}>Select File</Button>
        </div>
        <input type="file"
          className={styles.fileInput}
          ref="fileInput"
          onChange={this._fileSelected}
          multiple="false"
          accept="image/*"
          name="fileInput"/>
      </ModalPanel>
    )
  }
}

import { connect } from 'react-redux'
import { layoutActions, resourceActions } from '../../actionCreators'
const CNewResourceModal = connect(
  () => ({}),
  Object.assign({}, layoutActions, resourceActions)
)(NewResourceModal)
export default CNewResourceModal