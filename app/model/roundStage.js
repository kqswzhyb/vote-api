const base = require("./common/base.js");

module.exports = (app) => {
  const { STRING, UUID, DATE, INTEGER } = app.Sequelize;

  return app.model.define(
    "round_stage",
    {
      voteId: {
        type: UUID,
        allowNull: false,
        comment: "比赛id",
      },
      roleTypeId: {
        type: UUID,
        allowNull: false,
        comment: "角色分类id",
      },
      parentId: {
        type: UUID,
        allowNull: false,
        comment: "父级id",
      },
      name: {
        type: STRING(30),
        allowNull: false,
        comment: "比赛阶段名称",
      },
      totalCount: {
        type: INTEGER,
        allowNull: false,
        comment: "角色总数",
        defaultValue: 2,
      },
      promotionCount: {
        type: INTEGER,
        allowNull: false,
        comment: "晋级总数",
        defaultValue: 1,
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
      tableName: "round_stage",
    }
  );
};
