import React from 'react'
import cx from 'classnames'
import theme from '../theme'
import csjs from 'CSJS'

import { FlexRow, FlexSpan } from './_shared/Flex'
import { IconButton } from './ui/Button'
import { Icon } from './ui'
import Panel, { PanelContent, PanelActions, PanelFooter } from './_shared/Panel'
import { ConnectedTimeline } from './main/Timeline'
import { ConnectedVideoCanvas } from './main/VideoCanvas'

const styles = csjs`
  .controlsWraper {
    position: absolute;
    bottom: ${theme.timelineHeight}px;
    left: 0;
    width: 100%;
    height: ${theme.controlsBarHeight}px;
    padding: 0 10px;
  }
  .trackBackBtn {
    transform: rotate(180deg);
    position: relative;
  }
`

export default class Stage extends React.Component {


  render() {
    const { layout } = this.props

    return (
      <div style={{ flex: 1, height: '100%' }}>
        <Panel title={ 'CytronTracker@' + process.env.VERSION } height={layout.windowHeight}>
          <PanelContent>
            <ConnectedVideoCanvas/>
            <FlexRow className={styles.controlsWraper}>
              <FlexSpan/>
              <IconButton size="lg" name="fast_rewind"/>
              <IconButton size="lg" name="skip_previous"/>
              <IconButton size="lg" name="skip_next"/>
              <IconButton size="lg" name="fast_forward"/>
              <FlexSpan/>
            </FlexRow>
            <ConnectedTimeline />
          </PanelContent>
          <PanelActions>
            <Icon name="build"/>
          </PanelActions>
          <PanelFooter>
            <span>footer one</span>
          </PanelFooter>
        </Panel>
      </div>
    )
  }
}

import { connect } from 'react-redux'
import actions from '../actionCreators'

function mapStateToProps(state) {
  return {
    layout: state.layout,
    root: state.root,
  }
}

export const ConnectedStage = connect(
  mapStateToProps,
  actions
)(Stage)