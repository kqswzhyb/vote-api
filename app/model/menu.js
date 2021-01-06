const base = require("./common/base.js");

module.exports = (app) => {
  const { UUID, STRING, INTEGER, ENUM } = app.Sequelize;

  return app.model.define(
    "menu",
    {
      name: {
        type: STRING(10),
        allowNull: false,
        comment: "菜单名称",
      },
      permission: {
        type: STRING(20),
        allowNull: false,
        comment: "权限编码",
      },
      path: {
        type: STRING(50),
        allowNull: false,
        comment: "前端路径",
      },
      parentId: {
        type: UUID,
        allowNull: false,
        comment: "父级id",
      },
      icon: {
        type: STRING(20),
        comment: "图标名称",
      },
      type: {
        type: ENUM,
        allowNull: false,
        values: ["0", "1", "2"],
        comment: "菜单类型",
      },
      sort: {
        type: INTEGER,
        comment: "排序值",
      },
      ...base,
    },
    {
      tableName: "menu",
    }
  );
};
