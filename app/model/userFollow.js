const base = require("./common/base.js");

module.exports = (app) => {
  const { STRING, DATE, UUID, INTEGER } = app.Sequelize;

  return app.model.define(
    "user_follow",
    {
      userId: {
        type: UUID,
        allowNull: false,
        comment: "用户Id",
      },
      followId: {
        type: UUID,
        allowNull: false,
        comment: "关注Id",
      },
      followType: {
        type: STRING(1),
        allowNull: false,
        comment: "关注类型",
      },
      ...base,
    },
    {
      tableName: "user_follow",
    }
  );
};
