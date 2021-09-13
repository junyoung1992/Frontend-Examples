import React, { Component } from 'react'

export default class Control extends Component {
  render() {
    var controller = [];

    controller.push(
      <li>
        <a href="/create" onClick={(e) => {
          e.preventDefault();
          this.props.onClick('CREATE');
        }}>create</a>
      </li>
    );

    if(this.props.selected_content_id !== 0) {
      controller.push(
        <li>
          <a href="/update" onClick={(e) => {
            e.preventDefault();
            this.props.onClick('UPDATE');
          }}>update</a>
        </li>
      );
      controller.push(
        <li>
          <input type="button" value="delete" onClick={(e) => {
            e.preventDefault();
            this.props.onClick('DELETE_PROCESS');
          }} />
        </li>
      );
    }

    return (
      <div>
        <ul>
          {/* <li>
            <a href="/create" onClick={(e) => {
              e.preventDefault();
              this.props.onClick('CREATE');
            }}>create</a>
          </li>
          <li>
            <a href="/update" onClick={(e) => {
              e.preventDefault();
              this.props.onClick('UPDATE');
            }}>update</a>
          </li>
          <li>
            <input type="button" value="delete" onClick={(e) => {
              e.preventDefault();
              this.props.onClick('DELETE_PROCESS');
            }} />
          </li> */}
          {controller}
        </ul>
      </div>
    )
  }
}
