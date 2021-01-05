"use strict";

module.exports = {
  Query: {
    // 查询单个
    roleMenu(root, { id }, ctx) {
      return ctx.connector.roleMenu.fetchById(id);
    },
    // 查询所有
    roleMenuList(root, data, ctx) {
      return ctx.connector.roleMenu.fetchList(data);
    },
  },
  Mutation: {
    //创建
    createRoleMenu(root, data, ctx) {
      return ctx.connector.roleMenu.createRoleMenu(data, ctx);
    },
    //更新
    updateRoleMenu(root, data, ctx) {
      return ctx.connector.roleMenu.updateRoleMenu(data, ctx);
    },
    //删除
    deleteRoleMenu(root, data, ctx) {
      return ctx.connector.roleMenu.deleteRoleMenu(data);
    },
  },
};
