const base = require("./common/base.js");

module.exports = (app) => {
  const { UUID, STRING } = app.Sequelize;

  return app.model.define(
    "file",
    {
      fileName: {
        type: STRING(30),
        allowNull: false,
        comment: "文件名称",
      },
      recordId: {
        type: UUID,
        allowNull: false,
        comment: "关联Id",
      },
      filePath: {
        type: STRING(50),
        comment: "文件目录",
      },
      fileFullPath: {
        type: STRING(80),
        comment: "完整路径",
      },
      fileExt: {
        type: STRING(10),
        comment: "拓展名",
      },
      ...base,
    },
    {
      tableName: "file",
    }
  );
};
