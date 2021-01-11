"use strict";

module.exports = {
  Query: {
    // 查询单个
    dic(root, { id }, ctx) {
      return ctx.connector.dic.fetchById(id);
    },
    // 查询所有
    dicList(root, data, ctx) {
      return ctx.connector.dic.fetchList(data);
    },
    // 查询总数
    dicCount(root, data, ctx) {
      return ctx.connector.dic.fetchCount(data);
    },
  },
  Mutation: {
    //创建
    createDic(root, data, ctx) {
      return ctx.connector.dic.createDic(data, ctx);
    },
    //更新
    updateDic(root, data, ctx) {
      return ctx.connector.dic.updateDic(data, ctx);
    },
    //删除
    deleteDic(root, data, ctx) {
      return ctx.connector.dic.deleteDic(data);
    },
  },
};
