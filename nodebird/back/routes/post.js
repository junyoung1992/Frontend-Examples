const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Comment, Image, Post, User } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

try {
  fs.accessSync('uploads');
} catch (error) {
  console.log('uploads 폴더가 없으므로 생성합니다.');
  fs.mkdirSync('uploads');
}

// multer 는 app 보다는 라우터마다 개별적으로 적용
const upload = multer({
  storage: multer.diskStorage({ // 현재는 로컬 하드디스크에 저장
    destination(req, file, done) {
      done(null, 'uploads');
    },
    filename(req, file, done) { // image.png
      // node 는 파일 이름이 같은 경우 덮어씌우므로, 이를 피해서 저장해야 함
      const ext = path.extname(file.originalname); // 확장자 추출 (.png)
      const basename = path.basename(file.originalname, ext);  // 파일명 추출 (image)
      done(null, basename + new Date().getTime() + ext);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  }
});

// POST /post
router.post('/', isLoggedIn,  async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,  // 로그인하고 세션에 id를 저장했기 때문에 했기 때문에 req.user.id 사용 가능
    });
    
    const fullPost = await Post.findOne({
      where: { id: post.id },
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
      }],
    });
    
    res.status(201).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// POST /post/images
// PostForm 에서 name 이 image 인 input 의 데이터가 array 에 들어감
// 여러 장의 이미지를 업로드 하기 위해 array 사용. 한 장만 업로드 할거면 single 사용
router.post('/images', isLoggedIn, upload.array('image'), async (req, res, next) => {
  // 이미지 업로드는 upload.array('image') 에서 실행되고, 함수 내부에는 업로드 후의 동작을 작성
  // 이미지는 req.file 에 들어있음
  res.status(200).json(req.files.map((v) => v.filename));
});

// PATCH /post/1/like
router.patch('/:postId/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });

    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }
    
    await post.addLikers(req.user.id); // Sequelize 가 테이블의 관계를 이용해 데이터를 추가해줌
    
    res.status(200).json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
   console.error(error);
   next(error);
  }
});

// DELETE /post/1/like
router.delete('/:postId/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });

    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }

    await post.removeLikers(req.user.id); // Sequelize 가 테이블의 관계를 이용해 데이터를 추가해줌

    res.status(200).json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// POST /post/1/comment
router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    
    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }
    
    const comment = await Comment.create({
      content: req.body.content,
      PostId: req.params.postId,
      UserId: req.user.id,
    });
    
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [{
        model: User,
        attributes: ['id', 'nickname'],
      }],
    })

    res.status(201).json(fullComment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// DELETE /post/1
router.delete('/:postId', isLoggedIn, async (req, res, next) => {
  try {
    await Post.destroy({
      where: {
        id: req.params.postId,
        UserId: req.user.id,
      },
    });
    
    res.status(200).json({ PostId: parseInt(req.params.postId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;