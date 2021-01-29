"use strict";

module.exports = {
  Query: {
    // 查询单个
    dataAnalysisType(root, { id }, ctx) {
      return ctx.connector.dataAnalysisType.fetchById(id);
    },
    // 查询所有
    dataAnalysisTypeList(root, data, ctx) {
      return ctx.connector.dataAnalysisType.fetchList(data);
    },
    // 查询总数
    dataAnalysisTypeCount(root, data, ctx) {
      return ctx.connector.dataAnalysisType.fetchCount(data);
    },
  },
  Mutation: {
    //创建
    createDataAnalysisType(root, data, ctx) {
      return ctx.connector.dataAnalysisType.createDataAnalysisType(data, ctx);
    },
    //更新
    updateDataAnalysisType(root, data, ctx) {
      return ctx.connector.dataAnalysisType.updateDataAnalysisType(data, ctx);
    },
    //删除
    deleteDataAnalysisType(root, data, ctx) {
      return ctx.connector.dataAnalysisType.deleteDataAnalysisType(data);
    },
  },
};
