const base = require("./common/base.js");

module.exports = (app) => {
  const { STRING, UUID, DATE } = app.Sequelize;

  return app.model.define(
    "vote",
    {
      voteConfigId: {
        type: UUID,
        allowNull: false,
        comment: "比赛配置id",
      },
      voteName: {
        type: STRING(30),
        allowNull: false,
        comment: "比赛名称",
      },
      voteType: {
        type: STRING(30),
        allowNull: false,
        comment: "比赛类型",
      },
      ruleContent: {
        type: STRING(500),
        allowNull: false,
        comment: "规则文本",
      },
      hasReward: {
        type: STRING(1),
        allowNull: false,
        comment: "是否有奖励",
      },
      rewardContent: {
        type: STRING(500),
        comment: "奖励文本",
      },
      startTime: {
        type: DATE,
        allowNull: false,
        comment: "开始时间",
      },
      endTime: {
        type: DATE,
        allowNull: false,
        comment: "结束时间",
      },
      ...base,
    },
    {
      tableName: "vote",
    }
  );
};
