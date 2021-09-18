import { all, delay, fork, put, takeEvery, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

import {
  LOG_IN_FAILURE, LOG_IN_REQUEST, LOG_IN_SUCCESS,
  LOG_OUT_FAILURE, LOG_OUT_REQUEST, LOG_OUT_SUCCESS,
  SIGN_UP_FAILURE, SIGN_UP_REQUEST, SIGN_UP_SUCCESS,
} from '../stringLabel/action';

function logInAPI(data) {
  return axios.post('/api/login', data);
}

function logOutAPI(data) {
  return axios.post('/api/logout', data);
}

function signUpAPI(data) {
  return axios.post('/api/signup', data);
}

function* logIn(action) {
  try {
    console.log('saga logIn');
    // const result = yield call(logInAPI, action.data);  // call 은 동기. 요청을 보내고 결과가 올 때 까지 기다림
    yield delay(1000);
    yield put({
      type: LOG_IN_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: LOG_IN_FAILURE,
      error: err.response.data, // 실패 결과는 err.response.data 에 저장됨
    });
  }
}

function* logOut() {
  try {
    console.log('saga logOut');
    // const result = yield call(logOutAPI);
    yield delay(1000);
    yield put({
      type: LOG_OUT_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: LOG_OUT_FAILURE,
      error: err.response.data,
    });
  }
}

function* signUp() {
  try {
    console.log('saga signUp');
    // const result = yield call(signUpAPI);
    yield delay(1000);
    yield put({
      type: SIGN_UP_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: SIGN_UP_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchLogin() {
  // while(true) { // take 는 일회용이므로 while 과 섞어서 사용하기도 함 (동기적으로 동작)
  //   yield take('LOG_IN_REQUEST', logIn); // take: LOG_IN 이라는 액션이 실행될 때까지 기다림
  // }
  // yield takeEvery('LOG_IN_REQUEST', logIn); // takeEvery: 비동기

  // takeLatest: 앞에 실행한 (완료되지 못한) 것을 무시하고 가장 마지막 요청만 실행
  // 응답은 취소하지만 요청을 취소하지는 못하므로, 백엔드에서 중복 요청에 대한 처리 방법이 존재해야 함
  yield takeLatest(LOG_IN_REQUEST, logIn);
}

function* watchLogOut() {
  yield takeEvery(LOG_OUT_REQUEST, logOut);
}

function* watchSignUp() {
  yield takeEvery(SIGN_UP_REQUEST, signUp);
}

export default function* userSaga() {
  yield all([
    fork(watchLogin), // fork 와 call 의 차이를 알아야 함
    fork(watchLogOut), // fork 는 비동기. 요청을 보내고 결과를 기다리지 않고 진행
    fork(watchSignUp),
  ]);
}
