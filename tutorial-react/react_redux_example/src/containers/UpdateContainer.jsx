import { connect } from "react-redux";
import Update from "../components/Update";

export default connect(
  (state) => {
    var id, title, desc;

    for (var content of state.contents) {
      if (content.id === state.selected_content_id) {
        id = content.id;
        title = content.title;
        desc = content.desc;
        break;
      }
    }

    return { id, title, desc }
  },
  (dispatch) => {
    return {
      onSubmit: (id, title, desc) => {
        dispatch({
          type: 'UPDATE_PROCESS',
          id, title, desc,
        });
      },
    }
  }
)(Update);