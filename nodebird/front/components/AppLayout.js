import React from "react";
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Menu, Input, Row, Col } from 'antd';
import styled from "styled-components";
import { useSelector } from 'react-redux';

import UserProfile from "../components/UserProfile";
import LoginForm from "../components/LoginForm";

const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;

const AppLayout = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item>
          <Link href="/"><a>노드버드</a></Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/profile"><a>프로필</a></Link>
        </Menu.Item>
        <Menu.Item>
          <SearchInput enterButton />
        </Menu.Item>
        <Menu.Item>
          <Link href="/signup"><a>회원가입</a></Link>
        </Menu.Item>
      </Menu>

      {/* 그리드: 24분할 */}
      <Row gutter={8}>
        {/* xs: 모바일, sm: 태블릿, md: 작은 데스크탑, ... */}
        <Col xs={24} md={6}>
          { isLoggedIn ? <UserProfile /> : <LoginForm /> }
        </Col>
        <Col xs={24} md={12}>
          { children }
        </Col>
        <Col xs={24} md={6}>
          <a href="https://www.junyoung.xyz" target="_blank" rel="noreferrer noopener">Made by Kim Junyoung</a>
        </Col>
      </Row>
    </div>
  );
};

// Prop 데이터의 타입 체크
AppLayout.propTypes = {
  children: PropTypes.node.isRequired,  // react 의 노드
};

export default AppLayout;