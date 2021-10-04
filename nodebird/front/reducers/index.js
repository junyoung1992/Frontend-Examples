import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';

import user from './user';
import post from './post';

// combineReducers를 사용해 복수의 분할된 리듀서를 병합
const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE: // 추후 Redux SSR을 위해 HYDRATE 추가
      console.log('HYDRATE', action);
      return action.payload;
    default: {
      // user 안에 user의 initialState, post 안에 post의 initialState를 combineReducers가 알아서 넣어줌
      const combinedReducer = combineReducers({
        user,
        post,
      });
      return combinedReducer(state, action);
    }
  }
};

export default rootReducer;
