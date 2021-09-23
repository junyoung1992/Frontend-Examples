module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define('Image', {
    src: {
      type: DataTypes.STRING(200),  // URL 이므로 넉넉하게
      allowNull: false,
    }
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });

  Image.associate = (db) => {
    db.Image.belongsTo(db.Post);  // 게시글 이미지 Post:Image = 1:N
  };
  
  return Image;
};