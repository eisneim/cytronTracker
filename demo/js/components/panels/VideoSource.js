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

  render() {
    const { video } = this.props.root
    return (
      <Panel title="Video Source" height={110}>
        <PanelContent>
          <div style={{ padding: 10, width: '100%', overflowX: 'hidden' }}>
            <Input value={video.url}
              label='VideoUrl'
              onChange={e =>{ this.$url = e.target.value }}
              isLabelAtTop icon="more_horiz"/>
            <FlexRow>
              <div style={{ width: 60, marginTop: 5 }}>
                <Input label="FPS"
                  value={video.fps}
                  onChange={e =>{ this.$fps = e.target.value }}/>
              </div>
              <FlexSpan/>
              <Button size="sm" raised style={{ marginTop: 5 }}>Process</Button>
            </FlexRow>
          </div>
        </PanelContent>
      </Panel>
    )
  }
}

import { connect } from 'react-redux'
import actions from '../../actionCreators'

function mapStateToProps(state) {
  return {
    root: state.root,
  }
}

export const ConnectedVideoSource = connect(
  mapStateToProps,
  actions
)(VideoSource)