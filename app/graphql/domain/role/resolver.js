"use strict";

module.exports = {
  Query: {
    // 查询单个
    role(root, { id }, ctx) {
      return ctx.connector.role.fetchById(id);
    },
    // 查询所有
    roleList(root, data, ctx) {
      return ctx.connector.role.fetchList(data);
    },
  },
  Mutation: {
    //创建
    createRole(root, data, ctx) {
      return ctx.connector.role.createRole(data, ctx);
    },
    //更新
    updateRole(root, data, ctx) {
      return ctx.connector.role.updateRole(data, ctx);
    },
  },
};
