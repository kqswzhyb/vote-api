const base = require("./common/base.js");

module.exports = (app) => {
  const { STRING, UUID, DATE, INTEGER } = app.Sequelize;

  return app.model.define(
    "vote_config",
    {
      voteId: {
        type: UUID,
        allowNull: false,
        comment: "比赛id",
      },
      hasSpecialVote: {
        type: STRING(1),
        allowNull: false,
        comment: "是否有特殊票",
        defaultValue: "0",
      },
      voteShowType: {
        type: STRING(1),
        allowNull: false,
        comment: "票数公开类型（0：未投票不可见，1：任何状态可见）",
        defaultValue: "0",
      },
      voteUpdateType: {
        type: STRING(1),
        allowNull: false,
        comment:
          "票数更新频率类型（0：实时，1：1分钟，2：10分钟，3：30分钟，4：1小时）",
        defaultValue: "4",
      },
      showMap: {
        type: STRING(1),
        allowNull: false,
        comment: "是否展示投票人地图分布（0：不展示，1：展示）",
        defaultValue: "0",
      },
      showChart: {
        type: STRING(1),
        allowNull: false,
        comment: "是否显示趋势图（0：展示，1：不展示）",
        defaultValue: "0",
      },
      voteLevel: {
        type: INTEGER,
        allowNull: false,
        comment: "投票需要等级",
        defaultValue: 0,
      },
      voteQqVip: {
        type: STRING(1),
        allowNull: false,
        comment: "投票需要QQvip",
        defaultValue: "0",
      },
      diyBg: {
        type: STRING(1),
        comment: "定制背景图（0：否，1：是）",
        defaultValue: "0",
      },
      ...base,
    },
    {
      tableName: "vote_config",
    }
  );
};
