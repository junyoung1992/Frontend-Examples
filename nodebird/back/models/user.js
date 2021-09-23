module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', { // MySQL 에는 users 테이블 생성
    // id: {},  // id가 기본적으로 생성됨 
    email: {
      type: DataTypes.STRING(30),
      allowNull: false, // 필수
      unique: true, // 고유한 값
    },
    nickname: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),  // 비밀번호는 암호화하면 길어지므로 넉넉하게
      allowNull: false,
    },
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci',  // 한글 저장
  });
  
  User.associate = (db) => {
    db.User.hasMany(db.Post); // 게시글 작성 User:Post = 1:N
    db.User.hasMany(db.Comment); // 댓글 작성 User:Comment = 1:N
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked'  }); // 게시글 좋아요 User:POST = M:N
    // through 는 테이블 이름을 바꿔주고, foreignKey 는 컬럼 이름을 바꿔준다고 생각해도 됨
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'FollowingId' }); // 팔로우 User:User = M:N
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'FollowerId' }); // 팔로우 User:User = M:N
  };
  
  return User;
};