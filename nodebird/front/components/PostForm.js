import React, { useCallback, useEffect, useRef } from 'react';
import { Button, Form, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { addPostRequestAction } from '../reducers/post';
import useInput from '../hooks/useInput';
import { UPLOAD_IMAGES_REQUEST } from '../stringLabel/action';

const PostForm = () => {
  const dispatch = useDispatch();

  const { imagePaths, addPostDone } = useSelector((state) => state.post);

  const [text, onChangeText, setText] = useInput('');

  useEffect(() => {
    if (addPostDone) { // onSubmit 후 setText('') 을 실행하면, 정상적으로 게시글이 업로드가 되지 못해도 입력창이 초기화됨
      setText('');
    }
  }, [addPostDone]);

  const onSubmit = useCallback(() => {
    dispatch(addPostRequestAction(text));
  }, [text]);

  const imageInput = useRef();
  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onChangeImages = useCallback((e) => {
    console.log('images', e.target.files);

    const imageFormData = new FormData(); // FormData 를 사용하면 multipart 데이터로 보낼 수 있음
    [].forEach.call(e.target.files, (f) => {
      // e.target.files 는 foreach 를 쓸 수 없어서 배열, [] 의 foreach 를 다음과 같은 형식으로 빌려 씀
      imageFormData.append('image', f);
    });

    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  }, []);

  return (
    // 파일, 이미지, 영상 등이 multipart 타입으로 업로드 됨
    <Form style={{ margin: '10px 0 20px' }} encType="multipart/form-data" onFinish={onSubmit}>
      <Input.TextArea
        value={text}
        onChange={onChangeText}
        maxLength={140}
        placeholder="어떤 신기한 일이 있었나요?"
      />
      <div>
        <input type="file" name="image" multiple hidden ref={imageInput} onChange={onChangeImages} />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button type="primary" style={{ float: 'right' }} htmlType="submit">트윗</Button>
      </div>
      <div>
        {imagePaths.map((v) => (
          <div key={v} style={{ display: 'inline-block' }}>
            <img src={v} style={{ width: '200px' }} alt={v} />
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;
