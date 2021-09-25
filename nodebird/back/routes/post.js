const express = require('express');

const { Comment, Image, Post, User } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

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
        model: Comment,
      }, {
        model: User,
      }],
    });
    
    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

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
      PostId: req.params.postId,
      UserId: req.user.id,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/', isLoggedIn, (req, res) => {
  res.json({id: 1});
});

module.exports = router;