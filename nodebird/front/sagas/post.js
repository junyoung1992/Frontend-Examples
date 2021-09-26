import axios from 'axios';
import { all, call, delay, fork, put, takeEvery, throttle } from 'redux-saga/effects';

import {
  LOAD_POSTS_REQUEST,
  LOAD_POSTS_SUCCESS,
  LOAD_POSTS_FAILURE,
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_POST_FAILURE,
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  REMOVE_POST_FAILURE,
  REMOVE_POST_REQUEST,
  REMOVE_POST_SUCCESS,
  ADD_POST_TO_ME,
  REMOVE_POST_OF_ME,
  LIKE_POST_REQUEST,
  UNLIKE_POST_REQUEST,
  UNLIKE_POST_SUCCESS,
  UNLIKE_POST_FAILURE,
  LIKE_POST_SUCCESS, LIKE_POST_FAILURE,
} from '../stringLabel/action';

function loadPostsAPI(data) {
  return axios.get('/posts', data);
}

function* loadPosts(action) {
  try {
    const result = yield call(loadPostsAPI, action.data);

    yield put({
      type: LOAD_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}

function addPostAPI(data) {
  return axios.post(
    '/post',
    { content: data },
  );
}

function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data);

    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data,
    });
    yield put({
      type: ADD_POST_TO_ME,
      data: result.data.id,
    });
  } catch (err) {
    yield put({
      type: ADD_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function removePostAPI(data) {
  return axios.post(
    '/api/post',
    data,
  );
}

function* removePost(action) {
  try {
    // const result = yield call(removePostAPI);
    yield delay(1000);
    yield put({
      type: REMOVE_POST_SUCCESS,
      data: action.data,
    });
    yield put({
      type: REMOVE_POST_OF_ME,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: REMOVE_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function likePostAPI(data) {
  return axios.patch(`/post/${data}/like`);
}

function* likePost(action) {
  try {
    const result = yield call(likePostAPI, action.data);

    yield put({
      type: LIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LIKE_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function unlikePostAPI(data) {
  return axios.delete(`/post/${data}/like`);
}

function* unlikePost(action) {
  try {
    const result = yield call(unlikePostAPI, action.data);

    yield put({
      type: UNLIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: UNLIKE_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function addCommentAPI(data) {
  return axios.post(
    `/post/${data.postId}/comment`,
    data,
  );
}

function* addComment(action) {
  try {
    const result = yield call(addCommentAPI, action.data);

    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchLoadPosts() {
  // 별도 로직이 없으면 REQUEST 가 연속적으로 생성됨
  // loadPostsLoading = true 일 때만 호출하도록 dispatch 수정
  // yield takeEvery(LOAD_POSTS_REQUEST, loadPosts);

  // REQUEST 를 취소하지는 않아서, 하나 SUCCESS 한 다음 2초 후에 다른 하나가 SUCCESS 함
  yield throttle(5000, LOAD_POSTS_REQUEST, loadPosts);
}

function* watchAddPost() {
  yield takeEvery(ADD_POST_REQUEST, addPost);
  // throttle: 입력한 시간 내에는 한 번에 요청만 보낼 수 있음
  // yield throttle('ADD_POST_REQUEST', addPost, 10000);
}

function* watchRemovePost() {
  yield takeEvery(REMOVE_POST_REQUEST, removePost);
}

function* watchLikePost() {
  yield takeEvery(LIKE_POST_REQUEST, likePost);
}

function* watchUnlikePost() {
  yield takeEvery(UNLIKE_POST_REQUEST, unlikePost);
}

function* watchAddComment() {
  yield takeEvery(ADD_COMMENT_REQUEST, addComment);
}

export default function* postSaga() {
  yield all([
    fork(watchLoadPosts),
    fork(watchAddPost),
    fork(watchRemovePost),
    fork(watchLikePost),
    fork(watchUnlikePost),
    fork(watchAddComment),
  ]);
}
