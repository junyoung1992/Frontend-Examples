import React, { useCallback, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import useInput from '../hooks/useInput';
import { ADD_COMMENT_REQUEST } from '../stringLabel/action';

const CommentForm = ({ post }) => {
  const dispatch = useDispatch();

  const id = useSelector((state) => state.user.me?.id);
  const { addCommentDone } = useSelector((state) => state.post);
  const [commentText, onChangeCommentText, setText] = useInput('');

  useEffect(() => {
    if (addCommentDone) { // onSubmit 후 setText('') 을 실행하면, 정상적으로 게시글이 업로드가 되지 못해도 입력창이 초기화됨
      setText('');
    }
  }, [addCommentDone]);

  const onSubmitComment = useCallback(() => {
    console.log(post.id, commentText);
    dispatch({
      type: ADD_COMMENT_REQUEST,
      data: {
        content: commentText,
        postId: post.id,
        userId: id,
      },
    });
  }, [commentText, id]);

  return (
    <Form onFinish={onSubmitComment}>
      <Form.Item style={{ position: 'relative', margin: 0 }}>
        <Input.TextArea value={commentText} onChange={onChangeCommentText} rows={4} />
        <Button style={{ position: 'absolute', right: 0, bottom: -40 }} type="primary" htmlType="submit">댓글</Button>
      </Form.Item>
    </Form>
  );
};

CommentForm.propTypes = {
  post: PropTypes.object.isRequired,
};

export default CommentForm;
