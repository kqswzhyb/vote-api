const base = require("./common/base.js");

module.exports = (app) => {
  const { STRING, UUID, DATE } = app.Sequelize;

  return app.model.define(
    "round",
    {
      roundStageId: {
        type: UUID,
        allowNull: false,
        comment: "比赛阶段id",
      },
      parentId: {
        type: UUID,
        allowNull: false,
        comment: "父级id",
      },
      roundName: {
        type: STRING(30),
        allowNull: false,
        comment: "场次完整名称",
      },
      groupName: {
        type: STRING(30),
        allowNull: false,
        comment: "场次名称",
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
      tableName: "round",
    }
  );
};
