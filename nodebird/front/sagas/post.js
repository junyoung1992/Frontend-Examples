import axios from 'axios';
import { all, delay, fork, put, takeEvery } from 'redux-saga/effects';

import {
  ADD_COMMENT_FAILURE, ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS,
  ADD_POST_FAILURE, ADD_POST_REQUEST, ADD_POST_SUCCESS,
} from '../stringLabel/action';

function addPostAPI(data) {
  return axios.post('/api/post', data);
}

function addCommentAPI(data) {
  return axios.post(`/api/post/${data.postId}/comment`, data);
}

function* addPost() {
  try {
    // const result = yield call(addPostAPI);
    yield delay(1000);
    yield put({
      type: ADD_POST_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: ADD_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function* addComment() {
  try {
    // const result = yield call(addCommentAPI);
    yield delay(1000);
    yield put({
      type: ADD_COMMENT_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchAddPost() {
  yield takeEvery(ADD_POST_REQUEST, addPost);
  // throttle: 입력한 시간 내에는 한 번에 요청만 보낼 수 있음
  // yield throttle('ADD_POST_REQUEST', addPost, 10000);
}

function* watchAddComment() {
  yield takeEvery(ADD_COMMENT_REQUEST, addComment);
}

export default function* postSaga() {
  yield all([
    fork(watchAddPost),
    fork(watchAddComment),
  ]);
}
