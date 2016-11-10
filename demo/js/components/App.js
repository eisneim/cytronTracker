import React, { PropTypes } from 'react'
import cx from 'classnames'
import styles from '../styles'
import theme from '../theme'
import csjs from 'CSJS'
import { ModalIds } from '../constants'
// import { FlexRow } from './_shared/Flex'
import Panel, { PanelContent, PanelActions, PanelFooter } from './_shared/Panel'
import { CheckBox } from './ui'
import { IconButton } from './ui/Button'
import { ConnectedVideoSource } from './panels/VideoSource'
import { ConnectedTrackerSetting } from './panels/TrackerSetting'
import { ConnectedStage } from './Stage'
import { ConnectedTrackerList } from './panels/TrackerList'
import { CResourceGrid } from './panels/ResourceGrid'

import NewResourceModal from './modals/NewResourceModal'

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

const topRightTabs = [
  { name: 'Resources', key: 'RESOURCES' },
  { name: 'Trackers', key: 'TRACKERS' },
  { name: 'Masks', key: 'MASKS' },
]

import { connect } from 'react-redux'
import { layoutActions } from '../actionCreators'

function mapStateToProps(state) {
  return {
    rightSectionWidth: state.layout.rightSectionWidth,
    activeItemTab: state.layout.activeItemTab,
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

    _switchTopRighTab = (tabKey) => {
      this.props.setItemsTab(tabKey)
    }

    $getTopRightTabContent(tabKey) {
      switch (tabKey) {
      case 'RESOURCES':
        return <CResourceGrid/>
      case 'TRACKERS':
        return <ConnectedTrackerList/>
      default: return <span>mask</span>
      }
    }

    render() {
      const { rightSectionWidth, activeItemTab } = this.props
      return (
        <div className={cx(cxs.cytronApp, styles.clearfix)}>
          <ConnectedStage />
          <section className={cxs.sideSection} style={{ width: rightSectionWidth }}>
            <ConnectedVideoSource/>
            <div className={cxs.horSpaceer}/>
            <Panel tabs={topRightTabs}
              height={250}
              activeTab={activeItemTab}
              onSelectTab={this._switchTopRighTab}>
              <PanelContent>
                { this.$getTopRightTabContent(activeItemTab) }
              </PanelContent>
              <PanelActions>
                <span>?</span>
              </PanelActions>
              <PanelFooter>
                {activeItemTab !== 'RESOURCES' ? null :
                  <IconButton name="add"
                    onClick={() => this.props.setModal(ModalIds.NEW_RESOURCE, true)}
                  >Add Resource</IconButton>
                }
              </PanelFooter>
            </Panel>
            <div className={cxs.horSpaceer}/>
            <ConnectedTrackerSetting />
          </section>
          <NewResourceModal/>
        </div>
      )
    }
  }

  return connect(
    mapStateToProps,
    layoutActions
  )(App)
}

