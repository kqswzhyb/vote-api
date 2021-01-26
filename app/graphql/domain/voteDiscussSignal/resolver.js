'use strict';

module.exports = {
  Query: {
    // 查询单个
    voteDiscussSignal(root, { id }, ctx) {
      return ctx.connector.voteDiscussSignal.fetchById(id);
    },
    // 查询所有
    voteDiscussSignalList(root, data, ctx) {
      return ctx.connector.voteDiscussSignal.fetchList(data);
    },
  },
  Mutation: {
    //创建
    createVoteDiscussSignal(root, data, ctx) {
      return ctx.connector.voteDiscussSignal.createVoteDiscussSignal(data,ctx);
    },
    //更新
    updateVoteDiscussSignal(root, data, ctx) {
      return ctx.connector.voteDiscussSignal.updateVoteDiscussSignal(data,ctx);
    },
    //删除
    deleteVoteDiscussSignal(root, data, ctx) {
      return ctx.connector.voteDiscussSignal.deleteVoteDiscussSignal(data,ctx);
    },
  }
};
