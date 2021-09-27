const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const { User, Post } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

// 새로고침 할 때마다 로그인 여부 확인해서 정보 불러오기
router.get('/', async (req, res, next) => {
  try {
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

// GET /user/followings
router.get('/followings', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
    });
    if (!user) {
      return res.status(403).send('존재하지 않는 사용자입니다.');
    }

    const followings = await user.getFollowings();  // 내가 팔로우하는 사용자 목록 조회
    res.status(200).json(followings);

  } catch (error) {
    console.error(error);
    next(error);
  }
});

// GET /user/followers
router.get('/followers', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
    });
    if (!user) {
      return res.status(403).send('존재하지 않는 사용자입니다.');
    }
    
    const followers = await user.getFollowers();  // 나를 팔로우하는 사용자 목록 조회
    res.status(200).json(followers);

  } catch (error) {
    console.error(error);
    next(error);
  }
});

// DELETE /user/followers/1
router.delete('/follower/:userId', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
    });
    if (!user) {
      return res.status(403).send('존재하지 않는 사용자입니다.');
    }

    await user.removeFollowers(req.params.userId);  // 나를 팔로우하는 사용자 목록 조회
    res.status(200).json({ UserId: parseInt(req.params.userId) });

  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;