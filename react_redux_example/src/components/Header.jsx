import React, { Component } from 'react'
import { connect } from 'react-redux';

class Header extends Component {
  render() {
    return (
      <div>
        <header>
          <h1>
            <a href="#welcome" onClick={() => {
              this.props.onClick();
            }}>WEB</a>
          </h1>
          World Wide Web
        </header>
      </div>
    )
  }
}

export default connect(
  null,
  (dispatch) => {
    return {
      onClick: function() {
        dispatch({type: 'WELCOME'})
      }
    }
  })(Header);