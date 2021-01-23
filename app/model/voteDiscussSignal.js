const base = require("./common/base.js");

module.exports = (app) => {
  const { STRING, DATE, UUID, INTEGER } = app.Sequelize;

  return app.model.define(
    "vote_discuss_signal",
    {
      voteDiscussId: {
        type: UUID,
        allowNull: false,
        comment: "比赛评论Id",
      },
      userId: {
        type: UUID,
        allowNull: false,
        comment: "用户Id",
      },
      signalType: {
        type: STRING(1),
        allowNull: false,
        comment: "标识类型",
      },
      ...base,
    },
    {
      tableName: "vote_discuss_signal",
    }
  );
};
