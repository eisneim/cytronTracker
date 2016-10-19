import React, { Component, PropTypes } from 'react'
import Scrollable from './Scrollable'
import cx from 'classnames'
import theme from '../../theme'
import csjs from 'CSJS'

import { FlexSpan } from './Flex'

const debug = require('debug')('cy:Panel')

const styles = csjs`
.panelBase{
  background-color: ${theme.bgMain};
  border: ${theme.bgMainBorder};
  position: relative;
  user-select: none;
  display: flex;
  flex-direction: column;
}
.panelBase.active{
  border: solid 1px ${theme.colorActive};
}
.panelHeader{
  height:25px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${theme.bgMainDarker};
  padding-right: 10px;
}
.panelTitle{
  margin-left: 5px;
}
.panelTabs{

}
.panelTab{
  display:inline-block;
  background-color: ${theme.bgDarker};
  padding: 3px 8px;
  height:24px;
  color: ${theme.colorDisabled};
  cursor: pointer;
  position: relative;
  width:auto;
  border-right: solid 1px ${theme.bgDark};
}
.panelTab.active {
  background-color: ${theme.bgMain};
  color: ${theme.colorActive};
}
.panelActions{
  margin-right: 3px;
}
.panelActions>i {
  margin-left: 5px;
}
.panelContent {
  flex: 1;
  min-height: 50px;
}
.panelFooter{
  display:flex;
  flex-direction: row;
  align-items: center;

  border-top: solid 1px ${theme.bgMainBorder};
  height: 25px;
  padding: 0 5px;
  width:100%;
}
.panelFooter>i{
  margin-right: 5px;
}
`

export class PanelActions extends Component {
  render() {
    return <span className={styles.panelActions}>{this.props.children }</span>
  }
}
export class PanelContent extends Component {
  render() {
    return <Scrollable className={styles.panelContent}>{this.props.children}</Scrollable>
  }
}
export class PanelFooter extends Component {
  render() {
    return <div className={styles.panelFooter}>{this.props.children}</div>
  }
}

export class Panel extends Component {

  static propTypes = {
    onSelectTab: PropTypes.func,
  }

  _handleClick(key) {
    if (typeof this.props.onSelectTab === 'function' && key !== this.props.activeTab)
      this.props.onSelectTab(key)
  }

  $getTabOrTitle() {
    const { title, tabs, activeTab } = this.props
    if (!tabs) return <span className={styles.panelTitle}>{title}</span>

    return (
      <div>
      {
        tabs.map((tab, index) => {
          const isActive = activeTab ? activeTab === tab.key : index === 0

          return <span key={index}
            className={cx(styles.panelTab, { [styles.active]: isActive })}
            onClick={()=>{ this._handleTabClick(tab.key) }}
           >
            {tab.name}
          </span>
        })
      }
      </div>
    )
  }

  render() {
    const { height, className } = this.props
    const panelStyle = height !== null ? {
      height: height + 'px',
    } : {}

    const childCount = React.Children.count(this.props.children)
    var $content = childCount === 1 ? this.props.children : undefined
    var $actions, $footer

    for (var ii = 0; ii < childCount; ii++) {
      const child = this.props.children[ii]
      // children migtht be null
      if (!child) continue
      if (child.type === PanelContent)
        $content = child
      if (child.type === PanelActions)
        $actions = child
      if (child.type === PanelFooter)
        $footer = child
    }

    return (
      <div className={styles.panelBase + ' ' + className} style={panelStyle}>
        <header className={styles.panelHeader}>
          { this.$getTabOrTitle() }
          <FlexSpan/>
          { $actions }
        </header>
        { $content }
        { $footer }
      </div>
    )
  }
}

export default Panel