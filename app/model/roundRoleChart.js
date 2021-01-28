const base = require("./common/base.js");

module.exports = (app) => {
  const { STRING, UUID, DATE, INTEGER } = app.Sequelize;

  return app.model.define(
    "round_role_chart",
    {
      roundId: {
        type: UUID,
        allowNull: false,
        comment: "id",
      },
      roundRoleId: {
        type: UUID,
        allowNull: false,
        comment: "角色id",
      },
      normalCount: {
        type: INTEGER,
        allowNull: false,
        comment: "普通票数",
        defaultValue: 0,
      },
      specialCount: {
        type: INTEGER,
        allowNull: false,
        comment: "特殊票数",
        defaultValue: 0,
      },
      totalCount: {
        type: INTEGER,
        allowNull: false,
        comment: "总票数",
        defaultValue: 0,
      },
      ...base,
    },
    {
      tableName: "round_role_chart",
    }
  );
};
