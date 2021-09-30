import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AppLayout from '../components/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';

import { LOAD_MY_INFO_REQUEST, LOAD_POSTS_REQUEST } from '../stringLabel/action';

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } = useSelector((state) => state.post);

  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  useEffect(() => {
    dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    dispatch({
      type: LOAD_POSTS_REQUEST,
    });
  }, []);

  useEffect(() => {
    function onScroll() {
      // console.log(window.scrollY, document.documentElement.clientHeight,
      //   document.documentElement.scrollHeight, hasMorePosts, loadPostsLoading);
      if (window.scrollY + document.documentElement.clientHeight
          > document.documentElement.scrollHeight - 300) {
        if (hasMorePosts && !loadPostsLoading) {
          dispatch({
            type: LOAD_POSTS_REQUEST,
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

export default Home;
