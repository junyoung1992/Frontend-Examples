import Nav from "../components/Nav";
import { connect } from "react-redux";

export default connect(
  (state) => {
    return {data: state.contents,}
  },
  (dispatch) => {
    return {
      onClick: (_id) => {
        dispatch({
          type: 'READ',
          id: _id,
        });
      }
    }
  }
)(Nav)