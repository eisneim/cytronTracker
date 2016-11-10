import React from 'react'
// import cx from 'classnames'
// import theme from '../theme'
// import csjs from 'CSJS'
import { FlexRow, FlexSpan } from '../_shared/Flex'
import Panel, { PanelContent } from '../_shared/Panel'
import { Button, Input } from '../ui'

// const styles = csjs`

// `

export default class VideoSource extends React.Component {

  _processVideo = () => {
    const { url, fps } = this.props.root.video
    this.props.setVideo(this.$url || url, this.$fps || fps)
  }

  render() {
    const { video } = this.props.root
    return (
      <Panel title="Video Source" height={115}>
        <PanelContent>
          <div style={{ padding: 10, width: '100%', overflowX: 'hidden' }}>
            <Input value={video.url || ''}
              label='VideoUrl'
              onChange={v =>{ this.$url = v }}
              isLabelAtTop icon="more_horiz"/>
            <FlexRow>
              <div style={{ width: 60, marginTop: 5 }}>
                <Input label="FPS"
                  value={video.fps}
                  onChange={v =>{ this.$fps = v }}/>
              </div>
              <FlexSpan/>
              <Button size="sm" raised
                onClick={this._processVideo}
                style={{ marginTop: 5 }}>Process</Button>
            </FlexRow>
          </div>
        </PanelContent>
      </Panel>
    )
  }
}

import { connect } from 'react-redux'
import { rootActions } from '../../actionCreators'

function mapStateToProps(state) {
  return {
    root: state.root,
  }
}

export const ConnectedVideoSource = connect(
  mapStateToProps,
  rootActions
)(VideoSource)