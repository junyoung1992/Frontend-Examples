import React, { Component } from 'react'

export default class Create extends Component {
  render() {
    return (
      <div>
        <form
          action="/create_process" method="post"
          onSubmit={(e) => {
            e.preventDefault();
            this.props.onSubmit(e.target.title.value, e.target.desc.value);
          }}>
          <p>
            <input type='text' name="title" placeholder="title" />
          </p>
          <p>
            <textarea name="desc" placeholder="description" />
          </p>
          <p>
            <input type="submit" />
          </p>
        </form>
      </div>
    )
  }
}
