const express = require('express');

const { Comment, Image, Post, User } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

// POST /post
router.post('/', isLoggedIn,  async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,  // 로그인하고 세션에 id를 저장했기 때문에 했기 때문에 req.user.id 사용 가능
    });
    
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [{
        model: Image,
      }, {
        model: User,  // 게시글 작성자
        attributes: ['id', 'nickname'],
      }, {
        model: User,  // 좋아요 누른 사람
        as: 'Likers',
        attributes: ['id', 'nickname'],
      }, {
        model: Comment,
        include: [{
          model: User,  // 댓글 작성자
          attributes: ['id', 'nickname'],
        }],
      }],
    });
    
    res.status(201).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// PATCH /post/1/like
router.patch('/:postId/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });

    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }
    
    await post.addLikers(req.user.id); // Sequelize 가 테이블의 관계를 이용해 데이터를 추가해줌
    
    res.status(200).json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
   console.error(error);
   next(error);
  }
});

// DELETE /post/1/like
router.delete('/:postId/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });

    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }

    await post.removeLikers(req.user.id); // Sequelize 가 테이블의 관계를 이용해 데이터를 추가해줌

    res.status(200).json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// POST /post/1/comment
router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    
    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }
    
    const comment = await Comment.create({
      content: req.body.content,
      PostId: parseInt(req.params.postId, 10),
      UserId: req.user.id,
    });
    
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [{
        model: User,
        attributes: ['id', 'nickname'],
      }],
    })

    res.status(201).json(fullComment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// DELETE /post
router.delete('/', isLoggedIn, (req, res) => {
  res.json({id: 1});
});

module.exports = router;