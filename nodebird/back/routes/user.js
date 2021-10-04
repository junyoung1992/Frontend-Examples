const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const {Op} = require("sequelize");

const { User, Post, Comment, Image} = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

// 새로고침 할 때마다 로그인 여부 확인해서 정보 불러오기
router.get('/', async (req, res, next) => {
  try {
    // 쿠키는 header 에 들어 있음 
    // console.log(req.headers);
    
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        // attributes: ['id', 'nickname', 'email'],
        attributes: {
          exclude: ['password'],
        },
        where: { id: req.user.id },
        include: [{
          model: Post,
          attributes: ['id'],
        }, {
          model: User,
          as: 'Followings',
          attributes: ['id'],
        }, {
          model: User,
          as: 'Followers',
          attributes: ['id'],
        }]
      });
      
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// GET /user/followings
router.get('/followings', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
    });
    if (!user) {
      return res.status(403).send('존재하지 않는 사용자입니다.');
    }

    const followings = await user.getFollowings({
      attributes: ['id', 'nickname'],
      limit: parseInt(req.query.limit),
    });  // 내가 팔로우하는 사용자 목록 조회
    
    res.status(200).json(followings);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/followers', isLoggedIn, async (req, res, next) => { // GET /user/followers
  try {
    const user = await User.findOne({
      where: { id: req.user.id}
    });
    if (!user) {
      res.status(403).send('존재하지 않는 사용자입니다.');
    }
    
    const followers = await user.getFollowers({ // 나를 팔로우하는 사용자 목록 조회
      attributes: ['id', 'nickname'],
      limit: parseInt(req.query.limit),
    });
    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// GET /user/1
// 미들웨어는 위에서 밑으로, 왼쪽에서 오른쪽으로 읽으면서 작업을 실행함
// params, 즉 wildcard 를 사용하는 부분은 항상 다른 부분보다 아래에 있어야 함
router.get('/:userId', async (req, res, next) => {
  try {
    const fullUserWithoutPassword = await User.findOne({
      where: { id: req.params.userId },
      attributes: {
        exclude: ['password'],
      },
      include: [{
        model: Post,
        attributes: ['id'],
      }, {
        model: User,
        as: 'Followings',
        attributes: ['id'],
      }, {
        model: User,
        as: 'Followers',
        attributes: ['id'],
      }]
    });

    if (fullUserWithoutPassword) {
      const data = fullUserWithoutPassword.toJSON();
      data.Posts = data.Posts.length;
      data.Followings = data.Followings.length;
      data.Followers = data.Followers.length;

      res.status(200).json(data);
    } else {
      res.status(404).json('존재하지 않는 사용자입니다.');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// GET /user/1?lastId=10
router.get('/:userId/posts',  async (req, res, next) => {
  try {
    const where = { UserId: req.params.userId };

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

// POST /user
router.post('/', isNotLoggedIn, async (req, res, next) => {
  try {
    // create 가 비동기 함수이기 때문에 await 이 있어야 User.create() 가 실행된 다음에 res.send() 가 실행됨
    const exUser = await User.findOne({
      where: {  // where: 조건
        email: req.body.email,
      }
    });

    if (exUser) {
      // HTTP 403 FORBIDDEN
      return res.status(403).send('이미 사용중인 아이디입니다.');
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });

    // CORS 를 회피하기 위해
    // res.setHeader('Access-Control-Allow-Origin', 'http//localhost:3060');
    // app.js 에서 cors() 를 사용함

    // HTTP 201 CREATED
    res.status(201).send('ok');
  } catch (error) {
    console.error(error);
    next(error);  // HTTP 500
  }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
  // 미들웨어 확장
  passport.authenticate('local', (err, user, info) => {
    // (err, user, info) => (서버 에러, 성공 객체, 클라이언트 에러)
    
    if (err) {
      console.error(err);
      return next(err);
    }
    
    if (info) {
      // HTTP 401 UNAUTHORIZED
      return res.status(401).send(info.reason);
    }
    
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      
      const fullUserWithoutPassword = await User.findOne({
        // attributes: ['id', 'nickname', 'email'],
        attributes: {
          exclude: ['password'],
        },
        where: { id: user.id },
        include: [{
          model: Post,
          attributes: ['id'],
        }, {
          model: User,
          as: 'Followings',
          attributes: ['id'],
        }, {
          model: User,
          as: 'Followers',
          attributes: ['id'],
        }]
      });
      
      // 쿠키 설정하면 내부적으로 res.setHeader('Cookie', '~~~~'); 같은걸 보냄
      // HTTP 200 OK
      res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

router.post('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.status(200).send('ok');
});

// PATCH /user/nickname
router.patch('/nickname', isLoggedIn, async (req, res, next) => {
  try {
    await User.update({
      nickname: req.body.nickname,
    }, {
      where: { id: req.user.id },
    });
    res.status(200).json({ nickname: req.body.nickname });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// PATCH /user/1/follow
router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.userId },
    });
    if (!user) {
      return res.status(403).send('존재하지 않는 사용자입니다.');
    }
    await user.addFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId) });
    
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// DELETE /user/1/follow
router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.userId },
    });
    if (!user) {
      return res.status(403).send('존재하지 않는 사용자입니다.');
    }

    await user.removeFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId) });
    
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;