import theme from './theme'
import csjs from 'CSJS'

// global shared style should be defined here
module.exports = csjs`
@font-face {
  font-family: "Material Icons";
  font-style: normal;
  font-weight: 400;
  src: url("/assets/MaterialIcons-Regular.eot"); /* For IE6-8 */
  src: local("Material Icons");
  src: local("MaterialIcons-Regular");
  src: url("/assets/MaterialIcons-Regular.woff2") format("woff2");
  src: url("/assets/MaterialIcons-Regular.woff") format("woff");
  src: url("/assets/MaterialIcons-Regular.ttf") format("truetype");
}
.materialIcons {
  font-family: "Material Icons";
  font-weight: normal;
  font-style: normal;
  /*font-size: 24px;*/
  font-size:inherit;
  display: inline-block;
  width: 1em;
  height: 1em;
  line-height: inherit;
  /*line-height: inherit; line-height: 1; ??*/
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;

  /* Support for all WebKit browsers. */
  -webkit-font-smoothing: antialiased;
  /* Support for Safari and Chrome. */
  text-rendering: optimizeLegibility;
  /* Support for Firefox. */
  -moz-osx-font-smoothing: grayscale;

  /* Support for IE. */
  font-feature-settings: "liga";
  position: relative;
}
.materialIcons.cyIcon{
  position: relative;
  top: 7px;
}
.materialIcons.md18 { font-size: 18px; }
.materialIcons.md24 { font-size: 24px; }
.materialIcons.md36 { font-size: 36px; }
.materialIcons.md48 { font-size: 48px; }

  body {
    color: ${theme.colorMain};
    font-size: 12px;
  }

  .hide{
    visibility: hidden;
  }
  .noScroll{
    overflow:hidden;
  }

  .clearfix::before, .clearfix::after {
    content: " ";
    display: table;
  }

  .clearfix::after {
    clear: both;
  }

  .centerBlock {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  .pullRight { float: right !important; }

  .pullLeft { float: left !important; }

  .textLeft{text-align: left;}
  .textCenter{text-align: center;}
  .textRight{text-align: right;}

  .flexRow{
    display: flex;
    flex-direction: row;
    /*align-items: center;*/
  }
  .flexCol{
    flex-direction: column;
    display: flex;
    justify-content: center;
  }
  .flexCenter{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .flex {
    flex: 1;
    align-self: center;
  }

 `

