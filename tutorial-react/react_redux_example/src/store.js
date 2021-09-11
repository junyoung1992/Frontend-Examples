import { createStore } from "redux";

var initState = {
  mode: 'WELCOME',
  welcome_content: {
    title: 'WEB',
    desc: 'The World Wide Web (WWW), commonly known as the Web, is an information system where documents and other web resources are identified by Uniform Resource Locators (URLs, such as https://example.com/), which may be interlinked by hyperlinks, and are accessible over the Internet.',
  },
  max_content_id: 3,
  selected_content_id: 0,
  contents: [
    {id: 1, title: 'HTML', desc: 'The HyperText Markup Language, or HTML is the standard markup language for documents designed to be displayed in a web browser.'},
    {id: 2, title: 'CSS', desc: 'Cascading Style Sheets (CSS) is a style sheet language used for describing the presentation of a document written in a markup language such as HTML.'},
    {id: 3, title: 'JavaScript', desc: 'JavaScript, often abbreviated as JS, is a programming language that conforms to the ECMAScript specification.'},
  ]
}

function reducer(state=initState, action) {
  if(action.type === 'WELCOME') {
    return {...state, mode: 'WELCOME', selected_content_id: 0};
  } else if(action.type === 'CREATE') {
    return {...state, mode: 'CREATE'};
  } else if(action.type === 'READ') {
    return {...state, mode: 'READ', selected_content_id: action.id}
  } else if(action.type === 'UPDATE') {
    return {...state, mode: 'UPDATE'};
  } else if(action.type === 'CREATE_PROCESS') {
    var newId = state.max_content_id + 1;
    var newContents = [
      ...state.contents,
      {
        id: newId,
        title: action.title,
        desc: action.desc
      }
    ];

    return {
      ...state,
      contents: newContents,
      max_content_id: newId,
      selected_content_id: newId,
      mode: 'READ',
    };
  } else if(action.type === 'UPDATE_PROCESS') {
    var newContents = [...state.contents];

    for(var i in newContents) {
      if(newContents[i].id === action.id) {
        newContents[i].title = action.title;
        newContents[i].desc = action.desc;
      }
    }

    return {
      ...state,
      contents: newContents,
      selected_content_id: action.id,
      mode: 'READ',
    };
  } else if(action.type === 'DELETE_PROCESS') {
    var newContents = state.contents.filter((e) => {
      if(e.id === state.selected_content_id) {
        return false;
      }
      return true;
    });

    return {
      ...state,
      contents: newContents,
      mode: 'WELCOME',
      selected_content_id: 0,
    }
  }

  return state;
}

export default createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())