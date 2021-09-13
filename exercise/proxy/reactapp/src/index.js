import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class App extends Component {
  render() {
    return(
      <div>
        <input
          type="button"
          value="get data"
          onClick={function() {
            // package.json 에 "proxy": "http://127.0.0.1:8000" 를 추가해서
            // port 3000 서버가 아닌 port 8000 서버에서 data.json 을 가져옴
            fetch('/data.json')
              .then(function(response) {return response.json();})
              .then(function(json) {console.log(json);})
          }} />
      </div>
    ); 
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
