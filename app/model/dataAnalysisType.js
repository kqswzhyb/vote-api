const base = require("./common/base.js");

module.exports = (app) => {
  const { STRING } = app.Sequelize;

  return app.model.define(
    "data_analysis_type",
    {
      name: {
        type: STRING(30),
        allowNull: false,
        comment: "数据分析类型名称",
      },
      value: {
        type: STRING(50),
        allowNull: false,
        comment: "数据分析类型编码",
      },
      ...base,
    },
    {
      tableName: "data_analysis_type",
    }
  );
};
