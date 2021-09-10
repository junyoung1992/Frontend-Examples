import { connect } from "react-redux";
import Read from "../components/Read";

export default connect(
  (state) => {
    var title, desc;

    if(state.mode === 'WELCOME') {
      title = state.welcome_content.title;
      desc = state.welcome_content.desc;
    } else if(state.mode === 'READ'){
      for(var content of state.contents) {
        if(content.id === state.selected_content_id) {
          title = content.title;
          desc = content.desc;
          break;
        }
      }
    }
    
    return { title, desc }
  }
)(Read);