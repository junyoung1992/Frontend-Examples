import React, {useCallback, useState} from 'react';
import { Avatar, Button, Card, Comment, List, Popover } from 'antd';
import { EllipsisOutlined, HeartOutlined, HeartTwoTone, MessageOutlined, RetweetOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import CommentForm from './CommentForm';
import PostImages from './PostImages';
import PostCardContent from './PostCardContent';
import FollowButton from './FollowButton';
import { REMOVE_POST_REQUEST, LIKE_POST_REQUEST, UNLIKE_POST_REQUEST, RETWEET_REQUEST } from '../stringLabel/action';

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const { removePostLoading } = useSelector((state) => state.post);

  // const { me } = useSelector((state) => state.user);
  // const id = me?.id;  // 있으면 id가 들어가고 없으면 undefined 가 들어감
  const id = useSelector((state) => state.user.me?.id);
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const liked = post.Likers.find((v) => v.id === id);

  const onLike = useCallback(() => {
    dispatch({
      type: LIKE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);
  const onUnLike = useCallback(() => {
    dispatch({
      type: UNLIKE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);

  const onRemovePost = useCallback(() => {
    dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);

  const onRetweet = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }

    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    });
  }, [id]);

  return (
    <div style={{ marginBottom: 20 }}>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key="retweet" onClick={onRetweet} />,
          liked
            ? <HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onUnLike} />
            : <HeartOutlined key="heart" onClick={onLike} />,
          <MessageOutlined key="comment" onClick={onToggleComment} />,
          <Popover
            key="more"
            content={(
              <Button.Group>
                {id && post.User.id === id
                  ? (
                    <>
                      <Button>수정</Button>
                      <Button type="danger" onClick={onRemovePost} loading={removePostLoading}>삭제</Button>
                    </>
                  ) : <Button>신고</Button>}
              </Button.Group>
          )}
          >
            <EllipsisOutlined />
          </Popover>,
        ]}
        extra={id && <FollowButton post={post} />}
        title={
          post.RetweetId && post.Retweet
            ? `${post.User.nickname}님이 리트윗하셨습니다.`
            : null
        }
      >
        {post.RetweetId && post.Retweet
          ? (
            <Card
              cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}
            >
              <Card.Meta
                avatar={<Avatar>{post.Retweet.User.nickname[0]}</Avatar>}
                title={post.Retweet.User.nickname}
                description={<PostCardContent postData={post.Retweet.content} />}
              />
            </Card>
          )
          : (
            <Card.Meta
              avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
              title={post.User.nickname}
              description={<PostCardContent postData={post.content} />}
            />
          )}
      </Card>
      { commentFormOpened && (
        <div>
          <CommentForm post={post} />
          <List
            header={`${post.Comments.length}개의 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={(item) => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={<Avatar>{item.User.nickname[0]}</Avatar>}
                  content={item.content}
                />
              </li>
            )}
          />
        </div>
      )}
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.shape({
      id: PropTypes.number,
      nickname: PropTypes.string,
    }),
    content: PropTypes.string,
    RetweetId: PropTypes.number,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    Likers: PropTypes.arrayOf(PropTypes.object),
    Retweet: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default PostCard;
