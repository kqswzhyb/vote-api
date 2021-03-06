const base = require("./common/base.js");

module.exports = (app) => {
  const { STRING, DATE, UUID, INTEGER } = app.Sequelize;
  return app.model.define(
    "user",
    {
      qqOpenId: {
        type: STRING(64),
        allowNull: false,
        comment: "QQ授权标识",
      },
      qqLevel: {
        type: INTEGER,
        allowNull: false,
        comment: "QQ等级",
        defaultValue: 0,
      },
      qqVip: {
        type: STRING(64),
        allowNull: false,
        comment: "是否QQVIP用户",
      },
      username: {
        type: STRING(32),
        unique: true,
        allowNull: false,
        comment: "账号名",
      },
      nickname: {
        type: STRING(32),
        unique: true,
        allowNull: false,
        comment: "昵称",
      },
      lastLoginTime: {
        type: DATE,
        comment: "最后登录时间",
      },
      lastVoteTime: {
        type: DATE,
        comment: "最后投票时间",
      },
      roleId: {
        type: UUID,
        comment: "角色id",
      },
      ...base,
    },
    {
      tableName: "user",
    }
  );
};
