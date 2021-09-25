import { all, call, delay, fork, put, takeEvery, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

import {
  FOLLOW_FAILURE, FOLLOW_REQUEST, FOLLOW_SUCCESS,
  UNFOLLOW_FAILURE, UNFOLLOW_REQUEST, UNFOLLOW_SUCCESS,
  LOG_IN_FAILURE, LOG_IN_REQUEST, LOG_IN_SUCCESS,
  LOG_OUT_FAILURE, LOG_OUT_REQUEST, LOG_OUT_SUCCESS,
  SIGN_UP_FAILURE, SIGN_UP_REQUEST, SIGN_UP_SUCCESS, LOAD_MY_INFO_REQUEST, LOAD_MY_INFO_SUCCESS, LOAD_MY_INFO_FAILURE,
} from '../stringLabel/action';

function followAPI(data) {
  return axios.post('/follow', data);
}

function unfollowAPI(data) {
  return axios.post('/unfollow', data);
}

function loadMyInfoAPI() {
  return axios.get('/user');
}

function* loadMyInfo() {
  try {
    const result = yield call(loadMyInfoAPI); // call 은 동기. 요청을 보내고 결과가 올 때 까지 기다림
    console.log(result);

    yield put({
      type: LOAD_MY_INFO_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_MY_INFO_FAILURE,
      error: err.response.data,
    });
  }
}

function logInAPI(data) {
  return axios.post('/user/login', data);
}

function* logIn(action) {
  try {
    const result = yield call(logInAPI, action.data); // call 은 동기. 요청을 보내고 결과가 올 때 까지 기다림
    console.log(result);

    yield put({
      type: LOG_IN_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOG_IN_FAILURE,
      error: err.response.data, // 실패 결과는 err.response.data 에 저장됨
    });
  }
}

function logOutAPI() {
  return axios.post('/user/logout');
}

function* logOut() {
  try {
    yield call(logOutAPI);
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

function signUpAPI(data) {
  return axios.post('/user', data);
}

function* signUp(action) {
  try {
    const result = yield call(signUpAPI, action.data);
    console.log(result);

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

function* follow(action) {
  try {
    // const result = yield call(signUpAPI);
    yield delay(1000);
    yield put({
      type: FOLLOW_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: FOLLOW_FAILURE,
      error: err.response.data,
    });
  }
}

function* unfollow(action) {
  try {
    // const result = yield call(signUpAPI);
    yield delay(1000);
    yield put({
      type: UNFOLLOW_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: UNFOLLOW_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchLoadMyInfo() {
  yield takeEvery(LOAD_MY_INFO_REQUEST, loadMyInfo);
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

function* watchFollow() {
  yield takeEvery(FOLLOW_REQUEST, follow);
}

function* watchUnfollow() {
  yield takeEvery(UNFOLLOW_REQUEST, unfollow);
}

export default function* userSaga() {
  yield all([
    fork(watchLoadMyInfo),
    fork(watchLogin), // fork 와 call 의 차이를 알아야 함
    fork(watchLogOut), // fork 는 비동기. 요청을 보내고 결과를 기다리지 않고 진행
    fork(watchSignUp),
    fork(watchFollow),
    fork(watchUnfollow),
  ]);
}
