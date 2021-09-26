const express = require('express');

const { Comment, Image, Post, User, } = require('../models');

const router = express.Router();

router.get('/',  async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      limit: 10,  // 게시글 10개 조회
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'ASC'],
      ],
      // offset: 0  // offset 을 사용하면 게시글이 실시간으로 추가, 삭제되면 오프셋이 꼬여 일부 게시글을 중복 조회하거나 건너뛸 수 있음
      // where: { id: lastId },  // lastId 변수를 프론트로부터 받아와 사용하면 offset-limit 방식의 문제가 발생하지 않음
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
      }]
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;