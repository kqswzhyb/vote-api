const base = require("./common/base.js");

module.exports = (app) => {
  const { STRING, INTEGER } = app.Sequelize;

  return app.model.define(
    "data_analysis",
    {
      voteId: {
        type: STRING(64),
        allowNull: false,
        comment: "比赛id",
      },
      targetId: {
        type: STRING(64),
        allowNull: false,
        comment: "对象id",
      },
      typeId: {
        type: STRING(64),
        allowNull: false,
        comment: "数据分析类型id",
      },
      targetType: {
        type: STRING(64),
        allowNull: false,
        comment: "对象类型",
      },
      value: {
        type: STRING(100),
        allowNull: false,
        comment: "分析值",
        defaultValue: "",
      },
      sort: {
        type: INTEGER,
        comment: "排名",
      },
      ...base,
    },
    {
      tableName: "data_analysis",
    }
  );
};
