const base = require("./common/base.js");

module.exports = (app) => {
  const { STRING, UUID, DATE, INTEGER } = app.Sequelize;

  return app.model.define(
    "vote_record",
    {
      userId: {
        type: UUID,
        allowNull: false,
        comment: "用户id",
      },
      voteId: {
        type: UUID,
        allowNull: false,
        comment: "比赛id",
      },
      roundId: {
        type: UUID,
        allowNull: false,
        comment: "场次id",
      },
      roundStageId: {
        type: UUID,
        allowNull: false,
        comment: "场次阶段id",
      },
      roundRoleId: {
        type: UUID,
        allowNull: false,
        comment: "场次角色id",
      },
      voteType: {
        type: STRING(30),
        allowNull: false,
        comment: "投票种类",
      },
      isExtra: {
        type: STRING(20),
        allowNull: false,
        comment: "是否有额外票",
      },
      ip: {
        type: STRING(20),
        comment: "ip",
      },
      ...base,
    },
    {
      tableName: "vote_record",
    }
  );
};
