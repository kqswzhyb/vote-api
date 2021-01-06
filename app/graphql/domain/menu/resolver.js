"use strict";

module.exports = {
  Query: {
    // 查询单个
    menu(root, { id }, ctx) {
      return ctx.connector.menu.fetchById(id);
    },
    // 查询所有
    menuList(root, data, ctx) {
      return ctx.connector.menu.fetchList(data);
    },
  },
  Mutation: {
    //创建
    createMenu(root, data, ctx) {
      return ctx.connector.menu.createMenu(data, ctx);
    },
    //更新
    updateMenu(root, data, ctx) {
      return ctx.connector.menu.updateMenu(data, ctx);
    },
    //删除
    deleteMenu(root, data, ctx) {
      return ctx.connector.menu.deleteMenu(data);
    },
  },
};
