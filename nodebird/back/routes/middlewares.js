exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    // 지금까진 에러 처리할 때 사용했음
    // 파라미터로 에러를 넣으면 에러 처리
    // 아무 것도 넣지 않으면 다음 미들웨어 실행
    next();
  } else {
    res.status(401).send('로그인이 필요합니다.');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send('로그인 하지 않은 사용자만 접근 가능합니다.');
  }
};