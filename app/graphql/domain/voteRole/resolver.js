"use strict";

module.exports = {
  Query: {
    // 查询单个
    voteRole(root, { id }, ctx) {
      return ctx.connector.voteRole.fetchById(id);
    },
    // 查询所有
    voteRoleList(root, data, ctx) {
      return ctx.connector.voteRole.fetchList(data);
    },
    // 查询总数
    voteRoleCount(root, data, ctx) {
        return ctx.connector.voteRole.fetchCount(data);
      },
  },
  Mutation: {
    //创建
    createVoteRole(root, data, ctx) {
      return ctx.connector.voteRole.createVoteRole(data, ctx);
    },
    //更新
    updateVoteRole(root, data, ctx) {
      return ctx.connector.voteRole.updateVoteRole(data, ctx);
    },
    //删除
    deleteVoteRole(root, data, ctx) {
        return ctx.connector.voteRole.deleteVoteRole(data);
      },
  },
};
