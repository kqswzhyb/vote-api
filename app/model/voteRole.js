const base = require("./common/base.js");

module.exports = (app) => {
  const { STRING, UUID, DATE, INTEGER } = app.Sequelize;

  return app.model.define(
    "vote_role",
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
      roleName: {
        type: STRING(30),
        allowNull: false,
        comment: "角色名称",
      },
      alias: {
        type: STRING(20),
        allowNull: false,
        comment: "别名",
      },
      description: {
        type: STRING(20),
        allowNull: false,
        comment: "补充描述",
      },
      ...base,
    },
    {
      tableName: "vote_role",
    }
  );
};
