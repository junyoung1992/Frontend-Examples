import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import { END } from 'redux-saga';
import Router from 'next/router';
import axios from 'axios';
import useSWR from 'swr';

import AppLayout from '../components/AppLayout';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';
import wrapper from '../store/configureStore';
import { LOAD_MY_INFO_REQUEST } from '../stringLabel/action';

const fetcher = (url) => axios.get(url, { withCredentials: true })
  .then((result) => result.data);

const Profile = () => {
  const { me } = useSelector((state) => state.user);
  const [followingsLimit, setFollowingsLimit] = useState(3);
  const [followersLimit, setFollowersLimit] = useState(3);

  // Load 성 action 들은 SWR 을 사용해 간단하게 만들 수 있음
  // data, error 둘 다 없으면 loading, data 만 있으면 성공, error 만 있으면 실패
  const { data: followingData, error: followingError } = useSWR(`http://localhost:3065/user/followings?limit=${followingsLimit}`, fetcher);
  const { data: followerData, error: followerError } = useSWR(`http://localhost:3065/user/followers?limit=${followersLimit}`, fetcher);

  // 로그인이 안 된 상태에서는 프로필 페이지에 접근할 수 없음
  useEffect(() => {
    if (!(me && me.id)) {
      Router.push('/');
    }
  }, [me && me.id]);
  if (!me) {
    return null;
  }

  // useEffect(() => {
  //   dispatch({
  //     type: LOAD_FOLLOWINGS_REQUEST,
  //   });
  //   dispatch({
  //     type: LOAD_FOLLOWERS_REQUEST,
  //   });
  // }, []);

  const loadMoreFollowings = useCallback(() => {
    setFollowingsLimit((prev) => prev + 3);
  }, []);

  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit((prev) => prev + 3);
  }, []);

  if (followingError || followerError) {
    console.error(followingError || followerError);
    return '팔로잉/팔로워 로딩 중 에러가 발생하였습니다.';
  }

  return (
    <AppLayout>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <NicknameEditForm />
      <FollowList header="팔로잉 목록" data={followingData} onClickMore={loadMoreFollowings} loading={!followingData && !followingError} />
      <FollowList header="팔로워 목록" data={followerData} onClickMore={loadMoreFollowers} loading={!followerData && !followerError} />
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async ({ req }) => {
    console.log('getServerSideProps start');
    console.log(req.headers);

    const cookie = req ? req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';
    if (req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }

    store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });

    store.dispatch(END);
    console.log('getServerSideProps end');
    await store.sagaTask.toPromise();
  },
);

export default Profile;
