# NodeBird - Back

## Frameworks & Libraries

1. Express
    - Node.js 웹 애플리케이션 프레임워크
    - <https://expressjs.com>
2. Sequelize
    - Node.js ORM(Object Relational Mapping)
    - <https://sequelize.org>
3. mysql2
    - mysql과 node를 연결해주는 라이브러리
4. Nodemon
    - 코드 수정 시 항시 서버 재기동
    - 실행: `nodemon app`
        - package.json 에 등록해서 사용해도 됨
5. bcrypt
    - 암호화 라이브러리
6. cors
    - CORS (Cross-Origin Resource Sharing) 회피
7. passport & passport-local
    - 로그인 지원
8. express session
    - 쿠키/세션을 구축하기 위해 사용
9. cookie parser
    - 쿠키 파서
10. dotenv
    - 중요한 키 값을 .env 파일에 따로 관리
11. morgan
    - 프론트에서 백엔드로 보낸 요청이 기록됨 - 디버깅 용이
12. multer
    - multipart 를 백엔드에서 처리할 수 있음
13. pm2
    - 백그라운드에서 node 실행 및 모니터링, 관리
    - `pm2 start app.js`
    - `npx pm2 list`
    - `npx pm2 monit`
    - `npx pm2 reload`
    - `npx pm2 kill`
    - `npx pm2 stop ~~~`
    - `npx pm2 restart ~~~`
    - `npx pm2 delete ~~~`
14. hpp
15. helmet

```
npm install \
    express sequelize sequelize-cli mysql2 \
    bcrypt cors passport passport-local \
    express-session cookie-parser morgan multer

npm install -D \
    nodemon
```

```
// squelize 초기 설정
npx squelize init

// db 설정 코드 작성 후
npx sequelize db:create
```

## REST API

### 자주 쓰이는 함수

|HTTP Method|Description|
|---|---|
|`app.get`|조회|
|`app.post`|생성|
|`app.patch`|부분 수정|
|`app.put`|전체 수정|
|`app.delete`|제거|
|`app.options`|제공 가능한 API 응답|
|`app.head`|헤더만 조회|

API Method와 기능을 매치하는 것이 애매하여, 합의를 통해 정의

Swagger를 사용해 문서화