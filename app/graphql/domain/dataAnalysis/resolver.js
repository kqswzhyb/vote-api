"use strict";

module.exports = {
  Query: {
    // 查询单个
    dataAnalysis(root, { id }, ctx) {
      return ctx.connector.dataAnalysis.fetchById(id);
    },
    // 查询所有
    dataAnalysisList(root, data, ctx) {
      return ctx.connector.dataAnalysis.fetchList(data);
    },
    // 查询总数
    dataAnalysisCount(root, data, ctx) {
      return ctx.connector.dataAnalysis.fetchCount(data);
    },
  },
  Mutation: {
    //创建
    createDataAnalysis(root, data, ctx) {
      return ctx.connector.dataAnalysis.createDataAnalysis(data, ctx);
    },
    //更新
    updateDataAnalysis(root, data, ctx) {
      return ctx.connector.dataAnalysis.updateDataAnalysis(data, ctx);
    },
    //删除
    deleteDataAnalysis(root, data, ctx) {
      return ctx.connector.dataAnalysis.deleteDataAnalysis(data);
    },
  },
};
