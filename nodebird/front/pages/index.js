import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga';
import axios from 'axios';

import AppLayout from '../components/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';

import wrapper from '../store/configureStore';
import { LOAD_MY_INFO_REQUEST, LOAD_POSTS_REQUEST } from '../stringLabel/action';

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } = useSelector(
    (state) => state.post,
  );

  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  // 화면이 구성된 다음 프론트 서버에서 백엔드 서버로부터 데이터를 받아오기 때문에 데이터의 공백이 발생함
  // 서버사이드 렌더링을 사용해 화면이 구성될 때 데이터도 함께 구성할 수 있음
  // useEffect(() => {
  //   dispatch({
  //     type: LOAD_MY_INFO_REQUEST,
  //   });
  //   dispatch({
  //     type: LOAD_POSTS_REQUEST,
  //   });
  // }, []);

  useEffect(() => {
    function onScroll() {
      // console.log(window.scrollY, document.documentElement.clientHeight,
      //   document.documentElement.scrollHeight, hasMorePosts, loadPostsLoading);
      if (window.scrollY + document.documentElement.clientHeight
          > document.documentElement.scrollHeight - 300) {
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
          });
        }
      }
    }

    window.addEventListener('scroll', onScroll);

    // addEventListener 를 하면 removeEventListener 로 꼭 해제해야 함
    // 안 그러면 메모리에 이벤트가 계속 쌓임
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePosts, loadPostsLoading]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {/*
        반복문 출력이 변경될 수 있다면 index 로 key 값을 설정하면 안됨
        post 안에 설정된 id를 사용하면 변경시에도 문제 없음
      */}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayout>
  );
};

// getServerSideProps 를 사용해 Home 보다 먼저 실행 가능 -> 서버사이드 렌더링
// 브라우저를 거치지 않고 프론트 서버에서 백엔드 서버에 데이터를 요청, 수신함
// wrapper 는 '../store/configureStore' 에 만든 wrapper 임
// export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
//   console.log('context', context);
//
//   context.store.dispatch({
//     type: LOAD_MY_INFO_REQUEST,
//   });
//   context.store.dispatch({
//     type: LOAD_POSTS_REQUEST,
//   });
//
//   // REQUEST 가 SUCCESS 로 바뀔 때까지 기다림
//   context.store.dispatch(END);
//   await context.store.sagaTask.toPromise();
// });
// next-redux-wrapper 가 6에서 7로 업그레이드 되면서 강의와 조금 달라짐
// https://github.com/kirill-konshin/next-redux-wrapper#upgrade-from-6x-to-7x
export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async ({ req }) => {
    console.log('getServerSideProps start');
    // console.log(req.headers);

    // 브라우저를 거치지 않고 프론트 서버와 백엔드 서버가 직접 통신하므로 쿠키가 전달되지 않음
    // 아래와 같이 작성해야 서버에 쿠키를 전달할 수 있음
    const cookie = req ? req.headers.cookie : '';
    // getServerSideProps 는 서버에서 작동하므로 사용자간에 쿠키가 공유되는 문제가 생길 수 있음
    // 이를 피하기 위해 쿠키를 써서 보낼 때만 쿠키를 기입하고 그렇지 않을 때는 쿠키를 초기화 해야 함
    axios.defaults.headers.Cookie = '';
    if (req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }

    store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    store.dispatch({
      type: LOAD_POSTS_REQUEST,
    });

    // REQUEST 가 SUCCESS 로 바뀔 때까지 기다림
    store.dispatch(END);
    console.log('getServerSideProps end');
    await store.sagaTask.toPromise();

    // return 을 사용하면 SWR 도 SSR 사용 가능
  },
);

export default Home;
