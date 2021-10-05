const DataTypes = require('sequelize');
const { Model } = DataTypes;

// 최신 문법
module.exports = class Comment extends Model {
  static init(sequelize) {
    return super.init({
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    }, {  // 모델 설정
      modelName: 'Comment',
      tableName: 'comments',
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      sequelize,  // 연결 객체
    });
  }
  
  static associate(db) {
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.Post);
  }
};

// module.exports = (sequelize,  DataTypes) => {
//   const Comment = sequelize.define('Comment', {
//     content: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     }
//     // belongsTo 가 foreign key 를 만들어줌
//     // UserId: {}
//     // PostId: {}
//   }, {
//     charset: 'utf8mb4',
//     collate: 'utf8mb4_general_ci',
//   });
//
//   Comment.associate = (db) => {
//     db.Comment.belongsTo(db.User); // 댓글 작성 User:Comment = 1:N
//     db.Comment.belongsTo(db.Post);  // 게시글 댓글 Post:Comment = 1:N
//   };
//  
//   return Comment;
// };