import React, { Component } from 'react'

export default class Nav extends Component {
  render() {
    var tags = [];

    for(var tag of this.props.data) {
      tags.push(<li key={tag.id}><a href="#" data-id={tag.id} onClick={(e) => {
        this.props.onClick(Number(e.target.dataset.id));
      }}>{tag.title}</a></li>);
    }

    return (
      <div>
        <nav>
          <ol>{tags}</ol>
        </nav>
      </div>
    )
  }
}
