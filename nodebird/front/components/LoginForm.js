import React, { useCallback, useMemo } from "react";
import { Form, Input, Button } from 'antd';
import Link from "next/link";
import styled from "styled-components";
import { useDispatch } from "react-redux";

import useInput from "../hooks/useInput";
import { loginAction } from "../reducers/user";

const ButtonWrapper = styled.div`
  margin-top: 10px;
`;

const FormWrapper = styled(Form)`
  padding: 10px;
`;

const LoginForm = () => {
  const dispatch = useDispatch();

  // useInput 이라는 Custom Hook 을 만들어서 반복 코딩을 줄임
  const [id, onChangeId] = useInput('');
  const [password, onChangePassword] = useInput('');

  const style = useMemo(() => ({ marginTop: 10 }), []);

  const onSubmitForm = useCallback(() => {
    // onFinish 는 e.preventDefault() 가 기본으로 적용되어 있음 - ant design
    console.log(id, password);
    dispatch(loginAction({ id, password }));
  }, [id, password]);

  return (
    <FormWrapper onFinish={onSubmitForm}>
      <div>
        <label htmlFor="user-id">아이디 </label>
        <br />
        <Input name="user-id" value={id} onChange={onChangeId} required />
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <Input
          name="user-password"
          type="password"
          value={password}
          onChange={onChangePassword}
          required />
      </div>

      {/*
        style 에 객체를 넣으면 조회할 때마다 매번 리렌더링 됨
        성능에 큰 영향이 없다면 인라인 스타일을 써도 되나, 여기선 styled-component 사용해 css 적용
        useMemo 를 사용해도 됨
       */}
      {/* <div style={{ marginTop: 10 }}> */}
      <ButtonWrapper>
        <Button type="primary" htmlType="submit" loading={false}>로그인</Button>
        <Link href="/signup"><a><Button>회원가입</Button></a></Link>
      </ButtonWrapper>
    </FormWrapper>
  )
};

export default LoginForm;