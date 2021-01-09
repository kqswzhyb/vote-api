const base = require("./common/base.js");

module.exports = (app) => {
  const { STRING, UUID } = app.Sequelize;

  return app.model.define(
    "dic",
    {
      typeId: {
        type: UUID,
        allowNull: false,
        comment: "字典id",
      },
      name: {
        type: STRING(30),
        allowNull: false,
        comment: "字典名称",
      },
      value: {
        type: STRING(50),
        allowNull: false,
        comment: "字典值",
      },
      ...base,
    },
    {
      tableName: "dic",
    }
  );
};
