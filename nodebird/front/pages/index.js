import React from 'react';
import {useSelector} from "react-redux";

import AppLayout from '../components/AppLayout';
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";

const Home = () => {
  const { isLoggedIn } = useSelector((state) => state.user);
  const { mainPosts } = useSelector((state) => state.post);
  
  return (
    <AppLayout>
      {isLoggedIn && <PostForm />}
      {/*
        반복문 출력이 변경될 수 있다면 index 로 key 값을 설정하면 안됨
        post 안에 설정된 id를 사용하면 변경시에도 문제 없음
      */}
      {mainPosts.map((post) => <PostCard key={post.id} post={post} />)}
    </AppLayout>
  );
};

export default Home;
