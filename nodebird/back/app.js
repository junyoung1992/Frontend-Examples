const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');

const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const db = require('./models');
const passportConfig = require('./passport');

// dotenv.config() 를 실행하면 process.env.COOKIE_SECRET 에 .env 파일에 있는 COOKIE_SECRET 값이 치환되어 입력됨
dotenv.config();

const app = express();

db.sequelize.sync()
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);

// 로그인 기능 추가
passportConfig();

// CORS 회피
app.use(cors({
  origin: 'http://localhost:3060', // 해당 주소의 요청만 허용하겠다.
  credentials: true,  // true 로 설정해야 쿠키도 같이 전달함
}));
// Json 형식의 데이터를 사용할 수 있음
app.use(express.json());
// Form Submit 을 하면 urlencoded 방식으로 데이터가 전송되는데 이를 사용할 수 있게 함
app.use(express.urlencoded({ extended: true }));
// 로그인 시 브라우저와 서버가 같은 정보를 가지고 있어야 함
// 서버에서는 완전 데이터를 가지고 있고, 프론트에 랜덤한 문자열, 쿠키를 보내 보안 문제를 최소화 함
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: process.env.COOKIE_SECRET, // 쿠키의 랜덤한 문자열을 만들어낼 키 값
}));
app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
  res.send('hello express');
});

app.get('/posts', (req, res) => {
  res.json([
    {id: 1, content: 'hello1'},
    {id: 2, content: 'hello2'},
    {id: 3, content: 'hello3'},
  ]);
});

// prefix: post
app.use('/post', postRouter);
app.use('/user', userRouter);

// Error 처리 미들웨어
// 에러를 특별하게 처리하고 싶은 경우 직접 만들 수 있음
// app.use((err, req, res, next) => {
//  
// });

app.listen(3065, () => {
  console.log('서버 실행 중!');
});