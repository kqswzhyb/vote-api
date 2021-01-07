'use strict';

module.exports = {
  Query: {
    // 查询单个用户
    user(root, { id }, ctx) {
      return ctx.connector.user.fetchById(id);
    },
    // 查询所有用户
    userList(root, data, ctx) {
      return ctx.connector.user.fetchList(data);
    },
    // 查询总数
    userCount(root, data, ctx) {
      return ctx.connector.user.fetchCount(data);
    },
  },
  Mutation: {
    //创建用户
    createUser(root, data, ctx) {
      return ctx.connector.user.createUser(data,ctx);
    },
    //更新用户
    updateUser(root, data, ctx) {
      return ctx.connector.user.updateUser(data,ctx);
    },
    //删除用户
    deleteUser(root, data, ctx) {
      return ctx.connector.user.deleteUser(data);
    },
  }
};
