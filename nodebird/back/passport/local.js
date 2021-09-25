const passport = require('passport');
// Strategy 의 이름을 LocalStrategy 로 변경
// -> 추후 카카오 로그인, 네이버 로그인 등을 구현할 때 구분짓기 위해
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require("bcrypt");

const { User } = require('../models');

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'email',   // req.body.email 이면 'email', req.body.id 이면 'id'
    passwordField: 'password',
  }, async (email, password, done) => {
    try {
      const user = await User.findOne({
        where: {email: email}
      });
      if (!user) {
        // 1: 서버 에러, 2: 성공, 3: 클라이언트 에러
        return done(null, false, {reason: '존재하지 않는 사용자입니다.'});
      }
      
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        return done(null, user);  // 성공
      }
      
      return done(null, false, {reason: '비밀번호가 틀렸습니다.'});
    } catch (error) {
      console.error(error);
      return done(error);
    }
  }));
};