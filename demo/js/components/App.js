import React from 'react'
import cx from 'classnames'
import styles from '../styles'
import theme from '../theme'
import csjs from 'CSJS'

// import { FlexRow } from './_shared/Flex'
import Panel, { PanelContent, PanelActions, PanelFooter } from './_shared/Panel'

const cxs = csjs`
  .cytronApp {
    width: 100%;
    height: 100%;
    background-color: ${theme.bgDark};
    color: ${theme.colorMain};
    font-size: 12px;
    display: flex;
    flex-direction: row;
  }
  .mainSection {
    background-color: ${theme.bgMain};
    width: 700px;
    overflow:hidden;
    min-height: 500px;
  }
  .sideSection {
    width: 303px;
    padding-left: 3px
  }
  .horSpaceer { height: 3px }
`

const debug = require('debug')('cy:App')

const toRightTabs = [
  { name: 'Resources', key: 'RESOURCES' },
  { name: 'Trackers', key: 'TRACKERS' },
  { name: 'Masks', key: 'MASKS' },
]


export default class App extends React.Component {

  _switchTopRighTab(tabKey) {
    debug('tabKey:', tabKey)
  }

  render() {
    const { layout } = this.props
    return (
      <div className={cx(cxs.cytronApp, styles.clearfix)}>
        <div style={{ flex: 1 }}>
          <Panel title="Stage" height={700}>
            <PanelContent>
              <h1>wazz up?</h1>
            </PanelContent>
            <PanelFooter>
              <span>footer one</span>
            </PanelFooter>
          </Panel>
        </div>
        <section className={cxs.sideSection}>
          <Panel title="Video Source">
            <PanelContent>
              <span>some shit</span>
            </PanelContent>
          </Panel>
          <div className={cxs.horSpaceer}/>
          <Panel tabs={toRightTabs}
            activeTab={toRightTabs[1].key}
            onSelectTab={this._switchTopRighTab}>
            <PanelContent>
              <span>some shit</span>
            </PanelContent>
            <PanelActions>
              <span>action one</span>
            </PanelActions>
          </Panel>
          <div className={cxs.horSpaceer}/>
          <Panel title="Tracker Setting">
            <PanelContent>
              <span>some shit</span>
            </PanelContent>
          </Panel>
        </section>
      </div>
    )
  }
}

import { connect } from 'react-redux'
import actions from '../actionCreators'

function mapStateToProps(state) {
  return {
    layout: state.layout,
  }
}

export const ConnectedApp = connect(
  mapStateToProps,
  actions
)(App)