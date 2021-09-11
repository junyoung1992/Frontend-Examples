import Control from "../components/Control";
import { connect } from "react-redux";

export default connect(
  (state) => {
    return {selected_content_id: state.selected_content_id,}
  },
  (dispatch) => {
    return {
      onClick: (mode) => {
        if(mode === 'DELETE_PROCESS') {
          if(!window.confirm('Really?')) {
            return;
          }
        }

        dispatch({type: mode,})
      },
    }
  }
)(Control);