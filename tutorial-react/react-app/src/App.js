import React, { Component } from 'react';
import Subject from './components/Subject';
import TOC from './components/TOC';
import Control from './components/Control';
import ReadContent from './components/ReadContent';
import CreateContent from './components/CreateContent';
import UpdateContent from './components/UpdateContent';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.max_content_id = 3;
    this.state = {
      mode: 'create',
      selected_content_id: 2,
      subject: {title: 'WEB', sub: 'World Wide Web!'},
      welcome: {title: 'Welcome', desc: 'Hello React!!!'},
      contents: [
        {id: 1, title: 'HTML', desc: 'HTML is HyperText Markup Language.'},
        {id: 2, title: 'CSS', desc: 'CSS is for design.'},
        {id: 3, title: 'JavaScript', desc: 'JavaScript is for interactive.'}
      ]
    }
  }

  getReadContent() {
    for(var i = 0; i < this.state.contents.length; i++) {
      var data = this.state.contents[i];

      if(data.id === this.state.selected_content_id) {
        return data;
      }
    }
  }

  getContent() {
    var _title, _desc, _article = null;
    
    if(this.state.mode === 'welcome') {
      _title = this.state.welcome.title;
      _desc = this.state.welcome.desc;

      _article = <ReadContent title={_title} desc={_desc} />
    } else if(this.state.mode === 'read') {
      let _content = this.getReadContent();

      _article = <ReadContent title={_content.title} desc={_content.desc} />
    } else if(this.state.mode === 'create') {
      _article = <CreateContent onSubmit={function(_title, _desc) {
        // add content to this.state.content
        this.max_content_id++;

        // push를 사용하면 this.state.contents 원본을 변환하므로,
        // shouldComponentUpdate 에서 newProps.data와 this.props.data 가 같아짐 -> 튜닝이 어려움
        // this.state.contents.push({id: this.max_content_id, title: _title, desc: _desc});
        
        // Array.from 으로 복제한 다음 push 하거나 concat 을 사용하면 됨
        //    - 배열: var newArray = Array.from(originalArray);
        //    - 객체: var newObject = Object.assign({}, originalObject);
        // var newContents = Array.from(this.state.contents);
        // newContents.push({id: this.max_content_id, title: _title, desc: _desc});
        var _contents = this.state.contents.concat(
          {id: this.max_content_id, title: _title, desc: _desc}
        );

        this.setState({
          mode: "read",
          selected_content_id: this.max_content_id,
          contents: _contents,
        });
      }.bind(this)}/>
    } else if(this.state.mode === 'update') {
      let _content = this.getReadContent();
      _article = <UpdateContent data={_content} onSubmit={function(_id, _title, _desc) {
        var _contents = Array.from(this.state.contents);

        for(var i = 0; i< _contents.length; i++) {
          if(_contents[i].id === _id) {
            _contents[i] = {id: _id, title: _title, desc: _desc};
            break;
          }
        }

        this.setState({
          mode: "read",
          contents: _contents,
        });
      }.bind(this)}/>
    }

    return _article;
  }

  render() {
    console.log('App render');
    
    return (  
      <div className="App">
        <Subject
          title={this.state.subject.title}
          sub={this.state.subject.sub}
          onChangePage={function() {
            this.setState({mode: 'welcome'});
          }.bind(this)}
        />

        <TOC
          data={this.state.contents}
          onChangePage={function(_id) {
            this.setState({
              mode: 'read',
              selected_content_id: Number(_id)});
          }.bind(this)}
        />

        <Control
          onChangeMode={function(_mode) {
            if(_mode === 'delete') {
              if(window.confirm('Really?')) {
                var _contents = Array.from(this.state.contents);

                for(var i = 0; i < _contents.length; i++) {
                  if(_contents[i].id === this.state.selected_content_id) {
                    _contents.splice(i, 1);
                    break;
                  }
                }
                
                this.setState({
                  mode: 'welcome',
                  contents: _contents
                })

                alert("Delete!");
              }
            } else {
              this.setState({
                mode: _mode,
              })
            }
          }.bind(this)}
        />

        {this.getContent()}
      </div>
    );
  }
}

export default App;
