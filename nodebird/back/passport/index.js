const passport = require('passport');

const local = require('./local');
const { User } = require('../models');

module.exports = () => {
  // req.login() 하면 실행.
  // 해당 함수에 입력한 user 파라미터가 본 함수에도 입력됨
  passport.serializeUser((user, done) => {
    // 1: 서버 에러, 2: 성공, 3: 클라이언트 에러
    done(null, user.id);  // 세션에 모든 정보를 다 들고 있기에는 무거우니 쿠키랑 묶어줄 id만 저장
  });
  
  // 로그인이 성공하면 그 다음 요청부터 실행
  passport.deserializeUser(async (id, done) => {
    try {
      // 저장한 id를 통해서 db 에서 상세 정보를 조회
      const user = await User.findOne({
        where: {id},
      });
      done(null, user); // req.user 에 넣어줌
    } catch (error) {
      console.error(error);
      done(error);
    }
  });
  
  local();
};