import React, { PropTypes } from 'react'
import cx from 'classnames'
import styles from '../styles'
import theme from '../theme'
import csjs from 'CSJS'

// import { FlexRow } from './_shared/Flex'
import Panel, { PanelContent, PanelActions, PanelFooter } from './_shared/Panel'
import { CheckBox } from './ui'
import { ConnectedVideoSource } from './panels/VideoSource'
import { ConnectedStage } from './Stage'

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

import { connect } from 'react-redux'
import actions from '../actionCreators'

function mapStateToProps(state) {
  return {
    layout: state.layout,
  }
}

export default (cytronApp) => {
  class App extends React.Component {

    static childContextTypes = {
      cytron: PropTypes.object,
    };

    getChildContext() {
      return {
        cytron: cytronApp,
      }
    }

    _switchTopRighTab(tabKey) {
      debug('tabKey:', tabKey)
    }

    render() {
      const { layout } = this.props
      return (
        <div className={cx(cxs.cytronApp, styles.clearfix)}>
          <ConnectedStage />
          <section className={cxs.sideSection} style={{ width: layout.rightSectionWidth }}>
            <ConnectedVideoSource/>
            <div className={cxs.horSpaceer}/>
            <Panel tabs={toRightTabs}
              activeTab={toRightTabs[1].key}
              onSelectTab={this._switchTopRighTab}>
              <PanelContent>
                <p>some shit</p>
                <CheckBox>Good?</CheckBox>
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

  return connect(
    mapStateToProps,
    actions
  )(App)
}

