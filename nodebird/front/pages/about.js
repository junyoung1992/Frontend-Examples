import React from 'react';
import { Avatar, Card } from 'antd';
import { useSelector } from 'react-redux';
import Head from 'next/head';
import { END } from 'redux-saga';

import AppLayout from '../components/AppLayout';
import wrapper from '../store/configureStore';
import { LOAD_USER_REQUEST } from '../stringLabel/action';

const About = () => {
  const { userInfo } = useSelector((state) => state.user);

  return (
    <AppLayout>
      <Head>
        <title>Kim Junyoung | NodeBird</title>
      </Head>
      {userInfo
        ? (
          <Card
            actions={[
              // 남의 정보를 가져올 때는 조심해야 함 - 개인정보!!
              // 게시글, 팔로잉, 팔로워 정보를 다 가져오지 않고, 서버에서 length 를 계산해서 전달하기로 함
              <div key="twit">트윗<br />{userInfo.Posts}</div>,
              <div key="followings">팔로잉<br />{userInfo.Followings}</div>,
              <div key="followers">팔로워<br />{userInfo.Followers}</div>,
            ]}
          >
            <Card.Meta
              avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
              title={userInfo.nickname}
              description="노드버드 매니아"
            />
          </Card>
        )
        : null}
    </AppLayout>
  );
};

// getStaticProps 를 활용한 서버사이드 렌더링
// 언제 접속해도 데이터가 변할 일이 없으면 getStaticProps 를 사용하고
// (빌드할 때 미리 서버사이드 렌더링을 해서 html 을 제공)
// 접속할 때마다 접속한 상황에 맞게 데이터가 변해야 한다면 getServerSideProps 를 사용한다
// (페이지에 방문했을 때 서버사이드 렌더링)
export const getStaticProps = wrapper.getStaticProps(
  (store) => async () => {
    console.log('getStaticProps start');

    store.dispatch({
      type: LOAD_USER_REQUEST,
      data: 1,
    });

    store.dispatch(END);
    console.log('getStaticProps end');
    await store.sagaTask.toPromise();
  },
);

export default About;
