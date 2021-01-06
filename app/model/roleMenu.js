const base = require("./common/base.js");

module.exports = (app) => {
  const { UUID } = app.Sequelize;

  return app.model.define(
    "role_menu",
    {
      roleId: {
        type: UUID,
        allowNull: false,
        comment: "角色id",
      },
      menuId: {
        type: UUID,
        allowNull: false,
        comment: "菜单id",
      },
      ...base,
    },
    {
      tableName: "role_menu",
    }
  );
};
