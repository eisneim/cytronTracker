import React from 'react'
// import ReactDom from 'react-dom'
// import styles from './Conditional.scss'

export class Conditional extends React.Component {

  static propTypes = {
    showIf: React.PropTypes.bool,
    hideIf: React.PropTypes.bool,
    isInline: React.PropTypes.bool,
  };

  render() {
    const { showIf, hideIf, isInline } = this.props
    var display
    if (showIf !== undefined) {
      display = showIf ? 'unset' : 'none'
    } else {
      display = hideIf ? 'none' : 'unset'
    }


    if (isInline) {
      return <span style={{ display }}>{this.props.children}</span>
    }

    // show as a Overly
    return (
      <div style={{ display }}>{this.props.children}</div>
    )
  }
}

export default Conditional



// import PureRenderMixin from "react-addons-pure-render-mixin"
// import reactMixin from "react-mixin"
// reactMixin.onClass(Conditional, PureRenderMixin )
