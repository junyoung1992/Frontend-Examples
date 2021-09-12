/**
 * _app.js 는 pages 희 공통 부분
 * Component 에 index.js return 부분이 들어감
 * _app.js 가 index.js 의 부모인 셈
 * 따라서 공통적으로 들어가는 것들을 적어주면 됨
 */

import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head'
import 'antd/dist/antd.css';

const NodeBird = ({ Component }) => {
  return (
    <>
      <Head>
        {/* head 부분을 수정하기 위한 Next의 컴포넌트 */}
        <meta charSet="utf-8" />
        <title>NodeBird</title>
      </Head>
      <Component />
    </>
  )
};

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
}

export default NodeBird;