'use strict';

module.exports = {
  Query: {
    // 查询单个用户
    user(root, { id }, ctx) {
      return ctx.connector.user.fetchById(id);
    },
    // 查询多个用户
    users(root, { id }, ctx) {
      return ctx.connector.user.fetchByIds(id);
    },
    // 查询所有用户
    userList(root, data, ctx) {
      return ctx.connector.user.fetchList(data);
    },
  },
};
