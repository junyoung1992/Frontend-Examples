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

module.exports = router;