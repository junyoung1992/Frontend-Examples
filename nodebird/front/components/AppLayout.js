import React from "react";
import PropTypes from 'prop-types';
import Link from 'next/link';

const AppLayout = ({ children }) => {
  return (
    <div>
      <div>
        <Link href="/"><a>노드버드</a></Link>
        <Link href="/profile"><a>프로필</a></Link>
        <Link href="/signup"><a>회원가입</a></Link>
      </div>
      { children }
    </div>
  );
};

// Prop 데이터의 타입 체크
AppLayout.propTypes = {
  children: PropTypes.node.isRequired,  // react 의 노드
};

export default AppLayout;