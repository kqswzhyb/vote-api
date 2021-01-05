const base = require("./common/base.js");

module.exports = (app) => {
  const { STRING } = app.Sequelize;

  const Role = app.model.define(
    "role",
    {
      name: {
        type: STRING(10),
        allowNull: false,
        comment: "角色名称",
      },
      ...base,
    },
    {
      tableName: "role",
    }
  );

  return Role;
};
