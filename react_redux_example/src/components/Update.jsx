import React, { Component } from 'react'

export default class Update extends Component {
  state = {
    id: this.props.id,
    title: this.props.title,
    desc: this.props.desc,
  }

  // 리액트의 특성으로 인해 기설정된 value 값이 바뀌지 않으므로 핸들러를 만들어야 함
  onChangeHandler(e) {
    this.setState({
      // e.target.name = 이벤트가 발생한 태그의 name 값
      [e.target.name]: e.target.value,
    })
  }

  render() {
    return (
      <div>
        <form
          action="/update_process" method="post"
          onSubmit={(e) => {
            e.preventDefault();
            this.props.onSubmit(
              Number(e.target.id.value),
              e.target.title.value,
              e.target.desc.value);
        }}>
          <input type="hidden" name="id" value={this.state.id} />
          <p>
            <input type='text' name="title" placeholder="title" value={this.state.title} onChange={this.onChangeHandler.bind(this)} />
          </p>
          <p>
            <textarea name="desc" placeholder="description" value={this.state.desc} onChange={this.onChangeHandler.bind(this)} />
          </p>
          <p>
            <input type="submit" />
          </p>
        </form>
      </div>
    )
  }
}
