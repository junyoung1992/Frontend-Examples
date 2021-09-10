import React, { Component } from "react";
import Header from "./components/Header";
import ReadContainer from "./containers/ReadContainer";
import ControlContainer from "./containers/ControlContainer";
import NavContainer from "./containers/NavContainer";
import CreateContainer from "./containers/CreateContainer";
import { connect } from "react-redux";
import UpdateContainer from "./containers/UpdateContainer";

class App extends Component {
  render() {
    var article = null;
    if(this.props.mode === 'CREATE') {
      article = <CreateContainer />
    } else if(this.props.mode === 'READ' || this.props.mode === 'WELCOME') {
      article = <ReadContainer />
    } else if(this.props.mode === 'UPDATE') {
      article = <UpdateContainer />
    }

      return (
        <div className="App">
          <Header />
          <NavContainer />
          <ControlContainer />
          {article}
        </div>
      )
  }
}

export default connect(
  (state) => {
    return ({
      mode: state.mode,
    })
  }
)(App);
