const base = require('./common/base.js');

module.exports = (app) => {
  const { STRING, UUID } = app.Sequelize;

  const User = app.model.define('user', {
    roleId: {
      type: UUID,
      allowNull: false,
      comment: '角色id',
    },
    username: {
      type: STRING(32),
      unique: true,
      allowNull: false,
      comment: '账号名',
    },
    nickname: {
      type: STRING(32),
      unique: true,
      allowNull: false,
      comment: '昵称',
    },
    password: {
      type: STRING(255),
      allowNull: false,
      comment: '密码',
    },
    phone: {
      type: STRING(32),
      allowNull: true,
      comment: '手机号码',
    },
    ...base,
  });

  return User;
};
