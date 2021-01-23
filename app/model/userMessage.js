const base = require("./common/base.js");

module.exports = (app) => {
  const { STRING, DATE, UUID, INTEGER } = app.Sequelize;

  return app.model.define(
    "user_message",
    {
      userId: {
        type: UUID,
        allowNull: false,
        comment: "用户Id",
      },
      title: {
        type: STRING(64),
        allowNull: false,
        comment: "标题",
      },
      content: {
        type: STRING(200),
        allowNull: false,
        comment: "文本内容",
      },
      url: {
        type: STRING(200),
        allowNull: false,
        comment: "链接",
      },
      ...base,
    },
    {
      tableName: "user_message",
    }
  );
};
