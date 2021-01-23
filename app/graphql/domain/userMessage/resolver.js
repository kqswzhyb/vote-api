"use strict";

module.exports = {
  Query: {
    // 查询单个
    userMessage(root, { id }, ctx) {
      return ctx.connector.userMessage.fetchById(id);
    },
    // 查询所有
    userMessageList(root, data, ctx) {
      return ctx.connector.userMessage.fetchList(data);
    },
    // 查询总数
    userMessageCount(root, data, ctx) {
      return ctx.connector.userMessage.fetchCount(data);
    },
  },
  Mutation: {
    //创建
    createUserMessage(root, data, ctx) {
      return ctx.connector.userMessage.createUserMessage(data, ctx);
    },
    //批量创建
    batchCreateUserMessage(root, data, ctx) {
      return ctx.connector.userMessage.batchCreateUserMessage(data, ctx);
    },
    //更新
    updateUserMessage(root, data, ctx) {
      return ctx.connector.userMessage.updateUserMessage(data, ctx);
    },
    //删除
    deleteUserMessage(root, data, ctx) {
      return ctx.connector.userMessage.deleteUserMessage(data);
    },
  },
};
