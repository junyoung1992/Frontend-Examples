import React, { useCallback, useEffect, useRef } from 'react';
import { Button, Form, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import useInput from '../hooks/useInput';
import { UPLOAD_IMAGES_REQUEST, REMOVE_IMAGE, ADD_POST_REQUEST } from '../stringLabel/action';
import { backUrl } from '../config/config';

const PostForm = () => {
  const dispatch = useDispatch();

  const { imagePaths, addPostDone } = useSelector((state) => state.post);

  const [text, onChangeText, setText] = useInput('');

  useEffect(() => {
    // onSubmit 후 setText('') 을 실행하면, 정상적으로 게시글이 업로드가 되지 못해도 입력창이 초기화됨
    // 게시글 업로드가 성공했을 때만 입력 칸 초기화
    if (addPostDone) {
      setText('');
    }
  }, [addPostDone]);

  const onSubmit = useCallback(() => {
    if (!text || !text.trim()) {
      return alert('게시글을 작성하세요.');
    }

    // 간단하게 json 으로 보내도 되지만
    // 공부하는 입장에서 multer 와 upload.none 을 써보기 위해 아래와 같이 구현
    // dispatch({
    //   type: ADD_POST_REQUEST,
    //   data: {
    //     content: text,
    //     imagePaths,
    //   },
    // });

    const formData = new FormData();
    formData.append('content', text);
    imagePaths.forEach((p) => {
      formData.append('image', p);
    });

    return dispatch({
      type: ADD_POST_REQUEST,
      data: formData,
    });
  }, [text]);

  const imageInput = useRef();
  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  // 이미지와 게시글을 한 번에 업로드 할 수도 있지만
  // 현 프로젝트에서는 이미지를 등록할 때 먼저 업로드 하고, 이후 게시글을 따로 업로드 하는 방식으로 개발함
  const onChangeImages = useCallback((e) => {
    // console.log('images', e.target.files);

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

  // list 안에서 index 를 사용한 함수를 만들고 싶으면 고차 함수 사용
  // 서버에 업로드 된 이미지는 삭제하지 않고 게시글에 등록만 되지 않게 만듬
  // 서버에 업로드 된 이미지도 삭제하고 싶다면 REQUEST, SUCCESS, FAILURE 로 구성된 비동기 방식으로 구현 필요
  const onRemoveImage = useCallback((index) => () => {
    dispatch({
      type: REMOVE_IMAGE,
      data: index,
    });
  });

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
        {imagePaths.map((v, i) => (
          <div key={v} style={{ display: 'inline-block' }}>
            <img src={`${backUrl}/${v}`} style={{ width: '200px' }} alt={v} />
            <div>
              <Button onClick={onRemoveImage(i)}>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;
