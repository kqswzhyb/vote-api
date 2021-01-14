"use strict";

module.exports = {
  Query: {
    // 查询单个
    vote(root, { id }, ctx) {
      return ctx.connector.vote.fetchById(id);
    },
    // 查询所有
    voteList(root, data, ctx) {
      return ctx.connector.vote.fetchList(data);
    },
    // 查询总数
    voteCount(root, data, ctx) {
      return ctx.connector.vote.fetchCount(data);
    },
  },
  Mutation: {
    //创建
    createVote(root, data, ctx) {
      return ctx.connector.vote.createVote(data, ctx);
    },
    //更新
    updateVote(root, data, ctx) {
      return ctx.connector.vote.updateVote(data, ctx);
    },
    //草稿更新
    draftUpdateVote(root, data, ctx) {
      return ctx.connector.vote.updateVote(data, ctx);
    },
    //更新就绪
    readyVote(root, data, ctx) {
      return ctx.connector.vote.readyVote(data, ctx);
    },
  },
};
