import theme from './theme'
import csjs from 'CSJS'

// global shared style should be defined here
module.exports = csjs`
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

