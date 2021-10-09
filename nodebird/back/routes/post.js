const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Comment, Hashtag, Image, Post, User } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

try {
  fs.accessSync('uploads');
} catch (error) {
  console.log('uploads 폴더가 없으므로 생성합니다.');
  fs.mkdirSync('uploads');
  fs.mkdirSync('uploads/original');
  fs.mkdirSync('uploads/thumb');
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
      done(null, `original/${Date.now()}_${basename}${ext}`);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  }
});

// GET /post/1
router.get('/:postId', async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(404).send('존재하지 않는 게시글입니다.');
    }

    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [{
        model: Post,
        as: 'Retweet',
        include: [{
          model: Image,
        }, {
          model: User,  // 리트윗 원본 게시글의 작성자
          attributes: ['id', 'nickname'],
        }],
      }, {
        model: User,  // 리트윗을 하는 유저의 정보
        attributes: ['id', 'nickname'],
      }, {
        model: Image,
      }, {
        model: User,  // 좋아요 누른 사람
        as: 'Likers',
        attributes: ['id', 'nickname'],
      }, {
        model: Comment,
        include: [{
          model: User,  // 내 게시글의 댓글의 작성자
          attributes: ['id', 'nickname'],
        }],
      }],
    });

    res.status(200).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// POST /post
router.post('/', isLoggedIn, upload.none(),  async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,  // 로그인하고 세션에 id를 저장했기 때문에 했기 때문에 req.user.id 사용 가능
    });

    const hashtags = req.body.content.match(/#[^\s#]+/g);
    if (hashtags) {
      const result = await Promise.all(hashtags.map(
        // findOrCreate: 있으면 가져오고, 없으면 무시
        (tag) => Hashtag.findOrCreate({
          where: {name: tag.slice(1).toLowerCase() },
        })
      )); // 결과 값이 [value, isFind(boolean)]
      await post.addHashtags(result.map((v) => v[0]));
    }
    
    if (req.body.image) {
      if (Array.isArray(req.body.image)) {  // 이미지를 여러 개 업로드하면 - image: [1.png, 2.png]
        const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image })));
        await post.addImages(images);
      } else {  // 이미지를 하나만 업로드하면 - image: 1.png
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image);
      }
    }
    
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

// POST /post/1/comment
router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });

    if (!post) {
      return res.status(404).send('존재하지 않는 게시글입니다.');
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

// POST /post/1/retweet
router.post('/:postId/retweet', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
      include: [{
        model: Post,
        as: 'Retweet',
      }],
    });
    if (!post) {
      return res.status(404).send('존재하지 않는 게시글입니다.');
    }
    
    if(req.user.id === post.UserId || (post.Retweet && req.user.id === post.Retweet.UserId)) {
      return res.status(404).send('자신의 글은 리트윗할 수 없습니다.');
    }
    
    // 리트윗 한 글인 경우 원본 글의 id 를 저장하고, 아닌 경우 해당 글의 id 를 저장한다.
    const retweetTargetId = post.RetweetId || post.id;
    
    const exPost = await Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      }
    });
    if (exPost) {
      return res.status(404).send('이미 리트윗한 글입니다.');
    }
    
    const retweet = await Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: 'retweet',
    });
    
    const retweetWithPrevPost = await Post.findOne({
      where: { id: retweet.id },
      include: [{
        model: Post,
        as: 'Retweet',
        include: [{
          model: Image,
        }, {
          model: User,  // 리트윗 원본 게시글의 작성자
          attributes: ['id', 'nickname'],
        }],
      }, {
        model: User,  // 리트윗을 하는 유저의 정보
        attributes: ['id', 'nickname'],
      }, {
        model: Image,
      }, {
        model: User,  // 좋아요 누른 사람
        as: 'Likers',
        attributes: ['id', 'nickname'],
      }, {
        model: Comment,
        include: [{
          model: User,  // 내 게시글의 댓글의 작성자
          attributes: ['id', 'nickname'],
        }],
      }],
    });

    res.status(201).json(retweetWithPrevPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// PATCH /post/1/like
router.patch('/:postId/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });

    if (!post) {
      return res.status(404).send('존재하지 않는 게시글입니다.');
    }
    
    await post.addLikers(req.user.id); // Sequelize 가 테이블의 관계를 이용해 데이터를 추가해줌
    
    res.status(200).json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
   console.error(error);
   next(error);
  }
});

// PATCH /post/1
router.patch('/:postId', isLoggedIn, async (req, res, next) => {
  try {
    await Post.update({
      content: req.body.content,
    },{
      where: {
        id: req.params.postId,
        UserId: req.user.id,
      },
    });

    const hashtags = req.body.content.match(/#[^\s#]+/g);
    if (hashtags) {
      const result = await Promise.all(hashtags.map(
        (tag) => Hashtag.findOrCreate({
          where: {name: tag.slice(1).toLowerCase() },
        })
      ));
      
      const post = await Post.findOne({
        where: { id: req.params.postId },
      })
      await post.setHashtags(result.map((v) => v[0])); // add 는 추가하는데 set 은 기존 것들 날려버리고 새로 넣음
    }

    res.status(200).json({ PostId: parseInt(req.params.postId, 10), content: req.body.content });
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

// DELETE /post/1/like
router.delete('/:postId/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });

    if (!post) {
      return res.status(404).send('존재하지 않는 게시글입니다.');
    }

    await post.removeLikers(req.user.id); // Sequelize 가 테이블의 관계를 이용해 데이터를 추가해줌

    res.status(200).json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;