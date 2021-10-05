const DataTypes = require('sequelize');
const { Model } = DataTypes;

// 최신 문법
module.exports = class Post extends Model {
  static init(sequelize) {
    return super.init({
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    }, {
      modelName: 'Post',
      tableName: 'posts',
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      sequelize,
    });
  }

  static associate(db) {
    db.Post.hasMany(db.Comment);
    db.Post.hasMany(db.Image);
    db.Post.belongsTo(db.User);
    db.Post.belongsTo(db.Post, { as: 'Retweet' });
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' });
  }
};

// module.exports = (sequelize, DataTypes) => {
//   const Post = sequelize.define('Post', {
//     content: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     }
//   }, {
//     charset: 'utf8mb4',
//     collate: 'utf8mb4_general_ci',  // mb4 까지 추가해야 이모티콘까지 저장
//   });
//
//   Post.associate = (db) => {
//     db.Post.hasMany(db.Comment);  // 게시글 댓글 Post:Comment = 1:N
//     db.Post.hasMany(db.Image);  // 게시글 이미지 Post:Image = 1:N
//     db.Post.belongsTo(db.User); // 게시글 작성 User:Post = 1:N
//     db.Post.belongsTo(db.Post, { as: 'Retweet' }); // 리트윗 Post:Post = 1: N
//     db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });  // 게시글 해시태그 Post:Hashtag = M:N
//     db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' }); // 게시글 좋아요 User:Many = M:N
//   };
//  
//   return Post;
// };