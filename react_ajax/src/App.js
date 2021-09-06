import React, { Component } from 'react';

class Nav extends Component {
  render() {
    var listTag = [];

    for(var li of this.props.list) {
      listTag.push(
        <li key={li.id}>
          {/* data-id 는 특수한 속성 - 찾아볼것 */}
          <a href={li.id} data-id={li.id} onClick={function(e) {
            e.preventDefault();
            console.log('trigger');
            // dataset : data-id 의 앞부분을 data 를 의미
            // id : data-id 의 뒷부분 id 를 의미
            this.props.onClick(e.target.dataset.id);
          }.bind(this)}>
            {li.title}
          </a>
        </li>);
    }

    return(
      <nav>
        <ul>{listTag}</ul>
      </nav>
    );
  }
}

class Article extends Component {
  render() {
    return (
      <article>
        <h2>{this.props.title}</h2>
        <p>
          {this.props.desc}
        </p>
      </article>
    );
  }
}

class NowLoading extends Component {
  render() {
    return (
      <div>Now Loading...</div>
    );
  }
}

class App extends Component {
  state = {
    list: {
      isLoading: false,
      items: [],
    },
    article: {
      isLoading: false,
      item: {title: 'Welcome', desc: 'Hello, React & Ajax'},
    },
  };

  // 컴포넌트가 초기화될 때 네트워크 통신을 하기 위한 최적의 메소드
  componentDidMount() {
    var newList = Object.assign({}, this.state.list, {isLoading: true});
    this.setState({list: newList});

    fetch('list.json')
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        this.setState({
          list: {
            isLoading: false,
            items: json
          }
        });
      }.bind(this));
  }

  render() {
    var NavTag = null;
    if(true === this.state.list.isLoading) {
      NavTag = <NowLoading />
    } else {
      NavTag = <Nav
        list={this.state.list.items}
        onClick={function(_id) {
          var newArticle = Object.assign({}, this.state.article, {isLoading: true});
          this.setState({article: newArticle});

          fetch(_id + '.json')
            .then(function(response) {
              return response.json();
            })
            .then(function(json) {
              this.setState({
                article: {
                  isLoading: false,
                  item: {
                    title: json.title,
                    desc: json.desc,
                  }
                }
              })
            }.bind(this));
        }.bind(this)} />
    }

    var ArticleTag = null;
    if(true === this.state.article.isLoading) {
      ArticleTag = <NowLoading />
    } else {
      ArticleTag = <Article
        title={this.state.article.item.title}
        desc={this.state.article.item.desc} />
    }

    return (
      <div className="App">
        <h1>WEB</h1>

        {NavTag}
        {ArticleTag}
      </div>
    )
  }
}

export default App;
