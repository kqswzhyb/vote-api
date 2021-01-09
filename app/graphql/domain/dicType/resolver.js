"use strict";

module.exports = {
  Query: {
    // 查询单个
    dicType(root, { id }, ctx) {
      return ctx.connector.dicType.fetchById(id);
    },
    // 查询所有
    dicTypeList(root, data, ctx) {
      return ctx.connector.dicType.fetchList(data);
    },
  },
  Mutation: {
    //创建
    createDicType(root, data, ctx) {
      return ctx.connector.dicType.createDicType(data, ctx);
    },
    //更新
    updateDicType(root, data, ctx) {
      return ctx.connector.dicType.updateDicType(data, ctx);
    },
    //删除
    deleteDicType(root, data, ctx) {
      return ctx.connector.dicType.deleteDicType(data);
    },
  },
};
