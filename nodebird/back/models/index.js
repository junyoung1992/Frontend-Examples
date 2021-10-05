const Sequelize = require('sequelize');
const comment = require('./comment');
const hashtag = require('./hashtag');
const image = require('./image');
const post = require('./post');
const user = require('./user');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

// database 와 연결이 성공하면 sequelize 객체에 연결 정보가 담김
const sequelize = new Sequelize(config.database, config.username, config.password, config);

// db 테이블 호출
db.Comment = comment;
db.Hashtag = hashtag; 
db.Image = image;
db.Post = post;
db.User = user;

Object.keys(db).forEach(modelName => {
  db[modelName].init(sequelize);
});

// db.Comment = require('./comment')(sequelize, Sequelize);
// db.Hashtag = require('./hashtag')(sequelize, Sequelize);
// db.Image = require('./image')(sequelize, Sequelize);
// db.Post = require('./post')(sequelize, Sequelize);
// db.User = require('./user')(sequelize, Sequelize);

// db를 순회하며 관계 연결
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
