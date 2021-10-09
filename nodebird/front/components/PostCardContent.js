import React, { useEffect } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Button, Input } from 'antd';
import { useSelector } from 'react-redux';
import useInput from '../hooks/useInput';

// 첫 번째 게시글 #해시태그 #익스프레스
// 정규표현식 https://regexr.com/ 에서 테스트
const PostCardContent = ({ editMode, onChangePost, onCancelUpdate, postData }) => {
  const { updatePostLoading, updatePostDone } = useSelector((state) => state.post);
  const [commentText, onChangeCommentText] = useInput(postData);

  useEffect(() => {
    if (updatePostDone) {
      onCancelUpdate();
    }
  }, [updatePostDone]);

  return (
    <div>
      {editMode
        ? (
          <>
            <Input.TextArea value={commentText} onChange={onChangeCommentText} rows={4} />
            <Button.Group>
              <Button loading={updatePostLoading} onClick={onChangePost(commentText)}>수정</Button>
              <Button type="danger" onClick={onCancelUpdate}>취소</Button>
            </Button.Group>
          </>
        )
        : postData.split((/(#[^\s#]+)/g)).map((v, i) => {
          if (v.match(/(#[^\s#]+)/)) {
            return <Link href={`/hashtag/${v.slice(1)}`} prefetch={false} key={i}><a>{v}</a></Link>;
          }
          return v;
        })}
    </div>
  );
};

PostCardContent.propTypes = {
  editMode: PropTypes.bool,
  onChangePost: PropTypes.func.isRequired,
  onCancelUpdate: PropTypes.func.isRequired,
  postData: PropTypes.string.isRequired,
};

PostCardContent.defaultProps = {
  editMode: false,
};

export default PostCardContent;
