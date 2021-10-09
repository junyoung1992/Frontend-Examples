import { createWrapper } from 'next-redux-wrapper';
import { applyMiddleware, compose, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

import reducer from '../reducers';
import rootSaga from '../sagas';

// thunk 에 착안해서 여러 커스텀 미들웨어를 만들 수도 있음
const loggerMiddleware = ({ dispatch, getState }) => (next) => (action) => {
  console.log(action); // 액션을 실행하기 전에 console.log 를 한 번 찍어주는 미들웨어
  return next(action);
};

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();

  const enhancer = process.env.NODE_ENV === 'production'
    ? compose(applyMiddleware(sagaMiddleware))
    : composeWithDevTools(applyMiddleware(sagaMiddleware, loggerMiddleware));

  const store = createStore(reducer, enhancer);
  store.sagaTask = sagaMiddleware.run(rootSaga);

  return store;
};

const wrapper = createWrapper(configureStore, {
  debug: process.env.NODE_ENV === 'development',
});

export default wrapper;
