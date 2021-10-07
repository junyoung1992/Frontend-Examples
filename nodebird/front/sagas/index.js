/*
 * Generator: function* ()
 *   function 뒤에 *를 붙이면 제너레이터 생성
 *   중단점 (yield) 가 있는 함수
 */

import { all, fork } from 'redux-saga/effects';
import axios from 'axios';

import postSaga from './post';
import userSaga from './user';
import { backUrl } from '../config/config';

axios.defaults.baseURL = backUrl;
axios.defaults.withCredentials = true; // 요청 메시지를 보낼 때 쿠키도 함께 전송

export default function* rootSaga() {
  yield all([ // all: 배열 안에 있는 모든 것을 다 실행
    fork(postSaga), // fork 와 call 의 차이를 알아야 함
    fork(userSaga), // fork 는 비동기. 요청을 보내고 결과를 기다리지 않고 진행
  ]);
}
