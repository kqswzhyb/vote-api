const base = require("./common/base.js");

module.exports = (app) => {
  const { STRING } = app.Sequelize;

  return app.model.define(
    "dic_type",
    {
      name: {
        type: STRING(30),
        allowNull: false,
        comment: "字典类型名称",
      },
      code: {
        type: STRING(50),
        comment: "字典类型编码",
      },
      ...base,
    },
    {
      tableName: "dic_type",
    }
  );
};
