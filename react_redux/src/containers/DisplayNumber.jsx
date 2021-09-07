import DisplayNumber from '../components/DisplayNumber';
import { connect } from 'react-redux';

// Redux 의 state 값을 React 의 props 로 연결
// 호출될 때 redux의 state 값을 인자로 받음
function mapStateToReactProps(state){
  return {
    number: state.number,
  };
}

// connect() 를 실행해 리턴된 값에 대해 () 실행
// 아래의 wrap 과정을 connect 가 실행
// DisplayNumber 를 실행하고 props 로 데이터 전송
export default connect(mapStateToReactProps)(DisplayNumber);

/*
import React, { Component } from 'react'
import DisplayNumber from '../components/DisplayNumber'
import store from '../store'

export default class extends Component {
  state = {number: store.getState().number};

  constructor(props) {
    super(props);
    store.subscribe(function() {
      this.setState({number: store.getState().number});
    }.bind(this));
  }

  render() {
    return (
      <DisplayNumber number={this.state.number} unit={this.props.unit} />
    )
  }
}
*/