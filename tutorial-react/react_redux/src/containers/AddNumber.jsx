import AddNumber from "../components/AddNumber";
import { connect } from 'react-redux';

// Redux 의 dispatch 값을 React 의 props 로 연결
// 호출될 때 store.dispatch 를 인자로 받음
function mapDispatchToProps(dispatch) {
  return {
    onClick: function (_size) {
      dispatch({
        type: 'INCREMENT',
        size: _size,
      });
    },
  };
}

export default connect(null, mapDispatchToProps)(AddNumber);

/*
import React, { Component } from "react";
import AddNumber from "../components/AddNumber";
import store from "../store";

export default class extends Component {
  render() {
    return <AddNumber onClick={function (_size) {
      store.dispatch({
        type: 'INCREMENT',
        size: _size,
      })
    }.bind(this)} />
  }
}
*/