const express = require('express');
const { Op } = require("sequelize");

const { Comment, Hashtag, Image, Post, User, } = require('../models');

const router = express.Router();

// GET /hashtag/노드?lastId=10
router.get('/:hashtag',  async (req, res, next) => {
  try {
    const where = {};

    // 초기 로딩이 아닌 경우
    if (parseInt(req.query.lastId, 10)) {
      // sequlize.Op.lt 를 사용하면
      // 아래 조건이 'id 가 req.query.lastId 보다 작은 것' 을 의미하도록 설정 가능
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
    }

    const posts = await Post.findAll({
      where,
      limit: 10,  // 게시글 10개 조회
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'ASC'],
      ],
      // offset: 0  // offset 을 사용하면 게시글이 실시간으로 추가, 삭제되면 오프셋이 꼬여 일부 게시글을 중복 조회하거나 건너뛸 수 있음
      // where: { id: lastId },  // lastId 변수를 프론트로부터 받아와 사용하면 offset-limit 방식의 문제가 발생하지 않음
      include: [{
        model: Hashtag,
        where: { name: decodeURIComponent(req.params.hashtag) }
      },{
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
      }, {
        model: Post,
        as: 'Retweet',
        include: [{
          model: Image,
        }, {
          model: User,  // 리트윗 원본 게시글의 작성자
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