"use strict";

module.exports = {
  Query: {
    // 查询单个
    voteConfig(root, { id }, ctx) {
      return ctx.connector.voteConfig.fetchById(id);
    },
    // 查询所有
    voteConfigList(root, data, ctx) {
      return ctx.connector.voteConfig.fetchList(data);
    },
  },
  Mutation: {
    //创建
    createVoteConfig(root, data, ctx) {
      return ctx.connector.voteConfig.createVoteConfig(data, ctx);
    },
    //更新
    updateVoteConfig(root, data, ctx) {
      return ctx.connector.voteConfig.updateVoteConfig(data, ctx);
    },
  },
};
