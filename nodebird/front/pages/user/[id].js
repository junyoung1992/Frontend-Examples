import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga';
import axios from 'axios';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Avatar, Card } from 'antd';

import AppLayout from '../../components/AppLayout';
import PostCard from '../../components/PostCard';
import wrapper from '../../store/configureStore';
import {
  LOAD_MY_INFO_REQUEST,
  LOAD_USER_POSTS_REQUEST,
  LOAD_USER_REQUEST,
} from '../../stringLabel/action';

const User = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const { userInfo, me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } = useSelector(
    (state) => state.post,
  );

  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY + document.documentElement.clientHeight
        > document.documentElement.scrollHeight - 300) {
        if (hasMorePosts && !loadPostsLoading) {
          dispatch({
            type: LOAD_USER_POSTS_REQUEST,
            data: id,
            lastId: mainPosts[mainPosts.length - 1]?.id,
          });
        }
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePosts, loadPostsLoading]);

  return (
    <AppLayout>
      {userInfo && (
        <Head>
          <title>
            {userInfo.nickname}
            님의 글
          </title>
          <meta name="description" content={`${userInfo.nickname}님의 게시글`} />
          <meta property="og:title" content={`${userInfo.nickname}님의 게시글`} />
          <meta property="og:description" content={`${userInfo.nickname}님의 게시글`} />
          <meta property="og:image" content="https://nodebird.com/favicon.ico" />
          <meta property="og:url" content={`https://nodebird.com/user/${id}`} />
        </Head>
      )}
      {userInfo && userInfo.id !== me?.id
        ? (
          <Card
            style={{ marginBottom: 20 }}
            actions={[
              <div key="twit">
                짹짹
                <br />
                {userInfo.Posts}
              </div>,
              <div key="following">
                팔로잉
                <br />
                {userInfo.Followings}
              </div>,
              <div key="follower">
                팔로워
                <br />
                {userInfo.Followers}
              </div>,
            ]}
          >
            <Card.Meta
              avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
              title={userInfo.nickname}
            />
          </Card>
        )
        : null}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayout>
  );
};

// dynamic routing 을 사용할 때 getServerSideProps 를 쓰고 싶으면 getStaticPaths 을 함께 사용해야 함
// html 로 미리 빌드해두기 때문에 서빙 속도가 빠름
// 하지만 일반적인 경우 사용하기 어려움
// export async function getStaticPaths() {
//   return {
//     paths: [
//       { params: { id: '1' } },
//       { params: { id: '2' } },
//       { params: { id: '3' } },
//     ],
//     fallback: false,
//   };
// }

// export const getStaticProps = wrapper.getServerSideProps(
//   (store) => async ({ req, res, params }) => {
//     console.log('getStaticProps start');
//
//     const cookie = req ? req.headers.cookie : '';
//     axios.defaults.headers.Cookie = '';
//     if (req && cookie) {
//       axios.defaults.headers.Cookie = cookie;
//     }
//
//     store.dispatch({
//       type: LOAD_MY_INFO_REQUEST,
//     });
//     store.dispatch({
//       type: LOAD_USER_REQUEST,
//       data: params.id,
//     });
//     store.dispatch({
//       type: LOAD_USER_POSTS_REQUEST,
//       data: params.id,
//     });
//
//     store.dispatch(END);
//     console.log('getStaticProps end');
//     await store.sagaTask.toPromise();
//   },
// );

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async ({ req, res, params }) => {
    // console.log('getServerSideProps start');
    // console.log(req.headers);

    const cookie = req ? req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';
    if (req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }

    store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    store.dispatch({
      type: LOAD_USER_REQUEST,
      data: params.id,
    });
    store.dispatch({
      type: LOAD_USER_POSTS_REQUEST,
      data: params.id,
    });

    store.dispatch(END);
    // console.log('getServerSideProps end');
    await store.sagaTask.toPromise();
  },
);

export default User;
