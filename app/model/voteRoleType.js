const base = require("./common/base.js");

module.exports = (app) => {
  const { STRING, UUID } = app.Sequelize;

  return app.model.define(
    "vote_role_type",
    {
      voteId: {
        type: UUID,
        allowNull: false,
        comment: "比赛id",
      },
      name: {
        type: STRING(10),
        allowNull: false,
        comment: "分类名称",
        defaultValue: "角色名",
      },
      ...base,
    },
    {
      tableName: "vote_role_type",
    }
  );
};
