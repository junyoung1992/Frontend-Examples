import Create from "../components/Create";
import { connect } from "react-redux";

export default connect(
  null,
  (dispatch) => {
    return {
      onSubmit: (title, desc) => {
        dispatch({
          type: 'CREATE_PROCESS',
          title, desc,
        })
      }
    }
  }
)(Create);