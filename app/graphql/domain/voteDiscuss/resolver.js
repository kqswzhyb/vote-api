'use strict';

module.exports = {
  Query: {
    // 查询单个
    voteDiscuss(root, { id }, ctx) {
      return ctx.connector.voteDiscuss.fetchById(id);
    },
    // 查询所有
    voteDiscussList(root, data, ctx) {
      return ctx.connector.voteDiscuss.fetchList(data);
    },
  },
  Mutation: {
    //创建
    createVoteDiscuss(root, data, ctx) {
      return ctx.connector.voteDiscuss.createVoteDiscuss(data,ctx);
    },
    //更新
    updateVoteDiscuss(root, data, ctx) {
      return ctx.connector.voteDiscuss.updateVoteDiscuss(data,ctx);
    },
    //删除
    deleteVoteDiscuss(root, data, ctx) {
      return ctx.connector.voteDiscuss.deleteVoteDiscuss(data);
    },
  }
};
